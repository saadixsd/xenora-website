import { useNavigate } from 'react-router-dom';
import { Archive, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES, dashboardRunPath } from '@/config/routes';

interface FeedItem {
  id: string;
  title: string;
  meta: string;
  time: string;
  type: 'success' | 'warning' | 'action';
  runId?: string;
}

interface ActivityFeedProps {
  items: FeedItem[];
  showLifecycleActions?: boolean;
  onArchiveRun?: (runId: string) => void;
  onDeleteRun?: (runId: string) => void;
}

const iconStyle = {
  success: 'bg-primary/10 text-primary',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
  action: 'bg-destructive/10 text-destructive',
};
const iconChar = { success: '✓', warning: '!', action: '↻' };

export function ActivityFeed({
  items,
  showLifecycleActions,
  onArchiveRun,
  onDeleteRun,
}: ActivityFeedProps) {
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-[13px] font-medium text-foreground mb-3">Recent activity</p>
        <p className="text-[12.5px] text-muted-foreground py-6 text-center">
          Nothing here yet. Run your first workflow above.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-baseline justify-between mb-2">
        <p className="text-[13px] font-medium text-foreground">Recent activity</p>
        <button type="button" onClick={() => navigate(ROUTES.dashboard.history)} className="text-[12px] text-primary hover:underline">
          View all →
        </button>
      </div>
      <div>
        {items.map((item, i) => (
          <div
            key={item.id}
            className={cn('flex items-start gap-3 py-2.5', i < items.length - 1 && 'border-b border-border')}
          >
            <div className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[13px]', iconStyle[item.type])}>
              {iconChar[item.type]}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium leading-snug text-foreground">{item.title}</p>
              <p className="mt-0.5 text-[11.5px] text-muted-foreground">{item.meta}</p>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="text-[11px] text-muted-foreground whitespace-nowrap">{item.time}</span>
              <div className="flex flex-wrap justify-end gap-1">
                {showLifecycleActions && item.runId && onArchiveRun && (
                  <button
                    type="button"
                    title="Archive"
                    onClick={(e) => {
                      e.stopPropagation();
                      onArchiveRun(item.runId!);
                    }}
                    className="rounded-md border border-border bg-muted/50 p-1.5 text-muted-foreground transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary"
                  >
                    <Archive className="h-3.5 w-3.5" />
                  </button>
                )}
                {showLifecycleActions && item.runId && onDeleteRun && (
                  <button
                    type="button"
                    title="Delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      void onDeleteRun(item.runId!);
                    }}
                    className="rounded-md border border-border bg-muted/50 p-1.5 text-muted-foreground transition-colors hover:border-destructive/50 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => item.runId && navigate(dashboardRunPath(item.runId))}
                  disabled={!item.runId}
                  className={cn(
                    'rounded-md px-2.5 py-1 text-[11.5px] border transition-colors',
                    item.runId
                      ? 'border-border bg-muted/50 text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary'
                      : 'cursor-not-allowed border-transparent opacity-40',
                  )}
                >
                  Open
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
