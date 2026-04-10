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
    description:
      'Turn rough notes into drafts: X posts, hooks, LinkedIn copy, and CTAs. You review before anything ships.',
    platforms: ['x', 'instagram', 'linkedin'],
  },
  leads: {
    label: 'Leads Agent',
    description:
      'Scores inbound, drafts a reply, and can queue a follow-up after about 48h. You approve before send.',
    platforms: ['gmail'],
  },
  research: {
    label: 'Research Agent',
    description: 'Pulls public signals from Reddit and X, then returns pain themes and angles you can use.',
    platforms: ['x'],
  },
};

const DOT_STYLE: Record<string, string> = {
  active: 'bg-[#00c896]',
  running: 'bg-amber-500 animate-pulse',
  paused: 'bg-zinc-500',
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
            className="dash-panel min-w-0 p-3 transition-all duration-200 hover:border-[#00c896]/35 hover:shadow-[0_2px_24px_rgba(0,200,150,0.08)] sm:p-4"
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className={cn('h-2 w-2 shrink-0 rounded-full sm:h-2.5 sm:w-2.5', DOT_STYLE[agent.status] || DOT_STYLE.paused)} />
                <span className="text-[10px] font-medium text-[#8a9bb0] sm:text-[11px]">
                  {STATUS_LABEL[agent.status] || 'Unknown'}
                </span>
              </div>
              <span className="ml-2 truncate text-[10px] text-[#3f5060] sm:text-[11px]">{timeAgo(agent.last_run_at)}</span>
            </div>

            <h3 className="text-[13px] font-medium text-[#f0f4f8] sm:text-sm">{meta.label}</h3>
            <p className="mt-1 line-clamp-3 text-[11px] leading-relaxed text-[#8a9bb0] sm:text-[12px]">{meta.description}</p>

            <div className="mt-2 flex flex-wrap gap-1 sm:mt-2.5 sm:gap-1.5">
              {meta.platforms.map((p) => (
                <span
                  key={p}
                  className={cn(
                    'rounded-md px-1.5 py-0.5 font-space-mono text-[9px] font-medium uppercase tracking-wide sm:px-2 sm:text-[10px]',
                    isConnected(p)
                      ? 'bg-[#00c896]/15 text-[#00c896]'
                      : 'bg-white/[0.04] text-[#3f5060]',
                  )}
                >
                  {p === 'gmail' ? 'Gmail' : p === 'x' ? 'X' : p === 'instagram' ? 'IG' : 'LinkedIn'}
                  {!isConnected(p) && ' · off'}
                </span>
              ))}
            </div>

            <div className="mt-2.5 flex flex-wrap gap-1.5 border-t border-white/[0.06] pt-2.5 sm:mt-3 sm:gap-2">
              <button
                type="button"
                onClick={() => navigate(`${ROUTES.dashboard.runNew}?agent_type=${agent.type}`)}
                className="min-h-[32px] rounded-md bg-[#00c896] px-2.5 py-1 text-[10px] font-medium text-[#041a12] transition-opacity hover:opacity-90 sm:min-h-0 sm:text-[11px]"
              >
                Run now
              </button>
              <button
                type="button"
                onClick={() => navigate(agentEditPath(agent.id))}
                className="min-h-[32px] rounded-md border border-white/[0.08] bg-transparent px-2.5 py-1 text-[10px] text-[#8a9bb0] transition-colors hover:border-[#00c896]/40 hover:text-[#f0f4f8] sm:min-h-0 sm:text-[11px]"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => navigate(ROUTES.dashboard.history)}
                className="min-h-[32px] rounded-md border border-white/[0.08] bg-transparent px-2.5 py-1 text-[10px] text-[#8a9bb0] transition-colors hover:border-[#00c896]/40 hover:text-[#f0f4f8] sm:min-h-0 sm:text-[11px]"
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
