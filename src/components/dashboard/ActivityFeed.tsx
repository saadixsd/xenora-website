import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/config/routes';
import { useNavigate } from 'react-router-dom';

interface FeedRow {
  id: string;
  message: string;
  action_type: string;
  action_payload: Record<string, unknown> | null;
  created_at: string;
  resolved_at: string | null;
  agent_id: string | null;
}

const AGENT_LABELS: Record<string, string> = {
  content: 'Content',
  leads: 'Leads',
  research: 'Research',
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const typeStyle: Record<string, string> = {
  approve: 'bg-amber-500/15 text-amber-400',
  done: 'bg-[#00c896]/15 text-[#00c896]',
  info: 'bg-white/[0.06] text-[#8a9bb0]',
};
const typeIcon: Record<string, string> = { approve: '!', done: '\u2713', info: '\u2022' };

export function ActivityFeed() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<FeedRow[]>([]);
  const [agentTypes, setAgentTypes] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!user) return;

    (supabase.from('agents' as any) as any)
      .select('id, type')
      .eq('user_id', user.id)
      .then(({ data }: { data: unknown }) => {
        if (data) {
          const map: Record<string, string> = {};
          for (const a of data as { id: string; type: string }[]) map[a.id] = a.type;
          setAgentTypes(map);
        }
      });

    (supabase.from('feed_items' as any) as any)
      .select('id, message, action_type, action_payload, created_at, resolved_at, agent_id')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20)
      .then(({ data }: { data: unknown }) => {
        if (data) setItems(data as FeedRow[]);
      });

    const channel = supabase
      .channel('feed-realtime')
      .on(
        'postgres_changes' as any,
        { event: 'INSERT', schema: 'public', table: 'feed_items', filter: `user_id=eq.${user.id}` },
        (payload: any) => {
          const newItem = payload.new as FeedRow;
          setItems((prev) => [newItem, ...prev].slice(0, 30));
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleResolve = async (id: string, resolved: boolean) => {
    const resolvedAt = resolved ? new Date().toISOString() : null;
    await (supabase.from('feed_items' as any) as any).update({ resolved_at: resolvedAt }).eq('id', id);
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, resolved_at: resolvedAt } : item)),
    );
  };

  if (items.length === 0) {
    return (
      <div className="dash-panel min-w-0 p-3 sm:p-4">
        <p className="dash-label mb-3">Workflow feed</p>
        <p className="py-6 text-center text-[11.5px] leading-relaxed text-[#8a9bb0] sm:text-[12.5px]">
          Nothing here yet. Start a run and updates will stream in as the workflow moves.
        </p>
      </div>
    );
  }

  return (
    <div className="dash-panel min-w-0 p-3 sm:p-4">
      <div className="mb-2 flex min-w-0 items-baseline justify-between gap-2">
        <p className="dash-label">Workflow feed</p>
        <button
          type="button"
          onClick={() => navigate(ROUTES.dashboard.history)}
          className="shrink-0 text-[11px] text-[#00c896] hover:underline sm:text-[12px]"
        >
          View all
        </button>
      </div>
      <div className="max-h-[60vh] overflow-y-auto overscroll-y-contain sm:max-h-[50vh]">
        {items.map((item, i) => {
          const agentLabel = item.agent_id
            ? AGENT_LABELS[agentTypes[item.agent_id] || ''] || 'Agent'
            : '';
          const isResolved = Boolean(item.resolved_at);

          return (
            <div
              key={item.id}
              className={cn(
                'flex items-start gap-2 py-2 sm:gap-3 sm:py-2.5',
                i < items.length - 1 && 'border-b border-white/[0.06]',
                isResolved && 'opacity-60',
              )}
            >
              <div
                className={cn(
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg font-space-mono text-[12px] sm:h-7 sm:w-7 sm:text-[13px]',
                  typeStyle[item.action_type] || typeStyle.info,
                )}
              >
                {typeIcon[item.action_type] || '\u2022'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 break-words text-[12px] font-medium leading-snug text-[#f0f4f8] sm:text-[13px]">
                  {item.message}
                </p>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-1">
                  <p className="text-[10px] text-[#3f5060] sm:text-[11px]">
                    {agentLabel && `${agentLabel} · `}
                    {timeAgo(item.created_at)}
                    {isResolved && ' · Resolved'}
                  </p>
                </div>
                {item.action_type === 'approve' && !isResolved && (
                  <div className="mt-1.5 flex gap-1.5 sm:hidden">
                    <button
                      type="button"
                      onClick={() => void handleResolve(item.id, true)}
                      className="min-h-[28px] rounded-md bg-[#00c896] px-2.5 py-1 text-[10px] font-medium text-[#041a12] transition-opacity hover:opacity-90"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleResolve(item.id, true)}
                      className="min-h-[28px] rounded-md border border-white/[0.08] px-2.5 py-1 text-[10px] text-[#8a9bb0] transition-colors hover:border-red-500/40 hover:text-red-400"
                    >
                      Dismiss
                    </button>
                  </div>
                )}
              </div>
              <div className="hidden shrink-0 flex-col items-end gap-1 sm:flex">
                {item.action_type === 'approve' && !isResolved && (
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => void handleResolve(item.id, true)}
                      className="rounded-md bg-[#00c896] px-2 py-0.5 text-[10px] font-medium text-[#041a12] transition-opacity hover:opacity-90"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleResolve(item.id, true)}
                      className="rounded-md border border-white/[0.08] px-2 py-0.5 text-[10px] text-[#8a9bb0] transition-colors hover:border-red-500/40 hover:text-red-400"
                    >
                      Dismiss
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
