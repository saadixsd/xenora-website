import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Mail, Twitter, Instagram, Linkedin, Loader2, CheckCircle2 } from 'lucide-react';
import { ROUTES } from '@/config/routes';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const PLATFORMS = [
  {
    id: 'gmail' as const,
    label: 'Gmail',
    icon: Mail,
    description: 'Read inbound emails and send approved replies via the Leads Agent.',
    scopes: ['gmail.readonly', 'gmail.send'],
  },
  {
    id: 'x' as const,
    label: 'X (Twitter)',
    icon: Twitter,
    description: 'Analyze post performance and publish approved content via the Content Agent.',
    scopes: ['tweet.read', 'tweet.write', 'users.read'],
  },
  {
    id: 'instagram' as const,
    label: 'Instagram',
    icon: Instagram,
    description: 'Pull engagement data and publish content via the Instagram Graph API.',
    scopes: ['instagram_basic', 'instagram_content_publish'],
  },
  {
    id: 'linkedin' as const,
    label: 'LinkedIn',
    icon: Linkedin,
    description: 'Analyze professional content performance and publish approved posts.',
    scopes: ['r_liteprofile', 'w_member_social'],
  },
];

type ProviderId = (typeof PLATFORMS)[number]['id'];

interface ConnectionRow {
  provider: ProviderId;
  account_label: string | null;
  status: 'active' | 'revoked' | 'expired';
  connected_at: string;
  expires_at: string | null;
}

export default function Connections() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [connections, setConnections] = useState<Record<string, ConnectionRow>>({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<ProviderId | null>(null);

  const loadConnections = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('user_connections')
      .select('provider, account_label, status, connected_at, expires_at');
    if (!error && data) {
      const map: Record<string, ConnectionRow> = {};
      for (const row of data) map[row.provider] = row as ConnectionRow;
      setConnections(map);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadConnections();
  }, [loadConnections]);

  // Surface OAuth callback toasts
  useEffect(() => {
    const connected = searchParams.get('connected');
    const error = searchParams.get('error');
    if (connected) {
      toast({ title: 'Connected', description: `${connected} is now linked to your account.` });
      setSearchParams({}, { replace: true });
      loadConnections();
    } else if (error) {
      toast({ title: 'Connection failed', description: error, variant: 'destructive' });
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams, loadConnections]);

  const handleConnect = async (provider: ProviderId) => {
    setBusy(provider);
    try {
      const { data, error } = await supabase.functions.invoke('oauth-start', {
        body: null,
        method: 'GET',
        // supabase-js doesn't pass query strings; encode in path:
        // We use a fetch fallback below.
      } as never);

      // Fallback to direct fetch with query string (functions.invoke strips query params).
      const session = (await supabase.auth.getSession()).data.session;
      if (!session) {
        toast({ title: 'Sign in required', description: 'Please sign in first.', variant: 'destructive' });
        setBusy(null);
        return;
      }
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/oauth-start?provider=${provider}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const json = await res.json();
      if (!res.ok || !json.url) {
        toast({
          title: 'Cannot start connection',
          description: json.error ?? 'Provider not configured. Add OAuth credentials in Lovable Cloud secrets.',
          variant: 'destructive',
        });
        setBusy(null);
        return;
      }
      // Append frontend base so the callback knows where to send the user back
      const finalUrl = new URL(json.url);
      // Pass our frontend origin via state? It's already in our signed state via redirect_uri logic.
      // Instead, we relay it via a separate query param on the callback redirect link by encoding in extension here:
      // The callback uses the referer/origin header — modern browsers set referer when redirecting from the provider,
      // so the user lands back on this domain.
      window.location.href = finalUrl.toString();
      // Pass frontend hint via sessionStorage so other tabs can still recover; not strictly needed.
      sessionStorage.setItem('oauth_frontend_origin', window.location.origin);
      void data; void error;
    } catch (e) {
      toast({
        title: 'Cannot start connection',
        description: e instanceof Error ? e.message : 'Unknown error',
        variant: 'destructive',
      });
      setBusy(null);
    }
  };

  const handleDisconnect = async (provider: ProviderId) => {
    if (!confirm(`Disconnect ${provider}? Agents will no longer be able to act on this account.`)) return;
    setBusy(provider);
    const { error } = await supabase.functions.invoke('disconnect-provider', {
      body: { provider },
    });
    setBusy(null);
    if (error) {
      toast({ title: 'Disconnect failed', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Disconnected', description: `${provider} has been unlinked.` });
    loadConnections();
  };

  return (
    <div className="mx-auto min-h-0 min-w-0 max-w-2xl px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
      <button
        type="button"
        onClick={() => navigate(ROUTES.dashboard.root)}
        className="mb-3 sm:mb-4 flex items-center gap-2 text-[13px] sm:text-sm text-muted-foreground hover:text-foreground min-h-[44px]"
      >
        <ArrowLeft className="h-4 w-4" />
        Dashboard
      </button>

      <h1 className="text-lg font-semibold text-foreground sm:text-2xl">Connections</h1>
      <p className="mt-1 text-[13px] sm:text-sm text-muted-foreground">
        Connect your platforms so agents can read data and take actions on your behalf.
        You always approve before anything sends. Tokens are encrypted and never exposed to the browser.
      </p>

      <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
        {PLATFORMS.map((platform) => {
          const conn = connections[platform.id];
          const isConnected = conn?.status === 'active';
          const isExpired = conn?.status === 'expired';
          const isBusy = busy === platform.id;

          return (
            <div
              key={platform.id}
              className="rounded-xl border border-border bg-card p-3.5 sm:p-5 transition-colors hover:border-primary/20"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <platform.icon className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <h3 className="text-[13px] sm:text-sm font-medium text-foreground">{platform.label}</h3>
                      <span
                        className={cn(
                          'rounded-md px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-medium',
                          isConnected
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                            : isExpired
                              ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                              : 'bg-muted text-muted-foreground',
                        )}
                      >
                        {loading ? '…' : isConnected ? (
                          <span className="inline-flex items-center gap-1">
                            <CheckCircle2 className="h-2.5 w-2.5" /> Connected
                          </span>
                        ) : isExpired ? 'Expired' : 'Not connected'}
                      </span>
                    </div>
                    {isConnected && conn?.account_label && (
                      <p className="mt-0.5 text-[11px] sm:text-[12px] text-foreground/80">
                        {conn.account_label}
                      </p>
                    )}
                    <p className="mt-1 text-[11px] sm:text-[12px] text-muted-foreground leading-relaxed">
                      {platform.description}
                    </p>
                    <div className="mt-1.5 sm:mt-2 flex flex-wrap gap-1">
                      {platform.scopes.map((scope) => (
                        <span
                          key={scope}
                          className="rounded bg-muted px-1.5 py-0.5 text-[9px] sm:text-[10px] font-mono text-muted-foreground"
                        >
                          {scope}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 self-end sm:self-start">
                  {isConnected ? (
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => handleDisconnect(platform.id)}
                      className="rounded-lg border border-border bg-background px-3 py-1.5 text-[11px] sm:text-[12px] font-medium text-foreground hover:bg-muted disabled:opacity-60 min-h-[36px] sm:min-h-0"
                    >
                      {isBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Disconnect'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => handleConnect(platform.id)}
                      className="rounded-lg bg-primary px-3 py-1.5 text-[11px] sm:text-[12px] font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60 min-h-[36px] sm:min-h-0 inline-flex items-center gap-1.5"
                    >
                      {isBusy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                      {isExpired ? 'Reconnect' : 'Connect'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-4 sm:mt-6 rounded-lg border border-border bg-muted/30 p-3 text-center text-[11px] sm:text-[12px] text-muted-foreground">
        Tokens are encrypted at rest with AES-GCM and never sent to the browser.
        You can revoke access at any time from this page or directly inside each provider's settings.
      </p>
    </div>
  );
}
