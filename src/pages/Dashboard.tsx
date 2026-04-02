import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { TemplateCard } from '@/components/dashboard/TemplateCard';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Template {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: string;
}

interface Run {
  id: string;
  input_text: string;
  status: string;
  created_at: string;
  workflow_templates: { name: string } | null;
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
        supabase.from('workflow_templates').select('*').order('created_at'),
        supabase
          .from('workflow_runs')
          .select('id, input_text, status, created_at, workflow_templates(name)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5),
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

  const startRun = (templateId: string) => {
    navigate(`/dashboard/run/new?template=${templateId}`);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground sm:text-2xl">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Turn rough ideas into publish-ready outputs.
          </p>
        </div>
        <Button onClick={() => navigate('/dashboard/run/new')} className="gap-2">
          <Plus className="h-4 w-4" />
          New Workflow Run
        </Button>
      </div>

      {/* Stats */}
      <div className="mt-6">
        <StatsCards totalRuns={runs.length} draftsGenerated={outputCount} />
      </div>

      {/* Templates */}
      <div className="mt-8">
        <h2 className="text-sm font-medium text-foreground">Workflow Templates</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((t) => (
            <TemplateCard
              key={t.id}
              name={t.name}
              description={t.description}
              icon={t.icon}
              status={t.status}
              onSelect={() => startRun(t.id)}
            />
          ))}
        </div>
      </div>

      {/* Recent runs */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-foreground">Recent Runs</h2>
          {runs.length > 0 && (
            <button
              type="button"
              onClick={() => navigate('/dashboard/history')}
              className="text-xs text-primary hover:underline"
            >
              View all
            </button>
          )}
        </div>

        {runs.length === 0 ? (
          <div className="surface-panel mt-3 flex flex-col items-center py-10 text-center">
            <p className="text-sm text-muted-foreground">No runs yet.</p>
            <p className="mt-1 text-xs text-muted-foreground/60">
              Start your first workflow to see results here.
            </p>
          </div>
        ) : (
          <div className="mt-3 space-y-2">
            {runs.map((run) => (
              <button
                key={run.id}
                type="button"
                onClick={() => navigate(`/dashboard/run/${run.id}`)}
                className="surface-panel flex w-full items-center gap-4 p-4 text-left transition-colors hover:border-primary/20"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-foreground">{run.input_text}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {(run.workflow_templates as any)?.name} · {new Date(run.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    run.status === 'completed'
                      ? 'bg-primary/10 text-primary'
                      : run.status === 'running'
                      ? 'bg-amber-500/10 text-amber-500'
                      : run.status === 'failed'
                      ? 'bg-destructive/10 text-destructive'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {run.status}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
