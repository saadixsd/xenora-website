import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Archive, ArchiveRestore, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES, dashboardRunPath } from '@/config/routes';

interface Run {
  id: string;
  input_text: string;
  status: string;
  created_at: string;
  archived_at: string | null;
  workflow_templates: { name: string } | null;
}

const History = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'active' | 'archived'>('active');

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    let q = supabase
      .from('workflow_runs')
      .select('id, input_text, status, created_at, archived_at, workflow_templates(name)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    q = tab === 'archived' ? q.not('archived_at', 'is', null) : q.is('archived_at', null);

    const { data, error } = await q;

    if (!error && data) setRuns(data as Run[]);
    setLoading(false);
  }, [user, tab]);

  useEffect(() => {
    void load();
  }, [load]);

  const archive = async (id: string) => {
    await supabase.from('workflow_runs').update({ archived_at: new Date().toISOString() }).eq('id', id);
    void load();
  };

  const unarchive = async (id: string) => {
    await supabase.from('workflow_runs').update({ archived_at: null }).eq('id', id);
    void load();
  };

  const remove = async (id: string) => {
    if (!window.confirm('Delete this run permanently?')) return;
    await supabase.from('workflow_runs').delete().eq('id', id);
    void load();
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-xl font-semibold text-foreground sm:text-2xl">History</h1>
      <p className="mt-1 text-sm text-muted-foreground">All your workflow runs.</p>

      <div className="mt-4 flex gap-2 border-b border-border">
        <button
          type="button"
          onClick={() => setTab('active')}
          className={cn(
            'border-b-2 px-3 py-2 text-sm transition-colors',
            tab === 'active' ? 'border-primary font-medium text-foreground' : 'border-transparent text-muted-foreground',
          )}
        >
          Active
        </button>
        <button
          type="button"
          onClick={() => setTab('archived')}
          className={cn(
            'border-b-2 px-3 py-2 text-sm transition-colors',
            tab === 'archived' ? 'border-primary font-medium text-foreground' : 'border-transparent text-muted-foreground',
          )}
        >
          Archived
        </button>
      </div>

      {loading ? (
        <div className="mt-10 flex justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : runs.length === 0 ? (
        <div className="surface-panel mt-8 flex flex-col items-center py-12 text-center">
          <p className="text-sm text-muted-foreground">
            {tab === 'archived' ? 'No archived runs.' : 'No workflow runs yet.'}
          </p>
          {tab === 'active' && (
            <button
              type="button"
              onClick={() => navigate(ROUTES.dashboard.runNew)}
              className="mt-3 text-sm text-primary hover:underline"
            >
              Start your first run
            </button>
          )}
        </div>
      ) : (
        <div className="mt-6 space-y-2">
          {runs.map((run) => (
            <div
              key={run.id}
              className="surface-panel flex w-full flex-col gap-3 p-4 sm:flex-row sm:items-center"
            >
              <button
                type="button"
                onClick={() => navigate(dashboardRunPath(run.id))}
                className="min-w-0 flex-1 text-left transition-colors hover:opacity-90"
              >
                <p className="truncate text-sm text-foreground">{run.input_text}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {run.workflow_templates?.name ?? 'Workflow'} · {new Date(run.created_at).toLocaleDateString()}
                </p>
              </button>
              <div className="flex shrink-0 flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
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
                {tab === 'active' ? (
                  <>
                    <button
                      type="button"
                      title="Archive"
                      onClick={() => void archive(run.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted"
                    >
                      <Archive className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      title="Delete"
                      onClick={() => void remove(run.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      title="Unarchive"
                      onClick={() => void unarchive(run.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted"
                    >
                      <ArchiveRestore className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      title="Delete"
                      onClick={() => void remove(run.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
