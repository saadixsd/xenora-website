import { useNavigate } from 'react-router-dom';
import { ArrowRight, Pencil, RotateCcw, Plus, Sparkles } from 'lucide-react';
import { ROUTES, dashboardRunPath } from '@/config/routes';

/**
 * One next-action card. `kind` selects the icon; the dashboard derives the list
 * from existing run + output state — no new tables needed.
 */
export interface NextAction {
  id: string;
  kind: 'review' | 'rerun' | 'capture' | 'first_run';
  title: string;
  description: string;
  cta: string;
  to: string;
}

const ICONS = {
  review: Pencil,
  rerun: RotateCcw,
  capture: Plus,
  first_run: Sparkles,
} as const;

interface RecentRun {
  id: string;
  status: string;
  created_at: string;
  template_id: string;
  estimated_minutes_saved: number;
}

interface BuildArgs {
  recentRuns: RecentRun[];
  outputCount: number;
  templates: { id: string; name: string }[];
  defaultTemplateId?: string;
}

/**
 * Generates 2–3 contextual cards from current dashboard data. Pure function so the
 * dashboard can compute it inline; no fetches added.
 *
 * Priority order:
 *   1. Review the most recent completed run (always actionable).
 *   2. Re-run the last template Nora ran (continuity for weekly loops).
 *   3. If no runs exist yet, prompt a first run.
 *   4. Always end with "Capture an idea" once that surface exists.
 */
export function buildNextActions({
  recentRuns,
  outputCount,
  templates,
  defaultTemplateId,
}: BuildArgs): NextAction[] {
  const out: NextAction[] = [];

  const lastCompleted = recentRuns.find((r) => r.status === 'completed');
  if (lastCompleted) {
    out.push({
      id: `review-${lastCompleted.id}`,
      kind: 'review',
      title: 'Review your latest run',
      description: 'Open the outputs Nora drafted and approve what is ready.',
      cta: 'Open run',
      to: dashboardRunPath(lastCompleted.id),
    });
  }

  const lastAnyRun = recentRuns[0];
  if (lastAnyRun) {
    const tName = templates.find((t) => t.id === lastAnyRun.template_id)?.name ?? 'workflow';
    out.push({
      id: `rerun-${lastAnyRun.template_id}`,
      kind: 'rerun',
      title: `Run ${tName} again`,
      description: 'Continue the weekly loop with fresh inputs.',
      cta: 'Start run',
      to: `${ROUTES.dashboard.runNew}?template=${lastAnyRun.template_id}`,
    });
  } else {
    out.push({
      id: 'first-run',
      kind: 'first_run',
      title: 'Start your first workflow',
      description: 'Drop a rough idea in. Nora drafts the outputs in under a minute.',
      cta: 'Run workflow',
      to: defaultTemplateId
        ? `${ROUTES.dashboard.runNew}?template=${defaultTemplateId}`
        : ROUTES.dashboard.runNew,
    });
  }

  // If we already have a run + a review card, surface a chat-side capture as the third.
  if (out.length < 3 && outputCount > 0) {
    out.push({
      id: 'ask-nora',
      kind: 'capture',
      title: 'Ask Nora what to ship next',
      description: 'Paste this week\u2019s notes and let Nora propose angles.',
      cta: 'Open Nora',
      to: ROUTES.dashboard.nora,
    });
  }

  return out.slice(0, 3);
}

export function NextActions({ actions }: { actions: NextAction[] }) {
  const navigate = useNavigate();
  if (actions.length === 0) return null;

  return (
    <section aria-label="Next actions" className="mb-4 sm:mb-5">
      <p className="dash-label mb-2">Nora suggests next</p>
      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {actions.map((a) => {
          const Icon = ICONS[a.kind];
          return (
            <button
              type="button"
              key={a.id}
              onClick={() => navigate(a.to)}
              className="group dash-panel min-h-[44px] px-4 py-3.5 text-left transition-colors hover:bg-[var(--dash-hover)]"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[var(--dash-accent-dim)] text-[var(--dash-accent)]">
                  <Icon className="h-4 w-4" strokeWidth={2} aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium tracking-tight text-[var(--dash-text)]">{a.title}</p>
                  <p className="mt-0.5 text-[12px] leading-relaxed text-[var(--dash-muted)]">{a.description}</p>
                  <p className="mt-1.5 inline-flex items-center gap-1 text-[11.5px] font-medium text-[var(--dash-accent)]">
                    {a.cta}
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
