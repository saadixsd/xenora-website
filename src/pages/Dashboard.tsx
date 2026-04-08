import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { AgentCards } from '@/components/dashboard/AgentCards';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { HoursSavedBreakdown } from '@/components/dashboard/HoursSavedBreakdown';
import { ROUTES } from '@/config/routes';
import { useToast } from '@/hooks/use-toast';

interface AgentRow {
  id: string;
  type: string;
  status: string;
  last_run_at: string | null;
}

interface RunRow {
  id: string;
  status: string;
  estimated_minutes_saved: number;
  created_at: string;
  agent_id: string | null;
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

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return 'never';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
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
  const { toast } = useToast();

  const [agents, setAgents] = useState<AgentRow[]>([]);
  const [runs, setRuns] = useState<RunRow[]>([]);
  const [templates, setTemplates] = useState<TemplateRow[]>([]);
  const [outputCount, setOutputCount] = useState(0);
  const [postsGenerated, setPostsGenerated] = useState(0);
  const [followupsQueued, setFollowupsQueued] = useState(0);
  const [runningAll, setRunningAll] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user) return;

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const [agentsRes, runsRes, templatesRes, outputsRes, feedRes] = await Promise.all([
      (supabase.from('agents' as any) as any)
        .select('id, type, status, last_run_at')
        .eq('user_id', user.id),
      supabase
        .from('workflow_runs')
        .select('id, status, estimated_minutes_saved, created_at, agent_id, template_id' as any)
        .eq('user_id', user.id)
        .is('archived_at' as any, null)
        .gte('created_at', monthStart),
      supabase
        .from('workflow_templates')
        .select('id, name'),
      supabase
        .from('workflow_outputs')
        .select('output_type', { count: 'exact' })
        .in('output_type', ['x_post', 'linkedin_post', 'hook']),
      (supabase.from('feed_items' as any) as any)
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('action_type', 'approve')
        .is('resolved_at', null),
    ]);

    if (agentsRes.data) setAgents(agentsRes.data as AgentRow[]);
    if (runsRes.data) setRuns(runsRes.data as unknown as RunRow[]);
    if (templatesRes.data) setTemplates(templatesRes.data as TemplateRow[]);
    setPostsGenerated(outputsRes.count ?? 0);
    setFollowupsQueued(feedRes.count ?? 0);
  }, [user]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const activeCount = agents.filter((a) => a.status === 'active' || a.status === 'running').length;

  const lastRunAt = useMemo(() => {
    const dates = agents.map((a) => a.last_run_at).filter(Boolean) as string[];
    if (dates.length === 0) return null;
    return dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0];
  }, [agents]);

  const completedRuns = runs.filter((r) => r.status === 'completed');
  const totalMinutesSaved = completedRuns.reduce((s, r) => s + (r.estimated_minutes_saved ?? 0), 0);

  const templateMap = useMemo(() => {
    const m: Record<string, string> = {};
    for (const t of templates) m[t.id] = t.name;
    return m;
  }, [templates]);

  const leadsProcessed = completedRuns.filter((r) => {
    if (r.agent_id) {
      const agent = agents.find((a) => a.id === r.agent_id);
      return agent?.type === 'leads';
    }
    const tName = templateMap[r.template_id] || '';
    return classifyTemplate(tName) === 'leads';
  }).length;

  const breakdownData = useMemo(() => {
    const byType: Record<string, number> = { content: 0, leads: 0, research: 0 };
    for (const r of completedRuns) {
      let agentType = 'content';
      if (r.agent_id) {
        const agent = agents.find((a) => a.id === r.agent_id);
        if (agent) agentType = agent.type;
      } else {
        const tName = templateMap[r.template_id] || '';
        agentType = classifyTemplate(tName);
      }
      byType[agentType] = (byType[agentType] || 0) + (r.estimated_minutes_saved ?? 0);
    }
    return [
      { type: 'content', label: 'Content Agent', minutes: byType.content },
      { type: 'leads', label: 'Leads Agent', minutes: byType.leads },
      { type: 'research', label: 'Research Agent', minutes: byType.research },
    ];
  }, [completedRuns, agents, templateMap]);

  const handleRunAll = async () => {
    if (!user || runningAll) return;
    setRunningAll(true);
    try {
      const agentTemplateMap: Record<string, string> = {};
      for (const t of templates) {
        const kind = classifyTemplate(t.name);
        agentTemplateMap[kind] = t.id;
      }

      const promises = agents.map(async (agent) => {
        const templateId = agentTemplateMap[agent.type === 'leads' ? 'leads' : agent.type];
        if (!templateId) return;

        const { data: run } = await (supabase.from('workflow_runs') as any)
          .insert({
            user_id: user.id,
            template_id: templateId,
            agent_id: agent.id,
            input_text: `Automated run for ${agent.type} agent`,
            status: 'running',
          })
          .select('id')
          .single();

        if (!run) return;

        const session = await supabase.auth.getSession();
        const token = session.data.session?.access_token;
        if (!token) return;

        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        fetch(`${supabaseUrl}/functions/v1/nora-workflow`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            run_id: run.id,
            input_text: `Automated run for ${agent.type} agent`,
          }),
        }).catch(console.error);
      });

      await Promise.allSettled(promises);
      toast({ title: 'All agents triggered', description: 'Check the workflow feed for progress.' });
      setTimeout(() => void fetchData(), 2000);
    } catch (e) {
      console.error(e);
      toast({ title: 'Failed to run agents', variant: 'destructive' });
    } finally {
      setRunningAll(false);
    }
  };

  const isEmpty = runs.length === 0;

  return (
    <div className="mx-auto min-h-0 min-w-0 max-w-5xl px-4 py-5 sm:px-6 lg:px-8 font-dm-sans">
      <div className="mb-4 flex min-w-0 flex-col gap-4 rounded-xl border border-border bg-card px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="min-w-0">
          <h1 className="font-dm-serif text-xl tracking-tight text-foreground">
            Command Center
          </h1>
          <p className="text-[12.5px] text-muted-foreground mt-0.5">
            {activeCount} agent{activeCount !== 1 ? 's' : ''} active
            {lastRunAt ? ` -- last run ${timeAgo(lastRunAt)}` : ''}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void handleRunAll()}
            disabled={runningAll}
            className="min-h-[44px] rounded-lg bg-primary px-3.5 py-2 text-[13px] font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {runningAll ? 'Running...' : 'Run all agents'}
          </button>
          <button
            type="button"
            onClick={() => navigate(ROUTES.dashboard.settings)}
            className="min-h-[44px] rounded-lg border border-border bg-card px-3.5 py-2 text-[13px] text-foreground transition-colors hover:bg-muted"
          >
            Settings
          </button>
          <button
            type="button"
            onClick={() => navigate(ROUTES.dashboard.runNew)}
            className="min-h-[44px] rounded-lg border border-border bg-card px-3.5 py-2 text-[13px] text-foreground transition-colors hover:bg-muted"
          >
            + New workflow
          </button>
        </div>
      </div>

      <StatsCards
        hoursSaved={formatHoursSaved(totalMinutesSaved)}
        leadsProcessed={leadsProcessed}
        postsGenerated={postsGenerated}
        followupsQueued={followupsQueued}
        isEmpty={isEmpty}
      />

      <div className="mt-4">
        <div className="flex items-baseline justify-between mb-2.5">
          <p className="text-[13px] font-medium text-foreground">Your agents</p>
          <button
            type="button"
            onClick={() => navigate(ROUTES.dashboard.agents.manage)}
            className="text-[12px] text-primary hover:underline"
          >
            Manage
          </button>
        </div>
        <AgentCards />
      </div>

      <div className="mt-4 grid min-w-0 gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)]">
        <ActivityFeed />
        <HoursSavedBreakdown breakdown={breakdownData} totalMinutes={totalMinutesSaved} />
      </div>
    </div>
  );
};

export default Dashboard;
