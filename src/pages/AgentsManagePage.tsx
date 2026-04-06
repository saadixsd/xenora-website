import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const AGENTS = [
  {
    name: 'Content Agent',
    path: ROUTES.dashboard.agents.content,
    description: 'Social and long-form drafts from a single input.',
  },
  {
    name: 'Lead Agent',
    path: ROUTES.dashboard.agents.lead,
    description: 'Replies and follow-up planning from lead context.',
  },
  {
    name: 'Research Agent',
    path: ROUTES.dashboard.agents.research,
    description: 'Signals and angles from notes plus optional URLs.',
  },
];

interface CustomAgentRow {
  id: string;
  name: string;
  mission: string;
  starter_prompt: string | null;
  created_at: string;
}

export default function AgentsManagePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [customAgents, setCustomAgents] = useState<CustomAgentRow[]>([]);
  const [contentTemplateId, setContentTemplateId] = useState<string | null>(null);

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
    const input = (a.starter_prompt || `Run my “${a.name}” agent: ${a.mission}`).slice(0, 8000);
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

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={() => navigate(ROUTES.dashboard.root)}
        className="mb-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Dashboard
      </button>

      <h1 className="text-xl font-semibold text-foreground sm:text-2xl">Manage agents</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Built-in workflows below. Custom agents are created with Nora in{' '}
        <Link to={ROUTES.dashboard.noraAgentBuilder} className="text-primary hover:underline">
          Build agent
        </Link>{' '}
        mode, then deployed here.
      </p>

      {customAgents.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-medium text-foreground">Your custom agents</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Runs use the Content workflow with your mission as the goal and starter text prefilled.
          </p>
          <ul className="mt-3 space-y-2">
            {customAgents.map((a) => (
              <li
                key={a.id}
                className="surface-panel flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{a.name}</p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{a.mission}</p>
                </div>
                <div className="flex shrink-0 gap-2">
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

      <h2 className="mt-10 text-sm font-medium text-foreground">Built-in agents</h2>
      <ul className="mt-3 space-y-3">
        {AGENTS.map((a) => (
          <li key={a.path}>
            <button
              type="button"
              onClick={() => navigate(a.path)}
              className="surface-panel w-full p-4 text-left transition-colors hover:border-primary/25"
            >
              <p className="text-sm font-medium text-foreground">{a.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{a.description}</p>
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button variant="outline" asChild>
          <Link to={ROUTES.dashboard.settings}>Open Settings</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to={ROUTES.dashboard.runNew}>New workflow</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to={ROUTES.dashboard.noraAgentBuilder}>Create agent with Nora</Link>
        </Button>
      </div>
    </div>
  );
}
