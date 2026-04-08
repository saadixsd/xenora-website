import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Twitter, Instagram, Linkedin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/config/routes';
import { cn } from '@/lib/utils';

interface ConnectionRow {
  id: string;
  platform: string;
  status: string;
  scopes: string[] | null;
  connected_at: string | null;
}

const PLATFORMS = [
  {
    id: 'gmail',
    label: 'Gmail',
    icon: Mail,
    description: 'Read inbound emails and send approved replies via the Leads Agent.',
    scopes: ['gmail.readonly', 'gmail.send'],
  },
  {
    id: 'x',
    label: 'X (Twitter)',
    icon: Twitter,
    description: 'Analyze post performance and publish approved content via the Content Agent.',
    scopes: ['tweet.read', 'tweet.write', 'users.read'],
  },
  {
    id: 'instagram',
    label: 'Instagram',
    icon: Instagram,
    description: 'Pull engagement data and publish content via the Instagram Graph API.',
    scopes: ['instagram_basic', 'instagram_content_publish'],
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    icon: Linkedin,
    description: 'Analyze professional content performance and publish approved posts.',
    scopes: ['r_liteprofile', 'w_member_social'],
  },
];

const STATUS_STYLES: Record<string, { dot: string; label: string; bg: string }> = {
  connected: {
    dot: 'bg-emerald-500',
    label: 'Connected',
    bg: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  },
  expired: {
    dot: 'bg-amber-500',
    label: 'Expired',
    bg: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
  },
  disconnected: {
    dot: 'bg-zinc-400',
    label: 'Not connected',
    bg: 'bg-muted text-muted-foreground',
  },
};

export default function Connections() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [connections, setConnections] = useState<ConnectionRow[]>([]);

  useEffect(() => {
    if (!user) return;
    (supabase.from('connections' as any) as any)
      .select('id, platform, status, scopes, connected_at')
      .eq('user_id', user.id)
      .then(({ data }: { data: unknown }) => {
        if (data) setConnections(data as ConnectionRow[]);
      });
  }, [user]);

  const getConnection = (platformId: string) =>
    connections.find((c) => c.platform === platformId);

  return (
    <div className="mx-auto min-h-0 min-w-0 max-w-2xl px-3 py-4 sm:px-6 sm:py-6 lg:px-8 font-dm-sans">
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
        You always approve before anything sends.
      </p>

      <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
        {PLATFORMS.map((platform) => {
          const conn = getConnection(platform.id);
          const status = conn?.status || 'disconnected';
          const styles = STATUS_STYLES[status] || STATUS_STYLES.disconnected;

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
                      <span className={cn('rounded-md px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-medium', styles.bg)}>
                        {styles.label}
                      </span>
                    </div>
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
                  {status === 'connected' ? (
                    <button
                      type="button"
                      disabled
                      className="rounded-lg border border-border px-3 py-1.5 text-[11px] sm:text-[12px] text-muted-foreground opacity-60 min-h-[36px] sm:min-h-0"
                      title="Disconnect is coming soon"
                    >
                      Disconnect
                    </button>
                  ) : status === 'expired' ? (
                    <button
                      type="button"
                      disabled
                      className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-[11px] sm:text-[12px] text-amber-700 opacity-60 dark:text-amber-400 min-h-[36px] sm:min-h-0"
                      title="Reconnect is coming soon"
                    >
                      Reconnect
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="rounded-lg bg-primary px-3 py-1.5 text-[11px] sm:text-[12px] font-medium text-primary-foreground opacity-60 min-h-[36px] sm:min-h-0"
                      title="OAuth integration is coming soon"
                    >
                      Connect
                    </button>
                  )}
                </div>
              </div>

              {conn?.connected_at && (
                <p className="mt-3 border-t border-border pt-2 text-[10px] sm:text-[11px] text-muted-foreground">
                  Connected {new Date(conn.connected_at).toLocaleDateString()}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-4 sm:mt-6 rounded-lg border border-border bg-muted/30 p-3 text-center text-[11px] sm:text-[12px] text-muted-foreground">
        OAuth integration is coming soon. Tokens will be encrypted and stored securely -- never in the browser.
      </p>
    </div>
  );
}
