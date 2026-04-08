import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES, agentEditPath } from '@/config/routes';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface AgentRow {
  id: string;
  type: string;
  status: string;
  last_run_at: string | null;
}

interface CustomAgentRow {
  id: string;
  name: string;
  mission: string;
  starter_prompt: string | null;
  created_at: string;
}

const TYPE_LABELS: Record<string, string> = {
  content: 'Content Agent',
  leads: 'Leads Agent',
  research: 'Research Agent',
};

const TYPE_DESCRIPTIONS: Record<string, string> = {
  content: 'Social and long-form drafts from a single input.',
  leads: 'Replies and follow-up planning from lead context.',
  research: 'Signals and angles from notes plus optional URLs.',
};

const DOT_COLOR: Record<string, string> = {
  active: 'bg-emerald-500',
  running: 'bg-amber-500 animate-pulse',
  paused: 'bg-zinc-400',
};

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return 'Never run';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function AgentsManagePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [agents, setAgents] = useState<AgentRow[]>([]);
  const [customAgents, setCustomAgents] = useState<CustomAgentRow[]>([]);
  const [contentTemplateId, setContentTemplateId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    (supabase.from('agents' as any) as any)
      .select('id, type, status, last_run_at')
      .eq('user_id', user.id)
      .then(({ data }: { data: unknown }) => {
        if (data) setAgents(data as AgentRow[]);
      });
  }, [user]);

  const loadCustom = useCallback(() => {
    if (!user?.id) return;
    void supabase
      .from('user_custom_agents')
      .select('id, name, mission, starter_prompt, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          console.error(error);
          return;
        }
        if (data) setCustomAgents(data as CustomAgentRow[]);
      });
  }, [user?.id]);

  useEffect(() => {
    void supabase
      .from('workflow_templates')
      .select('id, name')
      .then(({ data }) => {
        const row = data?.find((t) => t.name.toLowerCase().includes('content'));
        if (row) setContentTemplateId(row.id);
      });
  }, []);

  useEffect(() => {
    loadCustom();
  }, [loadCustom]);

  const runCustomAgent = (a: CustomAgentRow) => {
    if (!contentTemplateId) {
      toast({ title: 'Template unavailable', description: 'Could not resolve Content Agent template.', variant: 'destructive' });
      return;
    }
    const p = new URLSearchParams();
    p.set('template', contentTemplateId);
    p.set('goal', a.mission);
    const input = (a.starter_prompt || `Run my "${a.name}" agent: ${a.mission}`).slice(0, 8000);
    p.set('input', input);
    navigate(`${ROUTES.dashboard.runNew}?${p.toString()}`);
  };

  const deleteCustom = async (id: string) => {
    if (!window.confirm('Remove this saved agent?')) return;
    const { error } = await supabase.from('user_custom_agents').delete().eq('id', id);
    if (error) {
      toast({ title: 'Delete failed', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Agent removed' });
    loadCustom();
  };

  const ordered = ['content', 'leads', 'research']
    .map((t) => agents.find((a) => a.type === t))
    .filter(Boolean) as AgentRow[];

  return (
    <div className="mx-auto min-h-0 min-w-0 max-w-2xl px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
      <button
        type="button"
        onClick={() => navigate(ROUTES.dashboard.root)}
        className="mb-3 sm:mb-4 flex items-center gap-2 text-[13px] sm:text-sm text-muted-foreground hover:text-foreground min-h-[44px]"
      >
        <ArrowLeft className="h-4 w-4" />
        Dashboard
      </button>

      <h1 className="text-lg font-semibold text-foreground sm:text-2xl">Agents</h1>
      <p className="mt-1 text-[13px] sm:text-sm text-muted-foreground">
        Your built-in agents are below. Custom agents are created with Nora in{' '}
        <Link to={ROUTES.dashboard.noraAgentBuilder} className="text-primary hover:underline">
          Build agent
        </Link>{' '}
        mode, then deployed here.
      </p>

      <h2 className="mt-5 sm:mt-6 text-[13px] sm:text-sm font-medium text-foreground">Built-in agents</h2>
      <ul className="mt-2.5 sm:mt-3 space-y-2.5 sm:space-y-3">
        {ordered.map((a) => (
          <li key={a.id}>
            <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3 sm:p-4 transition-colors hover:border-primary/25 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-2.5 sm:gap-3 min-w-0">
                <span className={cn('mt-1 h-2 w-2 sm:h-2.5 sm:w-2.5 shrink-0 rounded-full', DOT_COLOR[a.status] || DOT_COLOR.paused)} />
                <div className="min-w-0">
                  <p className="text-[13px] sm:text-sm font-medium text-foreground">{TYPE_LABELS[a.type] || a.type}</p>
                  <p className="mt-0.5 text-[11px] sm:text-xs text-muted-foreground">{TYPE_DESCRIPTIONS[a.type]}</p>
                  <p className="mt-0.5 text-[10px] sm:text-[11px] text-muted-foreground">Last run: {timeAgo(a.last_run_at)}</p>
                </div>
              </div>
              <div className="flex shrink-0 gap-2 self-end sm:self-center">
                <Button size="sm" variant="outline" onClick={() => navigate(agentEditPath(a.id))}>
                  Edit
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate(`${ROUTES.dashboard.runNew}?agent_type=${a.type}`)}
                >
                  Run
                </Button>
              </div>
            </div>
          </li>
        ))}
        {ordered.length === 0 && (
          <li className="rounded-xl border border-border bg-card p-5 sm:p-6 text-center text-[13px] sm:text-sm text-muted-foreground">
            No agents found. They are created automatically when you sign up.
          </li>
        )}
      </ul>

      {customAgents.length > 0 && (
        <div className="mt-6 sm:mt-8">
          <h2 className="text-[13px] sm:text-sm font-medium text-foreground">Your custom agents</h2>
          <p className="mt-1 text-[11px] sm:text-xs text-muted-foreground">
            Runs use the Content workflow with your mission as the goal and starter text prefilled.
          </p>
          <ul className="mt-2.5 sm:mt-3 space-y-2">
            {customAgents.map((a) => (
              <li
                key={a.id}
                className="flex flex-col gap-2.5 rounded-xl border border-border bg-card p-3 sm:p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="text-[13px] sm:text-sm font-medium text-foreground">{a.name}</p>
                  <p className="mt-0.5 line-clamp-2 text-[11px] sm:text-xs text-muted-foreground">{a.mission}</p>
                </div>
                <div className="flex shrink-0 gap-2 self-end sm:self-center">
                  <Button size="sm" onClick={() => runCustomAgent(a)}>
                    Run
                  </Button>
                  <Button size="sm" variant="outline" type="button" onClick={() => void deleteCustom(a.id)} aria-label="Delete agent">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 sm:mt-8 flex flex-wrap gap-2 sm:gap-3">
        <Button variant="outline" size="sm" className="text-[12px] sm:text-sm" asChild>
          <Link to={ROUTES.dashboard.connections}>Connections</Link>
        </Button>
        <Button variant="outline" size="sm" className="text-[12px] sm:text-sm" asChild>
          <Link to={ROUTES.dashboard.runNew}>New workflow</Link>
        </Button>
        <Button variant="outline" size="sm" className="text-[12px] sm:text-sm" asChild>
          <Link to={ROUTES.dashboard.noraAgentBuilder}>Create agent with Nora</Link>
        </Button>
      </div>
    </div>
  );
}
