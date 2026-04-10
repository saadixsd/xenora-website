import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { NORA_VOICE_TTS_KEY, isNoraVoiceTtsEnabled } from '@/lib/noraTts';
import { createPortalSession } from '@/lib/stripeEdge';
import {
  STRIPE_PAYMENT_LINK_PLUS,
  STRIPE_PAYMENT_LINK_PRO,
  buildStripePaymentLinkUrl,
} from '@/config/stripePaymentLinks';
import { isPaidNoraSubscription, type BillingSubscriptionRow } from '@/lib/billing';

function csvEscape(s: string): string {
  const t = s.replace(/"/g, '""');
  return `"${t}"`;
}

const Settings = () => {
  const { user, session } = useAuth();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [preferredTone, setPreferredTone] = useState('professional');
  const [defaultAudience, setDefaultAudience] = useState('founders');
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [voiceReadAloud, setVoiceReadAloud] = useState(() => isNoraVoiceTtsEnabled());
  const [billingRow, setBillingRow] = useState<BillingSubscriptionRow | null>(null);
  const [chatsUsedMonth, setChatsUsedMonth] = useState<number | null>(null);
  const [runsUsedMonth, setRunsUsedMonth] = useState<number | null>(null);
  const [billingLoading, setBillingLoading] = useState(false);
  const [checkoutBusy, setCheckoutBusy] = useState<'plus' | 'pro' | null>(null);
  const [portalBusy, setPortalBusy] = useState(false);

  const persistVoiceTts = useCallback((on: boolean) => {
    try {
      localStorage.setItem(NORA_VOICE_TTS_KEY, on ? '1' : '0');
    } catch {
      /* */
    }
    setVoiceReadAloud(on);
  }, []);

  useEffect(() => {
    if (!user) return;
    setEmail(user.email ?? '');
    supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setDisplayName(data.display_name || '');
          setPreferredTone(data.preferred_tone || 'professional');
          setDefaultAudience(data.default_audience || 'founders');
        }
      });
  }, [user]);

  const loadBilling = useCallback(async () => {
    if (!user?.id) return;
    setBillingLoading(true);
    try {
      const [billRes, chatsRes, runsRes] = await Promise.all([
        supabase.from('billing_subscriptions' as any).select('*').eq('user_id', user.id).maybeSingle(),
        supabase.rpc('get_nora_chat_usage_this_month' as any, { p_user_id: user.id }),
        supabase.rpc('get_workflow_run_count_this_month' as any, { p_user_id: user.id }),
      ]);
      setBillingRow((billRes.data as BillingSubscriptionRow | null) ?? null);
      setChatsUsedMonth(typeof chatsRes.data === 'number' ? chatsRes.data : null);
      setRunsUsedMonth(typeof runsRes.data === 'number' ? runsRes.data : null);
    } finally {
      setBillingLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    void loadBilling();
  }, [loadBilling]);

  const billingCallback = searchParams.get('billing');
  useEffect(() => {
    if (billingCallback === 'success') {
      toast({
        title: 'Subscription updated',
        description: 'Thanks — Stripe may take a few seconds to sync. Refresh usage below if needed.',
      });
      void loadBilling();
      setSearchParams({}, { replace: true });
    } else if (billingCallback === 'canceled') {
      toast({ title: 'Checkout canceled' });
      setSearchParams({}, { replace: true });
    }
  }, [billingCallback, setSearchParams, toast, loadBilling]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    const { error: profileErr } = await supabase
      .from('profiles')
      .update({
        display_name: displayName,
        preferred_tone: preferredTone,
        default_audience: defaultAudience,
      })
      .eq('user_id', user.id);

    if (profileErr) {
      toast({ title: 'Error', description: profileErr.message, variant: 'destructive' });
      setSaving(false);
      return;
    }

    const trimmedEmail = email.trim();
    const emailChanged = trimmedEmail && trimmedEmail !== user.email;

    const { error: metaErr } = await supabase.auth.updateUser({
      data: { display_name: displayName.trim() || undefined },
      ...(emailChanged ? { email: trimmedEmail } : {}),
    });

    if (metaErr) {
      toast({ title: 'Profile saved', description: 'Email update failed: ' + metaErr.message, variant: 'destructive' });
      setSaving(false);
      return;
    }

    if (emailChanged) {
      toast({
        title: 'Settings saved',
        description: 'If you changed email, check your inbox to confirm the new address (Supabase may require verification).',
      });
    } else {
      toast({ title: 'Settings saved' });
    }
    setSaving(false);
  };

  const fetchRunsExport = async () => {
    if (!user) return [];
    const { data: runs } = await supabase
      .from('workflow_runs')
      .select('*, workflow_outputs(*)')
      .eq('user_id', user.id);
    return runs ?? [];
  };

  const handleExportJson = async () => {
    if (!user) return;
    setExporting(true);
    const runs = await fetchRunsExport();
    const blob = new Blob([JSON.stringify(runs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nora-export.json';
    a.click();
    URL.revokeObjectURL(url);
    setExporting(false);
  };

  const handleExportCsv = async () => {
    if (!user) return;
    setExporting(true);
    const runs = await fetchRunsExport();
    const lines: string[] = [
      ['run_id', 'created_at', 'status', 'template_id', 'input_snippet', 'output_type', 'output_content'].join(','),
    ];
    for (const row of runs as Record<string, unknown>[]) {
      const rid = String(row.id);
      const created = String(row.created_at ?? '');
      const status = String(row.status ?? '');
      const tid = String(row.template_id ?? '');
      const inputSnippet = String(row.input_text ?? '').slice(0, 200);
      const outputs = (row.workflow_outputs as Record<string, unknown>[] | undefined) ?? [];
      if (outputs.length === 0) {
        lines.push(
          [rid, created, status, tid, csvEscape(inputSnippet), '', ''].join(','),
        );
      } else {
        for (const o of outputs) {
          lines.push(
            [
              rid,
              created,
              status,
              tid,
              csvEscape(inputSnippet),
              csvEscape(String(o.output_type ?? '')),
              csvEscape(String(o.content ?? '').slice(0, 5000)),
            ].join(','),
          );
        }
      }
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nora-export.csv';
    a.click();
    URL.revokeObjectURL(url);
    setExporting(false);
    toast({ title: 'CSV downloaded' });
  };

  const startCheckout = (plan: 'plus' | 'pro') => {
    if (!user?.id) {
      toast({ title: 'Sign in required', variant: 'destructive' });
      return;
    }
    setCheckoutBusy(plan);
    const base = plan === 'pro' ? STRIPE_PAYMENT_LINK_PRO : STRIPE_PAYMENT_LINK_PLUS;
    const url = buildStripePaymentLinkUrl(base, user.id, user.email ?? null);
    window.location.href = url;
    window.setTimeout(() => setCheckoutBusy(null), 12_000);
  };

  const openPortal = async () => {
    const token = session?.access_token;
    if (!token) {
      toast({ title: 'Sign in required', variant: 'destructive' });
      return;
    }
    setPortalBusy(true);
    try {
      const url = await createPortalSession(token);
      window.location.href = url;
    } catch (e) {
      toast({
        title: 'Could not open billing portal',
        description: e instanceof Error ? e.message : 'Try again later.',
        variant: 'destructive',
      });
    } finally {
      setPortalBusy(false);
    }
  };

  const handlePrintSummary = async () => {
    if (!user) return;
    setExporting(true);
    const runs = await fetchRunsExport();
    const list = runs as Record<string, unknown>[];
    const completed = list.filter((r) => r.status === 'completed');
    const minutes = completed.reduce((s, r) => s + Number(r.estimated_minutes_saved ?? 0), 0);
    const lines: string[] = [
      'Nora — data summary',
      `Generated: ${new Date().toISOString()}`,
      `Total runs: ${list.length}`,
      `Completed: ${completed.length}`,
      `Est. minutes saved (sum): ${minutes}`,
      '',
      '— Runs —',
    ];
    for (const r of list.slice(0, 80)) {
      lines.push('');
      lines.push(`Run ${r.id} | ${r.status} | ${r.created_at}`);
      lines.push(String(r.input_text ?? '').slice(0, 400));
      const outs = (r.workflow_outputs as { output_type?: string; content?: string }[] | undefined) ?? [];
      for (const o of outs.slice(0, 12)) {
        lines.push(`  [${o.output_type}] ${String(o.content ?? '').slice(0, 300)}`);
      }
    }
    const text = lines.join('\n');
    const w = window.open('', '_blank');
    if (!w) {
      toast({ title: 'Pop-up blocked', description: 'Allow pop-ups to print the summary.', variant: 'destructive' });
      setExporting(false);
      return;
    }
    w.document.write(
      `<!DOCTYPE html><html><head><title>Nora summary</title></head><body><pre style="white-space:pre-wrap;font-family:system-ui,sans-serif;padding:1rem;">${text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')}</pre></body></html>`,
    );
    w.document.close();
    w.focus();
    w.print();
    w.close();
    setExporting(false);
    toast({ title: 'Print dialog opened', description: 'Choose “Save as PDF” in the print dialog if you prefer a PDF file.' });
  };

  return (
    <div className="mx-auto min-h-0 min-w-0 max-w-2xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-xl font-semibold text-foreground sm:text-2xl">Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage your profile and preferences.</p>

      <div className="mt-8 space-y-6">
        <div className="surface-panel p-5">
          <h2 className="text-sm font-medium text-foreground">Profile</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm text-muted-foreground">Display name</label>
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="bg-card/50 border-border"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-muted-foreground">Email</label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                autoComplete="email"
                className="bg-card/50 border-border"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Changing email may trigger a confirmation message from your auth provider.
              </p>
            </div>
          </div>
        </div>

        <div className="surface-panel p-5">
          <h2 className="text-sm font-medium text-foreground">Billing</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Free tier: 5 workflow runs and 3 Ask Nora messages per calendar month (UTC). Nora Plus and Nora Pro remove those caps (fair use applies).
          </p>
          {billingLoading ? (
            <p className="mt-4 text-sm text-muted-foreground">Loading billing…</p>
          ) : (
            <div className="mt-4 space-y-3 text-sm">
              <p>
                <span className="text-muted-foreground">Current plan: </span>
                <span className="font-medium text-foreground">
                  {isPaidNoraSubscription(billingRow)
                    ? billingRow!.plan === 'pro'
                      ? 'Nora Pro'
                      : 'Nora Plus'
                    : 'Free'}
                </span>
                {billingRow && (
                  <span className="text-muted-foreground">
                    {' '}
                    — status: {billingRow.status}
                  </span>
                )}
              </p>
              {!isPaidNoraSubscription(billingRow) && (
                <p className="text-xs text-muted-foreground">
                  Usage this month (UTC):{' '}
                  {chatsUsedMonth !== null && runsUsedMonth !== null
                    ? `${chatsUsedMonth}/3 Ask Nora messages · ${runsUsedMonth}/5 workflow runs (non-failed)`
                    : '—'}
                </p>
              )}
              <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:flex-wrap">
                {!isPaidNoraSubscription(billingRow) && (
                  <>
                    <Button
                      type="button"
                      size="sm"
                      disabled={checkoutBusy !== null}
                      onClick={() => void startCheckout('plus')}
                    >
                      {checkoutBusy === 'plus' ? 'Redirecting…' : 'Upgrade — Nora Plus ($13.99/mo)'}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      disabled={checkoutBusy !== null}
                      onClick={() => void startCheckout('pro')}
                    >
                      {checkoutBusy === 'pro' ? 'Redirecting…' : 'Upgrade — Nora Pro ($19.99/mo)'}
                    </Button>
                  </>
                )}
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={portalBusy || !billingRow?.stripe_customer_id}
                  onClick={() => void openPortal()}
                >
                  {portalBusy ? 'Opening…' : 'Manage billing (Stripe portal)'}
                </Button>
              </div>
              {!billingRow?.stripe_customer_id && (
                <p className="text-[11px] text-muted-foreground">
                  Manage billing unlocks after you start checkout once (Stripe customer is created on first upgrade).
                </p>
              )}
            </div>
          )}
        </div>

        <div className="surface-panel p-5">
          <h2 className="text-sm font-medium text-foreground">Voice</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Read-aloud uses your device&apos;s built-in speech (no extra API). Keyboard shortcut Cmd+Shift+N (Ctrl+Shift+N on Windows) runs dictate, then Nora, then optional readback.
          </p>
          <label className="mt-4 flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={voiceReadAloud}
              onChange={(e) => persistVoiceTts(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary/30"
            />
            <span>
              <span className="text-sm font-medium text-foreground">Read Nora replies aloud</span>
              <span className="mt-0.5 block text-xs text-muted-foreground">
                When off, voice assistant still transcribes and sends; only the spoken reply is skipped.
              </span>
            </span>
          </label>
        </div>

        <div className="surface-panel p-5">
          <h2 className="text-sm font-medium text-foreground">Preferences</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm text-muted-foreground">Preferred tone</label>
              <select
                value={preferredTone}
                onChange={(e) => setPreferredTone(e.target.value)}
                className="w-full rounded-lg border border-border bg-card/50 px-3 py-2 text-sm text-foreground outline-none focus:border-primary/30"
              >
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="bold">Bold</option>
                <option value="witty">Witty</option>
                <option value="inspirational">Inspirational</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-muted-foreground">Default audience</label>
              <Input
                value={defaultAudience}
                onChange={(e) => setDefaultAudience(e.target.value)}
                placeholder="e.g. founders, creators, developers"
                className="bg-card/50 border-border"
              />
            </div>
          </div>
        </div>

        <div className="surface-panel p-5">
          <h2 className="text-sm font-medium text-foreground">Export</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Download your workflow runs and outputs. Print summary opens a dialog where you can save as PDF.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Button variant="outline" onClick={() => void handleExportJson()} disabled={exporting}>
              Raw JSON
            </Button>
            <Button variant="outline" onClick={() => void handleExportCsv()} disabled={exporting}>
              Download CSV
            </Button>
            <Button variant="outline" onClick={() => void handlePrintSummary()} disabled={exporting}>
              Print / PDF summary
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button onClick={() => void handleSave()} disabled={saving}>
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
