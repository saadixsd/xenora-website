import { cn } from '@/lib/utils';
import { Check, Loader2 } from 'lucide-react';

/**
 * One narrated step from a workflow run. `narration` is the human-readable sentence Nora
 * emits at each stage (e.g. "Drafted hooks, an X post, a LinkedIn post, and a CTA.").
 * `at` is the ISO timestamp recorded when that step started.
 */
export interface TraceEntry {
  step: string;
  label: string;
  narration: string;
  at?: string;
  status: 'running' | 'complete' | 'pending';
}

function formatTime(iso?: string): string {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  } catch {
    return '';
  }
}

/**
 * Vertical narrated timeline shown on the workflow run page. Each entry persists once
 * it has appeared — completed steps stay visible above the active one so the run reads
 * as a sequence of agent actions rather than a swapping progress bar.
 */
export function StepTrace({ entries, runStatus }: { entries: TraceEntry[]; runStatus: string }) {
  if (entries.length === 0) {
    return (
      <div className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-deep)] px-4 py-6 text-center">
        <p className="text-[12.5px] text-[var(--dash-muted)]">
          Nora will narrate each step here when the run begins.
        </p>
      </div>
    );
  }

  return (
    <ol className="flex flex-col gap-0">
      {entries.map((entry, i) => {
        const isLast = i === entries.length - 1;
        return (
          <li key={`${entry.step}-${i}`} className="flex gap-3">
            {/* Indicator column */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                  entry.status === 'complete' &&
                    'border-[var(--dash-accent)] bg-[var(--dash-accent)] text-[var(--dash-accent-fg)]',
                  entry.status === 'running' &&
                    'border-[var(--dash-accent)] bg-[var(--dash-accent-dim)] text-[var(--dash-accent)]',
                  entry.status === 'pending' && 'border-[var(--dash-border)] bg-[var(--dash-surface-deep)]',
                )}
                aria-hidden
              >
                {entry.status === 'complete' ? (
                  <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                ) : entry.status === 'running' ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2.5} />
                ) : (
                  <span className="h-2 w-2 rounded-full bg-[var(--dash-faint)]" />
                )}
              </div>
              {!isLast && (
                <div
                  className={cn(
                    'w-0.5 flex-1 min-h-[28px] transition-colors',
                    entry.status === 'complete' ? 'bg-[var(--dash-accent)]' : 'bg-[var(--dash-border)]',
                  )}
                />
              )}
            </div>

            {/* Narration column */}
            <div className="flex-1 pb-5 pt-0.5 min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <p
                  className={cn(
                    'text-[13px] font-medium tracking-tight',
                    entry.status === 'pending' ? 'text-[var(--dash-muted)]' : 'text-[var(--dash-text)]',
                  )}
                >
                  {entry.label}
                </p>
                {entry.at && (
                  <span className="font-space-mono text-[10.5px] uppercase tracking-wider text-[var(--dash-faint)]">
                    {formatTime(entry.at)}
                  </span>
                )}
              </div>
              {entry.narration && (
                <p
                  className={cn(
                    'mt-0.5 text-[12.5px] leading-relaxed',
                    entry.status === 'pending' ? 'text-[var(--dash-faint)]' : 'text-[var(--dash-muted)]',
                  )}
                >
                  {entry.narration}
                </p>
              )}
            </div>
          </li>
        );
      })}
      {runStatus === 'failed' && (
        <li className="ml-10 mt-1 text-[12px] text-destructive">Run failed before completion.</li>
      )}
    </ol>
  );
}

const STEP_LABELS: Record<string, string> = {
  input_received: 'Input received',
  classifying: 'Classifying',
  parsing: 'Parsing lead',
  researching: 'Researching sources',
  analyzing: 'Analyzing',
  generating: 'Generating drafts',
  drafting: 'Drafting reply',
  personalizing: 'Personalizing',
  summarizing: 'Summarizing',
  formatting: 'Formatting',
  done: 'Complete',
};

const STEP_FALLBACK_NARRATION: Record<string, string> = {
  input_received: 'Received your input and started the run.',
  classifying: 'Read your input and figured out what you needed.',
  parsing: 'Parsed the lead context.',
  researching: 'Pulled the source URLs you provided.',
  analyzing: 'Looked across the inputs and pulled out the signal.',
  generating: 'Wrote the first round of drafts.',
  drafting: 'Drafted a reply tuned to the context.',
  personalizing: 'Tightened the language to remove placeholders.',
  summarizing: 'Wrote a short summary of the findings.',
  formatting: 'Cleaned up the outputs for review.',
  done: 'Outputs ready for your review.',
};

/**
 * Builds the trace shown in the UI from the set of steps reported by the run plus the
 * narration map streamed from the edge function. Steps that haven't arrived yet appear
 * as muted placeholders so the user sees the full plan at a glance.
 */
export function buildTrace(
  expectedSteps: string[],
  reachedSteps: Map<string, { narration?: string; at?: string }>,
  currentStep: string,
  runStatus: string,
): TraceEntry[] {
  const reached = Array.from(reachedSteps.keys());
  // Preserve the order steps actually arrived in for any that aren't in expectedSteps.
  const ordered = expectedSteps.length > 0 ? expectedSteps : reached;
  const finalList = ordered.length > 0 ? ordered : ['input_received'];

  const currentIdx = finalList.indexOf(currentStep);
  const runDone = runStatus === 'completed' || currentStep === 'done';

  return finalList.map((step, i) => {
    const meta = reachedSteps.get(step);
    let status: TraceEntry['status'];
    if (runDone) status = 'complete';
    else if (currentIdx >= 0 && i < currentIdx) status = 'complete';
    else if (i === currentIdx) status = 'running';
    else status = 'pending';

    return {
      step,
      label: STEP_LABELS[step] ?? step,
      narration: meta?.narration ?? STEP_FALLBACK_NARRATION[step] ?? '',
      at: meta?.at,
      status,
    };
  });
}
