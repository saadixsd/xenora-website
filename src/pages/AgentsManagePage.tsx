import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import { ArrowLeft, Trash2, Pencil, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const MAX_CUSTOM_AGENTS = 5;

interface CustomAgentRow {
  id: string;
  name: string;
  mission: string | null;
  starter_prompt: string | null;
  target_user: string | null;
  raw_inputs: string | null;
  output_deliverables: string | null;
  guardrails: string | null;
  created_at: string;
}

const BUILTIN_AGENTS = [
  {
    type: 'content',
    label: 'Content Agent',
    description: 'Social and long-form drafts from a single input.',
    status: 'active' as const,
  },
  {
    type: 'leads',
    label: 'Lead Agent',
    description: 'Score leads, draft replies, queue follow-ups. You approve before send.',
    status: 'beta' as const,
  },
  {
    type: 'research',
    label: 'Research Agent',
    description: 'Pain signals and angles from notes plus optional URLs.',
    status: 'coming_soon' as const,
  },
];

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  active: { label: 'Live', className: 'bg-emerald-500/15 text-emerald-600' },
  beta: { label: 'Beta', className: 'bg-amber-500/15 text-amber-600' },
  coming_soon: { label: 'Coming soon', className: 'bg-zinc-500/15 text-zinc-500' },
};

export default function AgentsManagePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [customAgents, setCustomAgents] = useState<CustomAgentRow[]>([]);
  const [contentTemplateId, setContentTemplateId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<CustomAgentRow>>({});
  const [saving, setSaving] = useState(false);

  const loadCustom = useCallback(() => {
    if (!user?.id) return;
    void supabase
      .from('user_custom_agents')
      .select('id, name, mission, starter_prompt, target_user, raw_inputs, output_deliverables, guardrails, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) { console.error(error); return; }
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

  useEffect(() => { loadCustom(); }, [loadCustom]);

  const runCustomAgent = (a: CustomAgentRow) => {
    if (!contentTemplateId) {
      toast({ title: 'Template unavailable', variant: 'destructive' });
      return;
    }
    const p = new URLSearchParams();
    p.set('template', contentTemplateId);
    p.set('goal', a.mission || '');
    const input = (a.starter_prompt || `Run my "${a.name}" agent: ${a.mission}`).slice(0, 8000);
    p.set('input', input);
    navigate(`${ROUTES.dashboard.runNew}?${p.toString()}`);
  };

  const deleteCustom = async (id: string) => {
    if (!window.confirm('Remove this saved agent?')) return;
    const { error } = await supabase.from('user_custom_agents').delete().eq('id', id);
    if (error) { toast({ title: 'Delete failed', description: error.message, variant: 'destructive' }); return; }
    toast({ title: 'Agent removed' });
    setEditingId(null);
    loadCustom();
  };

  const startEdit = (a: CustomAgentRow) => {
    setEditingId(a.id);
    setEditForm({
      name: a.name,
      mission: a.mission || '',
      starter_prompt: a.starter_prompt || '',
      target_user: a.target_user || '',
      raw_inputs: a.raw_inputs || '',
      output_deliverables: a.output_deliverables || '',
      guardrails: a.guardrails || '',
    });
  };

  const cancelEdit = () => { setEditingId(null); setEditForm({}); };

  const saveEdit = async () => {
    if (!editingId) return;
    setSaving(true);
    const { error } = await (supabase.from('user_custom_agents') as any)
      .update({
        name: editForm.name?.slice(0, 120) || 'Untitled',
        mission: editForm.mission?.slice(0, 4000) || null,
        starter_prompt: editForm.starter_prompt?.slice(0, 4000) || null,
        target_user: editForm.target_user?.slice(0, 2000) || null,
        raw_inputs: editForm.raw_inputs?.slice(0, 4000) || null,
        output_deliverables: editForm.output_deliverables?.slice(0, 4000) || null,
        guardrails: editForm.guardrails?.slice(0, 4000) || null,
      })
      .eq('id', editingId);
    setSaving(false);
    if (error) { toast({ title: 'Save failed', description: error.message, variant: 'destructive' }); return; }
    toast({ title: 'Agent updated' });
    setEditingId(null);
    loadCustom();
  };

  const atLimit = customAgents.length >= MAX_CUSTOM_AGENTS;

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
        Built-in and custom agents. Create custom agents with Nora in{' '}
        <Link to={ROUTES.dashboard.noraAgentBuilder} className="text-primary hover:underline">
          Agent Builder
        </Link>{' '}
        mode.
      </p>

      <h2 className="mt-5 sm:mt-6 text-[13px] sm:text-sm font-medium text-foreground">Built-in agents</h2>
      <ul className="mt-2.5 sm:mt-3 space-y-2.5 sm:space-y-3">
        {BUILTIN_AGENTS.map((a) => {
          const badge = STATUS_BADGE[a.status];
          return (
            <li key={a.type}>
              <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3 sm:p-4 transition-colors hover:border-primary/25 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-2.5 sm:gap-3 min-w-0">
                  <span className={cn('mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium', badge.className)}>
                    {badge.label}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13px] sm:text-sm font-medium text-foreground">{a.label}</p>
                    <p className="mt-0.5 text-[11px] sm:text-xs text-muted-foreground">{a.description}</p>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2 self-end sm:self-center">
                  <Button
                    size="sm"
                    disabled={a.status === 'coming_soon'}
                    onClick={() => navigate(`${ROUTES.dashboard.runNew}?agent_type=${a.type}`)}
                  >
                    Run
                  </Button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 sm:mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-[13px] sm:text-sm font-medium text-foreground">
            Your custom agents ({customAgents.length}/{MAX_CUSTOM_AGENTS})
          </h2>
        </div>
        {atLimit && (
          <p className="mt-1 text-[11px] text-amber-600">
            You've reached the {MAX_CUSTOM_AGENTS}-agent limit. Delete one to create a new agent.
          </p>
        )}

        {customAgents.length === 0 ? (
          <p className="mt-3 rounded-xl border border-border bg-card p-5 text-center text-[13px] text-muted-foreground">
            No custom agents yet. Create one with Nora's Agent Builder.
          </p>
        ) : (
          <ul className="mt-2.5 sm:mt-3 space-y-2">
            {customAgents.map((a) =>
              editingId === a.id ? (
                <li key={a.id} className="rounded-xl border border-primary/30 bg-card p-3 sm:p-4 space-y-3">
                  <div>
                    <label className="block text-[11px] font-medium text-muted-foreground mb-1">Name</label>
                    <input
                      value={editForm.name || ''}
                      onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary/30"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-muted-foreground mb-1">Mission</label>
                    <textarea
                      value={editForm.mission || ''}
                      onChange={(e) => setEditForm((f) => ({ ...f, mission: e.target.value }))}
                      rows={2}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary/30 resize-y"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-muted-foreground mb-1">Starter Prompt</label>
                    <textarea
                      value={editForm.starter_prompt || ''}
                      onChange={(e) => setEditForm((f) => ({ ...f, starter_prompt: e.target.value }))}
                      rows={2}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary/30 resize-y"
                    />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-[11px] font-medium text-muted-foreground mb-1">Target User</label>
                      <input
                        value={editForm.target_user || ''}
                        onChange={(e) => setEditForm((f) => ({ ...f, target_user: e.target.value }))}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary/30"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-muted-foreground mb-1">Guardrails</label>
                      <input
                        value={editForm.guardrails || ''}
                        onChange={(e) => setEditForm((f) => ({ ...f, guardrails: e.target.value }))}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary/30"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => void saveEdit()} disabled={saving} className="gap-1.5">
                      <Save className="h-3.5 w-3.5" />
                      {saving ? 'Saving...' : 'Save'}
                    </Button>
                    <Button size="sm" variant="outline" onClick={cancelEdit}>
                      <X className="h-3.5 w-3.5" />
                      Cancel
                    </Button>
                  </div>
                </li>
              ) : (
                <li
                  key={a.id}
                  className="flex flex-col gap-2.5 rounded-xl border border-border bg-card p-3 sm:p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="text-[13px] sm:text-sm font-medium text-foreground">{a.name}</p>
                    <p className="mt-0.5 line-clamp-2 text-[11px] sm:text-xs text-muted-foreground">{a.mission}</p>
                  </div>
                  <div className="flex shrink-0 gap-2 self-end sm:self-center">
                    <Button size="sm" onClick={() => runCustomAgent(a)}>Run</Button>
                    <Button size="sm" variant="outline" onClick={() => startEdit(a)} aria-label="Edit agent">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => void deleteCustom(a.id)} aria-label="Delete agent">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ),
            )}
          </ul>
        )}
      </div>

      <div className="mt-6 sm:mt-8 flex flex-wrap gap-2 sm:gap-3">
        <Button variant="outline" size="sm" className="text-[12px] sm:text-sm" asChild>
          <Link to={ROUTES.dashboard.runNew}>New workflow</Link>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-[12px] sm:text-sm"
          disabled={atLimit}
          asChild={!atLimit}
        >
          {atLimit ? (
            <span>Agent limit reached</span>
          ) : (
            <Link to={ROUTES.dashboard.noraAgentBuilder}>Create agent with Nora</Link>
          )}
        </Button>
      </div>
    </div>
  );
}
