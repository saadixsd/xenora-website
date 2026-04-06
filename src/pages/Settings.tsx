import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

function csvEscape(s: string): string {
  const t = s.replace(/"/g, '""');
  return `"${t}"`;
}

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [preferredTone, setPreferredTone] = useState('professional');
  const [defaultAudience, setDefaultAudience] = useState('founders');
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);

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
