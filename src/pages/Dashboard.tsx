import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { AgentCards } from '@/components/dashboard/AgentCards';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { QuickRunInput } from '@/components/dashboard/QuickRunInput';

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

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [runs, setRuns] = useState<Run[]>([]);
  const [outputCount, setOutputCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const [tRes, rRes, oRes] = await Promise.all([
        supabase.from('workflow_templates').select('id, name, status').order('created_at'),
        supabase
          .from('workflow_runs')
          .select('id, input_text, status, created_at, workflow_templates(name)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10),
        supabase
          .from('workflow_outputs')
          .select('id', { count: 'exact', head: true })
          .in(
            'run_id',
            (await supabase.from('workflow_runs').select('id').eq('user_id', user.id)).data?.map(
              (r: any) => r.id
            ) || []
          ),
      ]);

      if (tRes.data) setTemplates(tRes.data);
      if (rRes.data) setRuns(rRes.data as any);
      setOutputCount(oRes.count || 0);
    };

    fetchData();
  }, [user]);

  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'there';
  const contentTemplate = templates.find((t) => t.name?.toLowerCase().includes('content'));

  const feedItems = useMemo(() => {
    return runs.slice(0, 4).map((run) => ({
      id: run.id,
      title: run.input_text.length > 60 ? run.input_text.slice(0, 60) + '…' : run.input_text,
      meta: `${(run.workflow_templates as any)?.name || 'Workflow'} · ${run.status}`,
      time: timeAgo(run.created_at),
      type: (run.status === 'completed' ? 'success' : run.status === 'running' ? 'warning' : 'action') as 'success' | 'warning' | 'action',
      runId: run.id,
      approved: run.status === 'completed',
    }));
  }, [runs]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6 lg:px-8 font-dm-sans">
      {/* Top bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-border bg-card px-5 py-4 mb-4">
        <div>
          <h1 className="font-dm-serif text-xl tracking-tight text-foreground">
            {getGreeting()}, {displayName}.
          </h1>
          <p className="text-[12.5px] text-muted-foreground mt-0.5">
            Here's what Nora handled while you were building.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => navigate('/dashboard/settings')}
            className="rounded-lg border border-border bg-card px-3.5 py-2 text-[13px] text-foreground transition-colors hover:bg-muted"
          >
            Connect tools
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard/run/new')}
            className="rounded-lg bg-primary px-3.5 py-2 text-[13px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            + New workflow
          </button>
        </div>
      </div>

      {/* Stats */}
      <StatsCards totalRuns={runs.length} draftsGenerated={outputCount} />

      {/* Agents */}
      <div className="mt-4">
        <div className="flex items-baseline justify-between mb-2.5">
          <p className="text-[13px] font-medium text-foreground">Your agents</p>
          <button type="button" className="text-[12px] text-primary hover:underline">
            Manage →
          </button>
        </div>
        <AgentCards
          draftsCount={outputCount}
          leadsCount={0}
          contentTemplateId={contentTemplate?.id}
        />
      </div>

      {/* Two-column: Feed + Quick Run */}
      <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_340px]">
        <ActivityFeed items={feedItems} />
        <QuickRunInput contentTemplateId={contentTemplate?.id} />
      </div>
    </div>
  );
};

export default Dashboard;
