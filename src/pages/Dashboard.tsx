import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { AgentCards } from '@/components/dashboard/AgentCards';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { QuickRunInput } from '@/components/dashboard/QuickRunInput';
import {
  StatsDetailModal,
  type MinutesRunRow,
  type WeekRunRow,
  type DraftRow,
} from '@/components/dashboard/StatsDetailModal';

interface Template {
  id: string;
  name: string;
  status: string;
}

interface Run {
  id: string;
  input_text: string;
  status: string;
  created_at: string;
  estimated_minutes_saved?: number;
  workflow_templates: { name: string } | null;
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return 'Yesterday';
}

function formatHoursSaved(totalMinutes: number): string {
  if (totalMinutes <= 0) return '0';
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

type StatsModal = 'hours' | 'runs' | 'drafts' | null;

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [runs, setRuns] = useState<Run[]>([]);
  const [outputCount, setOutputCount] = useState(0);
  const [totalRuns, setTotalRuns] = useState(0);
  const [runsThisWeek, setRunsThisWeek] = useState(0);
  const [totalMinutesSaved, setTotalMinutesSaved] = useState(0);
  const [minutesRuns, setMinutesRuns] = useState<MinutesRunRow[]>([]);
  const [weekRunsDetail, setWeekRunsDetail] = useState<WeekRunRow[]>([]);
  const [draftRows, setDraftRows] = useState<DraftRow[]>([]);
  const [statsModal, setStatsModal] = useState<StatsModal>(null);

  const fetchData = useCallback(async () => {
    if (!user) return;

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const [tRes, rRes, allRunsRes] = await Promise.all([
      supabase.from('workflow_templates').select('id, name, status').order('created_at'),
      supabase
        .from('workflow_runs')
        .select('id, input_text, status, created_at, estimated_minutes_saved, workflow_templates(name)')
        .eq('user_id', user.id)
        .is('archived_at', null)
        .order('created_at', { ascending: false })
        .limit(10),
      supabase
        .from('workflow_runs')
        .select('id, created_at, estimated_minutes_saved, status, completed_at, input_text, workflow_templates(name)')
        .eq('user_id', user.id)
        .is('archived_at', null),
    ]);

    if (tRes.data) setTemplates(tRes.data);
    if (rRes.data) setRuns(rRes.data as Run[]);

    const allRows = allRunsRes.data ?? [];
    setTotalRuns(allRows.length);
    setRunsThisWeek(allRows.filter((r) => new Date(r.created_at).getTime() >= weekAgo.getTime()).length);

    const completed = allRows.filter((r) => r.status === 'completed');
    const minsSum = completed.reduce((s, r) => s + (r.estimated_minutes_saved ?? 0), 0);
    setTotalMinutesSaved(minsSum);

    setMinutesRuns(
      completed
        .filter((r) => (r.estimated_minutes_saved ?? 0) > 0)
        .map((r) => ({
          id: r.id,
          input_text: r.input_text,
          estimated_minutes_saved: r.estimated_minutes_saved ?? 0,
          completed_at: r.completed_at ?? null,
        }))
        .sort((a, b) => {
          const ta = a.completed_at ? new Date(a.completed_at).getTime() : 0;
          const tb = b.completed_at ? new Date(b.completed_at).getTime() : 0;
          return tb - ta;
        })
        .slice(0, 50),
    );

    setWeekRunsDetail(
      allRows
        .filter((r) => new Date(r.created_at).getTime() >= weekAgo.getTime())
        .map((r) => ({
          id: r.id,
          input_text: r.input_text,
          created_at: r.created_at,
          workflow_templates: r.workflow_templates as { name: string } | null,
        }))
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
    );

    const runIds = allRows.map((r) => r.id);
    if (runIds.length === 0) {
      setOutputCount(0);
      setDraftRows([]);
    } else {
      const { count } = await supabase
        .from('workflow_outputs')
        .select('id', { count: 'exact', head: true })
        .in('run_id', runIds);
      setOutputCount(count ?? 0);

      const { data: outs } = await supabase
        .from('workflow_outputs')
        .select('id, output_type, content, run_id, created_at')
        .in('run_id', runIds)
        .order('created_at', { ascending: false })
        .limit(40);

      const inputByRun = new Map(allRows.map((r) => [r.id, r.input_text]));
      setDraftRows(
        (outs ?? []).map((o) => ({
          id: o.id,
          output_type: o.output_type,
          content: o.content,
          run_id: o.run_id,
          run_input: inputByRun.get(o.run_id) ?? '',
        })),
      );
    }
  }, [user]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'there';
  const contentTemplate = templates.find((t) => t.name?.toLowerCase().includes('content'));

  const feedItems = useMemo(() => {
    return runs.slice(0, 4).map((run) => ({
      id: run.id,
      title: run.input_text.length > 60 ? run.input_text.slice(0, 60) + '…' : run.input_text,
      meta: `${run.workflow_templates?.name || 'Workflow'} · ${run.status}`,
      time: timeAgo(run.created_at),
      type: (run.status === 'completed' ? 'success' : run.status === 'running' ? 'warning' : 'action') as
        | 'success'
        | 'warning'
        | 'action',
      runId: run.id,
    }));
  }, [runs]);

  const handleArchiveRun = async (runId: string) => {
    await supabase.from('workflow_runs').update({ archived_at: new Date().toISOString() }).eq('id', runId);
    void fetchData();
  };

  const handleDeleteRun = async (runId: string) => {
    if (!window.confirm('Delete this run permanently?')) return;
    await supabase.from('workflow_runs').delete().eq('id', runId);
    void fetchData();
  };

  const emptyOverall = totalRuns === 0;
  const hoursHint = emptyOverall
    ? ''
    : totalMinutesSaved === 0
      ? 'Complete runs to accumulate estimated time saved from each agent.'
      : `Estimated from completed runs (${formatHoursSaved(totalMinutesSaved)} total).`;
  const runsWeekHint = emptyOverall
    ? ''
    : runsThisWeek === 0
      ? 'No runs in the last 7 days.'
      : `${runsThisWeek} in the last 7 days`;
  const draftsHint = emptyOverall
    ? ''
    : outputCount === 0
      ? 'Complete a run to generate outputs.'
      : 'Outputs from your latest runs';

  return (
    <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6 lg:px-8 font-dm-sans">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-border bg-card px-5 py-4 mb-4">
        <div>
          <h1 className="font-dm-serif text-xl tracking-tight text-foreground">
            {getGreeting()}, {displayName}.
          </h1>
          <p className="text-[12.5px] text-muted-foreground mt-0.5">
            Here&apos;s what Nora handled while you were building.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => navigate('/dashboard/settings')}
            className="min-h-[44px] rounded-lg border border-border bg-card px-3.5 py-2 text-[13px] text-foreground transition-colors hover:bg-muted"
          >
            Settings
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard/run/new')}
            className="min-h-[44px] rounded-lg bg-primary px-3.5 py-2 text-[13px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            + New workflow
          </button>
        </div>
      </div>

      <StatsCards
        hoursSavedDisplay={formatHoursSaved(totalMinutesSaved)}
        hoursHint={hoursHint}
        runsThisWeek={runsThisWeek}
        runsWeekHint={runsWeekHint}
        draftsGenerated={outputCount}
        draftsHint={draftsHint}
        emptyOverall={emptyOverall}
        onHoursClick={emptyOverall ? undefined : () => setStatsModal('hours')}
        onRunsClick={emptyOverall ? undefined : () => setStatsModal('runs')}
        onDraftsClick={emptyOverall ? undefined : () => setStatsModal('drafts')}
      />

      <div className="mt-4">
        <div className="flex items-baseline justify-between mb-2.5">
          <p className="text-[13px] font-medium text-foreground">Your agents</p>
          <button
            type="button"
            onClick={() => navigate('/dashboard/agents/manage')}
            className="text-[12px] text-primary hover:underline"
          >
            Manage →
          </button>
        </div>
        <AgentCards draftsCount={outputCount} />
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_340px]">
        <ActivityFeed
          items={feedItems}
          showLifecycleActions
          onArchiveRun={handleArchiveRun}
          onDeleteRun={handleDeleteRun}
        />
        <QuickRunInput templateId={contentTemplate?.id} />
      </div>

      <StatsDetailModal
        kind={statsModal}
        onClose={() => setStatsModal(null)}
        minutesRuns={minutesRuns}
        weekRuns={weekRunsDetail}
        drafts={draftRows}
      />
    </div>
  );
};

export default Dashboard;
