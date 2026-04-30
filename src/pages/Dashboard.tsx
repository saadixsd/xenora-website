import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { AgentCards } from '@/components/dashboard/AgentCards';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { HoursSavedBreakdown } from '@/components/dashboard/HoursSavedBreakdown';
import { QuickRunInput } from '@/components/dashboard/QuickRunInput';
import { ROUTES } from '@/config/routes';

interface RunRow {
  id: string;
  status: string;
  estimated_minutes_saved: number;
  created_at: string;
  template_id: string;
}

interface TemplateRow {
  id: string;
  name: string;
}

function formatHoursSaved(totalMinutes: number): string {
  if (totalMinutes <= 0) return '0';
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

function classifyTemplate(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('lead')) return 'leads';
  if (n.includes('research')) return 'research';
  return 'content';
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [runs, setRuns] = useState<RunRow[]>([]);
  const [templates, setTemplates] = useState<TemplateRow[]>([]);
  const [outputCount, setOutputCount] = useState(0);
  const [dataLoading, setDataLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user) return;

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const [runsRes, templatesRes, outputsRes] = await Promise.all([
      supabase
        .from('workflow_runs')
        .select('id, status, estimated_minutes_saved, created_at, template_id')
        .eq('user_id', user.id)
        .is('archived_at', null)
        .gte('created_at', monthStart),
      supabase.from('workflow_templates').select('id, name'),
      supabase
        .from('workflow_outputs')
        .select('output_type', { count: 'exact', head: true })
        .in('output_type', ['x_post', 'linkedin_post', 'hook']),
    ]);

    if (runsRes.data) setRuns(runsRes.data);
    if (templatesRes.data) setTemplates(templatesRes.data);
    setOutputCount(outputsRes.count ?? 0);
    setDataLoading(false);
  }, [user]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const completedRuns = runs.filter((r) => r.status === 'completed');
  const startedRuns = runs.filter((r) => r.status !== 'pending').length;
  const totalMinutesSaved = completedRuns.reduce((s, r) => s + (r.estimated_minutes_saved ?? 0), 0);

  const templateMap = useMemo(() => {
    const m: Record<string, string> = {};
    for (const t of templates) m[t.id] = t.name;
    return m;
  }, [templates]);

  const leadsProcessed = completedRuns.filter((r) => {
    const tName = templateMap[r.template_id] || '';
    return classifyTemplate(tName) === 'leads';
  }).length;

  const breakdownData = useMemo(() => {
    const byType: Record<string, number> = { content: 0, leads: 0, research: 0 };
    for (const r of completedRuns) {
      const tName = templateMap[r.template_id] || '';
      const agentType = classifyTemplate(tName);
      byType[agentType] = (byType[agentType] || 0) + (r.estimated_minutes_saved ?? 0);
    }
    return [
      { type: 'content', label: 'Content Agent', minutes: byType.content },
      { type: 'leads', label: 'Lead Agent', minutes: byType.leads },
      { type: 'research', label: 'Research Agent', minutes: byType.research },
    ];
  }, [completedRuns, templateMap]);

  const isEmpty = runs.length === 0;
  const completionRate = startedRuns > 0 ? Math.round((completedRuns.length / startedRuns) * 100) : 0;
  const defaultTemplateId = templates.find((t) => classifyTemplate(t.name) === 'content')?.id;
  const displayName =
    (typeof user?.user_metadata?.full_name === 'string' && user.user_metadata.full_name.trim()) ||
    (typeof user?.user_metadata?.name === 'string' && user.user_metadata.name.trim()) ||
    user?.email?.split('@')[0] ||
    'there';

  const subtitle = isEmpty
    ? 'You are one run away from your first approved output.'
    : `${completedRuns.length} completed run${completedRuns.length !== 1 ? 's' : ''} this month. Keep the momentum going.`;

  return (
    <div className="mx-auto min-h-0 min-w-0 max-w-5xl px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
      <nav className="dash-breadcrumb mb-3 sm:mb-4" aria-label="Breadcrumb">
        <Link to={ROUTES.dashboard.root} className="text-[var(--dash-muted)] hover:text-[var(--dash-text)]">
          Workspace
        </Link>
        <span className="mx-1.5 text-[var(--dash-faint)]">/</span>
        <span className="text-[var(--dash-text)]">Overview</span>
      </nav>

      <div className="dash-panel mb-4 sm:mb-5 px-4 py-4 sm:px-5 sm:py-5">
        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="dash-label mb-1">Welcome back, {displayName}</p>
            <h1 className="font-syne text-[22px] font-semibold tracking-tight text-[var(--dash-text)] sm:text-[26px]">
              Ready to run Nora today?
            </h1>
            <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--dash-muted)] sm:text-[13px]">{subtitle}</p>
          </div>
          <div className="flex flex-wrap gap-2 sm:justify-end">
            <button
              type="button"
              onClick={() => navigate(ROUTES.dashboard.runNew)}
              className="min-h-[44px] flex-1 rounded-lg bg-[var(--dash-accent)] px-3.5 py-2 text-[12.5px] font-medium text-[var(--dash-accent-fg)] transition-opacity hover:opacity-90 sm:flex-none sm:text-[13px]"
            >
              Run workflow
            </button>
            <button
              type="button"
              onClick={() => navigate(ROUTES.dashboard.settings)}
              className="min-h-[44px] rounded-lg border border-[var(--dash-border)] bg-transparent px-3.5 py-2 text-[12.5px] text-[var(--dash-text)] transition-colors hover:bg-[var(--dash-hover)] sm:text-[13px]"
            >
              Open settings
            </button>
          </div>
        </div>
      </div>

      <div className="mb-4 grid gap-3 sm:mb-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="dash-panel px-4 py-4 sm:px-5 sm:py-5">
          <p className="dash-label mb-1">This month&apos;s workflow momentum</p>
          {dataLoading ? (
            <>
              <div className="h-7 w-3/4 animate-pulse rounded bg-[var(--dash-border)]" />
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[var(--dash-border)]" />
              <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-[var(--dash-border)]" />
            </>
          ) : (
            <>
              <h2 className="font-syne text-[20px] font-semibold tracking-tight text-[var(--dash-text)] sm:text-[24px]">
                {startedRuns} started · {completedRuns.length} completed · {completionRate}% completion
              </h2>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[var(--dash-border)]">
                <div
                  className="h-full rounded-full bg-[var(--dash-accent)] transition-all duration-500"
                  style={{ width: `${Math.max(6, Math.min(100, completionRate || 0))}%` }}
                />
              </div>
              <p className="mt-1 text-[12px] text-[var(--dash-muted)] sm:text-[13px]">
                Goal: complete one workflow today and keep completion above 60%.
              </p>
            </>
          )}
        </div>
        <QuickRunInput
          templateId={defaultTemplateId}
          footerNote="Quick start: describe outcome, review output, then run."
        />
      </div>

      {dataLoading ? (
        <div className="grid min-w-0 grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="dash-panel min-w-0 p-3 sm:p-4">
              <div className="h-3 w-1/2 animate-pulse rounded bg-[var(--dash-border)]" />
              <div className="mt-2 h-7 w-2/3 animate-pulse rounded bg-[var(--dash-border)]" />
              <div className="mt-2 h-2.5 w-3/4 animate-pulse rounded bg-[var(--dash-border)]" />
            </div>
          ))}
        </div>
      ) : (
        <StatsCards
          hoursSaved={formatHoursSaved(totalMinutesSaved)}
          leadsProcessed={leadsProcessed}
          postsGenerated={outputCount}
          followupsQueued={0}
          isEmpty={isEmpty}
        />
      )}

      <div className="mt-4 sm:mt-5">
        <div className="mb-2 flex items-baseline justify-between gap-2">
          <p className="dash-label">Your agents</p>
          <button
            type="button"
            onClick={() => navigate(ROUTES.dashboard.agents.manage)}
            className="text-[11px] text-[var(--dash-accent)] hover:underline sm:text-[12px]"
          >
            Manage
          </button>
        </div>
        <AgentCards />
      </div>

      <div className="mt-4 sm:mt-5 grid min-w-0 gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)]">
        <ActivityFeed />
        <HoursSavedBreakdown breakdown={breakdownData} totalMinutes={totalMinutesSaved} />
      </div>
    </div>
  );
};

export default Dashboard;
