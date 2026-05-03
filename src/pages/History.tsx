import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Archive, ArchiveRestore, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES, dashboardRunPath } from '@/config/routes';
import { useToast } from '@/hooks/use-toast';
import {
  deleteNoraChatSession,
  dispatchNoraChatSessionsChanged,
  NORA_CHAT_SESSIONS_CHANGED,
} from '@/lib/noraChatSession';

interface Run {
  id: string;
  input_text: string;
  status: string;
  created_at: string;
  archived_at: string | null;
  workflow_templates: { name: string } | null;
}

interface NoraSessionRow {
  id: string;
  title: string | null;
  chat_kind: string;
  updated_at: string;
}

const History = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'active' | 'archived'>('active');
  const [section, setSection] = useState<'workflows' | 'nora'>('workflows');
  const [noraSessions, setNoraSessions] = useState<NoraSessionRow[]>([]);
  const [noraLoading, setNoraLoading] = useState(false);
  const [noraDeleting, setNoraDeleting] = useState<string | null>(null);
  const sectionRef = useRef(section);
  sectionRef.current = section;

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

  const loadNoraSessions = useCallback(async () => {
    if (!user) return;
    setNoraLoading(true);
    const { data, error } = await (supabase.from('nora_chat_sessions' as any) as any)
      .select('id, title, chat_kind, updated_at')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(100);
    if (!error && data) setNoraSessions(data as NoraSessionRow[]);
    setNoraLoading(false);
  }, [user]);

  const loadNoraSessionsRef = useRef(loadNoraSessions);
  loadNoraSessionsRef.current = loadNoraSessions;

  useEffect(() => {
    if (section === 'nora') void loadNoraSessions();
  }, [section, loadNoraSessions]);

  useEffect(() => {
    const onChanged = () => {
      if (sectionRef.current === 'nora') void loadNoraSessionsRef.current();
    };
    window.addEventListener(NORA_CHAT_SESSIONS_CHANGED, onChanged);
    return () => window.removeEventListener(NORA_CHAT_SESSIONS_CHANGED, onChanged);
  }, []);

  const removeNoraSession = async (id: string) => {
    if (!window.confirm('Delete this Ask Nora conversation permanently? This cannot be undone.')) return;
    setNoraDeleting(id);
    try {
      const { error } = await deleteNoraChatSession(id);
      if (error) {
        toast({ title: 'Could not delete', description: error.message, variant: 'destructive' });
        return;
      }
      dispatchNoraChatSessionsChanged(id);
      setNoraSessions((prev) => prev.filter((s) => s.id !== id));
      toast({ title: 'Conversation deleted' });
    } catch (err) {
      console.error(err);
      toast({
        title: 'Could not delete',
        description: err instanceof Error ? err.message : 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setNoraDeleting(null);
    }
  };

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
    <div className="mx-auto min-h-0 min-w-0 max-w-4xl px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
      <h1 className="text-lg font-semibold text-foreground sm:text-2xl">History</h1>
      <p className="mt-1 text-[13px] sm:text-sm text-muted-foreground">
        Workflow runs and Ask Nora conversations. Deleting in either place removes it for good.
      </p>

      <div className="mt-4 flex gap-1 sm:gap-2 border-b border-border">
        <button
          type="button"
          onClick={() => setSection('workflows')}
          className={cn(
            'border-b-2 px-3 py-2 text-[13px] sm:text-sm transition-colors min-h-[44px]',
            section === 'workflows'
              ? 'border-primary font-medium text-foreground'
              : 'border-transparent text-muted-foreground',
          )}
        >
          Workflow runs
        </button>
        <button
          type="button"
          onClick={() => setSection('nora')}
          className={cn(
            'border-b-2 px-3 py-2 text-[13px] sm:text-sm transition-colors min-h-[44px]',
            section === 'nora' ? 'border-primary font-medium text-foreground' : 'border-transparent text-muted-foreground',
          )}
        >
          Ask Nora chats
        </button>
      </div>

      {section === 'nora' && (
        <>
          {noraLoading ? (
            <div className="mt-10 flex justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : noraSessions.length === 0 ? (
            <div className="surface-panel mt-8 flex flex-col items-center py-12 text-center">
              <p className="text-sm text-muted-foreground">No Ask Nora conversations yet.</p>
              <button
                type="button"
                onClick={() => navigate(ROUTES.dashboard.nora)}
                className="mt-3 text-sm text-primary hover:underline"
              >
                Open Ask Nora
              </button>
            </div>
          ) : (
            <ul className="mt-4 sm:mt-6 space-y-2">
              {noraSessions.map((s) => (
                <li
                  key={s.id}
                  className="surface-panel flex w-full flex-col gap-2 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4"
                >
                  <div className="min-w-0">
                    <p className="text-[13px] sm:text-sm font-medium text-foreground">
                      {s.title || (s.chat_kind === 'agent_builder' ? 'Agent builder' : 'Chat')}
                    </p>
                    <p className="mt-0.5 text-[11px] sm:text-xs text-muted-foreground">
                      {s.chat_kind === 'agent_builder' ? 'Agent mode' : 'Chat mode'} ·{' '}
                      {new Date(s.updated_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => navigate(`${ROUTES.dashboard.nora}?session=${encodeURIComponent(s.id)}`)}
                      className="rounded-lg border border-border px-3 py-1.5 text-[12px] text-foreground hover:bg-muted"
                    >
                      Open
                    </button>
                    <button
                      type="button"
                      title="Delete conversation"
                      disabled={noraDeleting === s.id}
                      onClick={() => void removeNoraSession(s.id)}
                      className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                    >
                      {noraDeleting === s.id ? (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-primary" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {section === 'workflows' && (
        <>
      <div className="mt-3 sm:mt-4 flex gap-1 sm:gap-2 border-b border-border">
        <button
          type="button"
          onClick={() => setTab('active')}
          className={cn(
            'border-b-2 px-3 py-2 text-[13px] sm:text-sm transition-colors min-h-[44px]',
            tab === 'active' ? 'border-primary font-medium text-foreground' : 'border-transparent text-muted-foreground',
          )}
        >
          Active
        </button>
        <button
          type="button"
          onClick={() => setTab('archived')}
          className={cn(
            'border-b-2 px-3 py-2 text-[13px] sm:text-sm transition-colors min-h-[44px]',
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
        <div className="mt-4 sm:mt-6 space-y-2">
          {runs.map((run) => (
            <div
              key={run.id}
              className="surface-panel flex w-full flex-col gap-2.5 p-3 sm:p-4 sm:flex-row sm:items-center sm:gap-3"
            >
              <button
                type="button"
                onClick={() => navigate(dashboardRunPath(run.id))}
                className="min-w-0 flex-1 text-left transition-colors hover:opacity-90 min-h-[44px] flex flex-col justify-center"
              >
                <p className="truncate text-[13px] sm:text-sm text-foreground">{run.input_text}</p>
                <p className="mt-0.5 text-[11px] sm:text-xs text-muted-foreground">
                  {run.workflow_templates?.name ?? 'Workflow'} · {new Date(run.created_at).toLocaleDateString()}
                </p>
              </button>
              <div className="flex shrink-0 flex-wrap items-center gap-1.5 sm:gap-2 self-end sm:self-center">
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
                      className="flex h-10 w-10 sm:h-9 sm:w-9 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted"
                    >
                      <Archive className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      title="Delete"
                      onClick={() => void remove(run.id)}
                      className="flex h-10 w-10 sm:h-9 sm:w-9 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
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
                      className="flex h-10 w-10 sm:h-9 sm:w-9 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted"
                    >
                      <ArchiveRestore className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      title="Delete"
                      onClick={() => void remove(run.id)}
                      className="flex h-10 w-10 sm:h-9 sm:w-9 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
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
        </>
      )}
    </div>
  );
};

export default History;
