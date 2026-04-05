import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MinutesRunRow {
  id: string;
  input_text: string;
  estimated_minutes_saved: number;
  completed_at: string | null;
}

export interface WeekRunRow {
  id: string;
  input_text: string;
  created_at: string;
  workflow_templates: { name: string } | null;
}

export interface DraftRow {
  id: string;
  output_type: string;
  content: string;
  run_id: string;
  run_input: string;
}

type ModalKind = 'hours' | 'runs' | 'drafts' | null;

interface StatsDetailModalProps {
  kind: ModalKind;
  onClose: () => void;
  minutesRuns: MinutesRunRow[];
  weekRuns: WeekRunRow[];
  drafts: DraftRow[];
}

function labelFromOutputType(t: string): string {
  const map: Record<string, string> = {
    x_post: 'X Post',
    hook: 'Hook',
    linkedin_post: 'LinkedIn Post',
    cta: 'CTA',
    lead_summary: 'Lead summary',
    score_rationale: 'Score rationale',
    lead_reply_draft: 'Reply draft',
    follow_up_48h: '48h follow-up',
    objections_to_watch: 'Objections',
    pain_signals: 'Pain signals',
    content_angles: 'Content angles',
    quotes_evidence: 'Quotes / evidence',
    relevance_rationale: 'Relevance',
    research_caveats: 'Caveats',
  };
  return (
    map[t] ||
    t
      .split('_')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
  );
}

export function StatsDetailModal({ kind, onClose, minutesRuns, weekRuns, drafts }: StatsDetailModalProps) {
  const navigate = useNavigate();

  if (!kind) return null;

  const title =
    kind === 'hours' ? 'Time saved' : kind === 'runs' ? 'Runs this week' : 'Drafts ready';

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="stats-modal-title"
      onClick={onClose}
    >
      <div
        className={cn(
          'flex max-h-[85vh] w-full flex-col rounded-t-xl border border-border bg-card shadow-lg sm:max-h-[80vh] sm:max-w-lg sm:rounded-xl',
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 id="stats-modal-title" className="text-sm font-semibold text-foreground">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {kind === 'hours' && (
            <>
              {minutesRuns.length === 0 ? (
                <p className="text-sm text-muted-foreground">Complete workflow runs to accumulate estimated time saved.</p>
              ) : (
                <ul className="space-y-2">
                  {minutesRuns.map((r) => (
                    <li key={r.id}>
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          navigate(`/dashboard/run/${r.id}`);
                        }}
                        className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-left text-sm transition-colors hover:border-primary/30"
                      >
                        <span className="font-medium text-primary">~{r.estimated_minutes_saved} min</span>
                        <p className="mt-0.5 line-clamp-2 text-foreground">{r.input_text}</p>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}

          {kind === 'runs' && (
            <>
              {weekRuns.length === 0 ? (
                <p className="text-sm text-muted-foreground">No runs in the last 7 days.</p>
              ) : (
                <ul className="space-y-2">
                  {weekRuns.map((r) => (
                    <li key={r.id}>
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          navigate(`/dashboard/run/${r.id}`);
                        }}
                        className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-left text-sm transition-colors hover:border-primary/30"
                      >
                        <p className="line-clamp-2 text-foreground">{r.input_text}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {r.workflow_templates?.name ?? 'Workflow'} · {new Date(r.created_at).toLocaleString()}
                        </p>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}

          {kind === 'drafts' && (
            <>
              {drafts.length === 0 ? (
                <p className="text-sm text-muted-foreground">No outputs yet. Run a workflow to generate drafts.</p>
              ) : (
                <ul className="space-y-2">
                  {drafts.map((d) => (
                    <li key={d.id}>
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          navigate(`/dashboard/run/${d.run_id}`);
                        }}
                        className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-left text-sm transition-colors hover:border-primary/30"
                      >
                        <span className="text-xs font-medium text-primary">{labelFromOutputType(d.output_type)}</span>
                        <p className="mt-0.5 line-clamp-2 text-foreground">{d.content}</p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground line-clamp-1">From: {d.run_input}</p>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
