import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, Inbox } from 'lucide-react';
import { ROUTES } from '@/config/routes';
import { WorkflowItemDetail } from '@/components/dashboard/WorkflowItemDetail';
import { TYPE_LABEL, STAGE_LABEL, type WorkflowItem } from '@/lib/workflowItems';
import { cn } from '@/lib/utils';

/**
 * `/dashboard/follow-ups` — focused list of every reply / follow-up item Nora has
 * drafted or you've captured. Same `workflow_items` table, filtered by `type`. The
 * detail drawer reuses `WorkflowItemDetail` so editing/advancing/deleting is identical
 * to the run workspace.
 */
export default function FollowUps() {
  const { user } = useAuth();
  const [items, setItems] = useState<WorkflowItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from('workflow_items')
      .select('*')
      .eq('user_id', user.id)
      .in('type', ['reply', 'follow_up'])
      .neq('stage', 'archived')
      .order('updated_at', { ascending: false })
      .limit(200);
    setItems((data ?? []) as WorkflowItem[]);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    void load();
  }, [load]);

  const selected = items.find((i) => i.id === selectedId) ?? null;

  return (
    <div className="mx-auto min-h-0 min-w-0 max-w-5xl px-3 py-4 sm:px-6 sm:py-6">
      <Link
        to={ROUTES.dashboard.root}
        className="mb-4 inline-flex items-center gap-2 text-[13px] text-[var(--dash-muted)] hover:text-[var(--dash-text)]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      <div className="mb-4">
        <h1 className="text-lg font-semibold text-[var(--dash-text)] sm:text-xl">Follow-ups</h1>
        <p className="mt-1 text-[12.5px] text-[var(--dash-muted)]">
          Replies and 48-hour follow-ups Nora has drafted, plus anything you've captured manually.
        </p>
      </div>

      {loading ? (
        <p className="text-[12.5px] text-[var(--dash-faint)]">Loading…</p>
      ) : items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[var(--dash-border)] bg-[var(--dash-surface-deep)] px-4 py-10 text-center">
          <Inbox className="mx-auto h-6 w-6 text-[var(--dash-faint)]" />
          <p className="mt-2 text-[13px] text-[var(--dash-text)]">No follow-ups yet</p>
          <p className="mt-1 text-[12px] text-[var(--dash-muted)]">
            Run the Lead Agent or capture a reply to see it here.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => setSelectedId(item.id)}
                className={cn(
                  'block w-full rounded-lg border bg-[var(--dash-surface)] p-3 text-left transition-colors',
                  selectedId === item.id
                    ? 'border-[var(--dash-accent)]'
                    : 'border-[var(--dash-border)] hover:border-[var(--dash-accent-hover)]',
                )}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-space-mono text-[10.5px] uppercase tracking-wider text-[var(--dash-faint)]">
                    {TYPE_LABEL[item.type]} · {STAGE_LABEL[item.stage]}
                  </p>
                  <span className="font-space-mono text-[10.5px] text-[var(--dash-faint)]">
                    {new Date(item.updated_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-[13px] text-[var(--dash-text)]">
                  {item.title || item.ai_draft || item.input_text || 'Untitled'}
                </p>
              </button>
            </li>
          ))}
        </ul>
      )}

      {selected && (
        <>
          <div className="fixed inset-0 z-[80] bg-black/50" aria-hidden onClick={() => setSelectedId(null)} />
          <div className="fixed inset-y-0 right-0 z-[85] flex h-[100dvh] w-full max-w-[min(28rem,100vw)] flex-col border-l border-[var(--dash-border)] shadow-2xl">
            <WorkflowItemDetail
              item={selected}
              onClose={() => setSelectedId(null)}
              onChange={(updated) => setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)))}
              onDelete={(id) => {
                setItems((prev) => prev.filter((i) => i.id !== id));
                setSelectedId(null);
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}
