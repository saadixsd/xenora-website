import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Run {
  id: string;
  input_text: string;
  status: string;
  created_at: string;
  workflow_templates: { name: string } | null;
}

const History = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('workflow_runs')
      .select('id, input_text, status, created_at, workflow_templates(name)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setRuns(data as Run[]);
        setLoading(false);
      });
  }, [user]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-xl font-semibold text-foreground sm:text-2xl">History</h1>
      <p className="mt-1 text-sm text-muted-foreground">All your past workflow runs.</p>

      {loading ? (
        <div className="mt-10 flex justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : runs.length === 0 ? (
        <div className="surface-panel mt-8 flex flex-col items-center py-12 text-center">
          <p className="text-sm text-muted-foreground">No workflow runs yet.</p>
          <button
            type="button"
            onClick={() => navigate('/dashboard/run/new')}
            className="mt-3 text-sm text-primary hover:underline"
          >
            Start your first run
          </button>
        </div>
      ) : (
        <div className="mt-6 space-y-2">
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
                  {run.workflow_templates?.name ?? 'Workflow'} · {new Date(run.created_at).toLocaleDateString()}
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
  );
};

export default History;
