import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { agentEditPath } from '@/config/routes';
import { ROUTES } from '@/config/routes';

interface AgentRow {
  id: string;
  type: string;
  status: string;
  last_run_at: string | null;
}

interface ConnectionRow {
  platform: string;
  status: string;
}

const AGENT_META: Record<string, { label: string; description: string; platforms: string[] }> = {
  content: {
    label: 'Content Agent',
    description: 'Raw thoughts in. X posts, hooks, LinkedIn drafts, and CTAs out -- ready to review.',
    platforms: ['x', 'instagram', 'linkedin'],
  },
  leads: {
    label: 'Leads Agent',
    description: 'Scores inbound, drafts a reply, queues follow-up after ~48h. You approve before send.',
    platforms: ['gmail'],
  },
  research: {
    label: 'Research Agent',
    description: 'Fetches public signals from Reddit and X, returns pain themes and content angles.',
    platforms: ['x'],
  },
};

const DOT_STYLE: Record<string, string> = {
  active: 'bg-emerald-500',
  running: 'bg-amber-500 animate-pulse',
  paused: 'bg-zinc-400',
};

const STATUS_LABEL: Record<string, string> = {
  active: 'Active',
  running: 'Running',
  paused: 'Paused',
};

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return 'Never';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function AgentCards() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [agents, setAgents] = useState<AgentRow[]>([]);
  const [connections, setConnections] = useState<ConnectionRow[]>([]);

  useEffect(() => {
    if (!user) return;

    (supabase.from('agents' as any) as any)
      .select('id, type, status, last_run_at')
      .eq('user_id', user.id)
      .then(({ data }: { data: unknown }) => {
        if (data) setAgents(data as AgentRow[]);
      });

    (supabase.from('connections' as any) as any)
      .select('platform, status')
      .eq('user_id', user.id)
      .then(({ data }: { data: unknown }) => {
        if (data) setConnections(data as ConnectionRow[]);
      });

    const channel = supabase
      .channel('agent-status')
      .on(
        'postgres_changes' as any,
        { event: 'UPDATE', schema: 'public', table: 'agents', filter: `user_id=eq.${user.id}` },
        (payload: any) => {
          const updated = payload.new as AgentRow;
          setAgents((prev) =>
            prev.map((a) => (a.id === updated.id ? { ...a, status: updated.status, last_run_at: updated.last_run_at } : a)),
          );
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const isConnected = (platform: string) =>
    connections.some((c) => c.platform === platform && c.status === 'connected');

  const ordered = ['content', 'leads', 'research']
    .map((t) => agents.find((a) => a.type === t))
    .filter(Boolean) as AgentRow[];

  return (
    <div className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {ordered.map((agent) => {
        const meta = AGENT_META[agent.type];
        if (!meta) return null;

        return (
          <div
            key={agent.id}
            className="min-w-0 rounded-xl border border-border bg-card p-3 sm:p-4 transition-all duration-200 hover:border-primary/40 hover:shadow-[0_2px_12px_rgba(45,90,61,0.08)]"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className={cn('h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full shrink-0', DOT_STYLE[agent.status] || DOT_STYLE.paused)} />
                <span className="text-[10px] sm:text-[11px] font-medium text-muted-foreground">
                  {STATUS_LABEL[agent.status] || 'Unknown'}
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] text-muted-foreground truncate ml-2">
                {timeAgo(agent.last_run_at)}
              </span>
            </div>

            <h3 className="text-[13px] sm:text-sm font-medium text-foreground">{meta.label}</h3>
            <p className="mt-1 text-[11px] sm:text-[12px] leading-relaxed text-muted-foreground line-clamp-2">{meta.description}</p>

            <div className="mt-2 sm:mt-2.5 flex flex-wrap gap-1 sm:gap-1.5">
              {meta.platforms.map((p) => (
                <span
                  key={p}
                  className={cn(
                    'rounded-md px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-medium capitalize',
                    isConnected(p)
                      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                      : 'bg-muted text-muted-foreground',
                  )}
                >
                  {p === 'gmail' ? 'Gmail' : p === 'x' ? 'X' : p === 'instagram' ? 'IG' : 'LinkedIn'}
                  {isConnected(p) ? '' : ' --'}
                </span>
              ))}
            </div>

            <div className="mt-2.5 sm:mt-3 flex flex-wrap gap-1.5 sm:gap-2 border-t border-border pt-2.5 sm:pt-3">
              <button
                type="button"
                onClick={() => navigate(`${ROUTES.dashboard.runNew}?agent_type=${agent.type}`)}
                className="rounded-md border border-border bg-primary px-2 sm:px-2.5 py-1 text-[10px] sm:text-[11px] font-medium text-primary-foreground transition-colors hover:opacity-90 min-h-[32px] sm:min-h-0"
              >
                Run now
              </button>
              <button
                type="button"
                onClick={() => navigate(agentEditPath(agent.id))}
                className="rounded-md border border-border bg-muted/50 px-2 sm:px-2.5 py-1 text-[10px] sm:text-[11px] text-muted-foreground transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary min-h-[32px] sm:min-h-0"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => navigate(ROUTES.dashboard.history)}
                className="rounded-md border border-border bg-muted/50 px-2 sm:px-2.5 py-1 text-[10px] sm:text-[11px] text-muted-foreground transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary min-h-[32px] sm:min-h-0"
              >
                Logs
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
