import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/config/routes';
import { useNavigate } from 'react-router-dom';

interface RunRow {
  id: string;
  status: string;
  input_text: string;
  created_at: string;
  template_id: string;
}

interface TemplateRow {
  id: string;
  name: string;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const statusStyle: Record<string, string> = {
  completed: 'bg-[var(--dash-accent-dim)] text-[var(--dash-accent)]',
  running: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
  failed: 'bg-red-500/15 text-red-700 dark:text-red-300',
  pending: 'bg-[var(--dash-status-pending-bg)] text-[var(--dash-muted)]',
};

const statusIcon: Record<string, string> = {
  completed: '✓',
  running: '⟳',
  failed: '✕',
  pending: '•',
};

const statusText: Record<string, string> = {
  completed: 'Output ready for review',
  running: 'Run in progress',
  failed: 'Run needs retry',
  pending: 'Queued',
};

export function ActivityFeed() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [runs, setRuns] = useState<RunRow[]>([]);
  const [templates, setTemplates] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!user) return;

    Promise.all([
      supabase
        .from('workflow_runs')
        .select('id, status, input_text, created_at, template_id')
        .eq('user_id', user.id)
        .is('archived_at', null)
        .order('created_at', { ascending: false })
        .limit(15),
      supabase.from('workflow_templates').select('id, name'),
    ]).then(([runsRes, templatesRes]) => {
      if (runsRes.data) setRuns(runsRes.data);
      if (templatesRes.data) {
        const map: Record<string, string> = {};
        for (const t of templatesRes.data) map[t.id] = t.name;
        setTemplates(map);
      }
    });
  }, [user]);

  if (runs.length === 0) {
    return (
      <div className="dash-panel min-w-0 p-3 sm:p-4">
        <p className="dash-label mb-3">Recent runs</p>
        <p className="py-6 text-center text-[12px] leading-relaxed text-[var(--dash-muted)] sm:text-[13px]">
          Your workflow timeline starts here. Run one workflow and approvals and outputs will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="dash-panel min-w-0 p-3 sm:p-4">
      <div className="mb-2 flex min-w-0 items-baseline justify-between gap-2">
        <p className="dash-label">Recent runs</p>
        <button
          type="button"
          onClick={() => navigate(ROUTES.dashboard.history)}
          className="min-h-[32px] shrink-0 px-1 text-[12px] text-[var(--dash-accent)] hover:underline"
        >
          View all
        </button>
      </div>
      <div className="max-h-[60vh] overflow-y-auto overscroll-y-contain sm:max-h-[50vh]">
        {runs.map((run, i) => {
          const tName = templates[run.template_id] || 'Workflow run';
          const style = statusStyle[run.status] || statusStyle.pending;
          const icon = statusIcon[run.status] || '•';
          const readableStatus = statusText[run.status] || statusText.pending;

          return (
            <button
              key={run.id}
              type="button"
              onClick={() => navigate(`${ROUTES.dashboard.root}/run/${run.id}`)}
              className={cn(
                'flex min-h-[54px] w-full items-start gap-2 py-2 text-left sm:gap-3 sm:py-2.5 hover:bg-[var(--dash-hover)] rounded-md transition-colors',
                i < runs.length - 1 && 'border-b border-[var(--dash-border)]',
              )}
            >
              <div
                className={cn(
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg font-space-mono text-[12px] sm:h-7 sm:w-7 sm:text-[13px]',
                  style,
                )}
              >
                {icon}
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 break-words text-[12.5px] font-medium leading-snug text-[var(--dash-text)] sm:text-[13px]">
                  {run.input_text.slice(0, 120)}
                </p>
                <p className="mt-0.5 text-[11px] text-[var(--dash-faint)]">
                  {tName} · {timeAgo(run.created_at)} · {readableStatus}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
