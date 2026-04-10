import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { WorkflowTimeline } from '@/components/dashboard/WorkflowTimeline';
import { OutputCard } from '@/components/dashboard/OutputCard';
import { TemplateCard } from '@/components/dashboard/TemplateCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Play, Archive, Trash2, ArchiveRestore, Plus, Bot } from 'lucide-react';
import { ROUTES, dashboardRunPath } from '@/config/routes';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface Template {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: string;
  steps: string[];
}

interface Output {
  id?: string;
  output_type: string;
  content: string;
  position: number;
}

const WORKFLOW_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/nora-workflow`;

function parseSourceUrls(raw: string): string[] {
  return raw
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 5);
}

/** Aligns with Dashboard / nora-workflow template classification. */
function classifyTemplateKind(name: string): 'content' | 'leads' | 'research' {
  const n = name.toLowerCase();
  if (n.includes('lead')) return 'leads';
  if (n.includes('research')) return 'research';
  return 'content';
}

interface CustomAgent {
  id: string;
  name: string;
  mission: string | null;
  starter_prompt: string | null;
}

const MAX_CUSTOM_AGENTS = 5;

const BUILTIN_AGENT_INFO: Record<string, { label: string; description: string; status: string }> = {
  content: { label: 'Content Agent', description: 'X posts, hooks, LinkedIn drafts, and CTAs.', status: 'Live' },
  leads: { label: 'Lead Agent', description: 'Score leads, draft replies, queue follow-ups.', status: 'Beta' },
  research: { label: 'Research Agent', description: 'Pain signals and angles from notes + URLs.', status: 'Coming soon' },
};

const AGENT_TYPE_QUERY_VALUES = new Set(['content', 'leads', 'research']);

const WorkflowRun = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const isNew = id === 'new';
  const preselectedTemplate = searchParams.get('template');
  const prefilledInput = searchParams.get('input') || '';
  const prefilledGoal = searchParams.get('goal') || '';
  const rawAgentType = searchParams.get('agent_type')?.trim().toLowerCase() ?? '';
  const agentTypeFromQuery =
    rawAgentType && AGENT_TYPE_QUERY_VALUES.has(rawAgentType) ? (rawAgentType as 'content' | 'leads' | 'research') : null;

  const [wizardStep, setWizardStep] = useState(preselectedTemplate ? 1 : 0);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>(preselectedTemplate || '');
  const [inputText, setInputText] = useState(prefilledInput);
  const [goal, setGoal] = useState(prefilledGoal);
  const [tone, setTone] = useState('professional');
  const [researchUrlsRaw, setResearchUrlsRaw] = useState('');

  const [runId, setRunId] = useState<string | null>(isNew ? null : id || null);
  const [currentStep, setCurrentStep] = useState('input_received');
  const [steps, setSteps] = useState<string[]>([]);
  const [status, setStatus] = useState('pending');
  const [outputs, setOutputs] = useState<Output[]>([]);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState('');
  const [archivedAt, setArchivedAt] = useState<string | null>(null);
  const [lifecycleBusy, setLifecycleBusy] = useState(false);
  /** Set when `agent_type` query matches a row in `agents` (Command Center agents). */
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [customAgents, setCustomAgents] = useState<CustomAgent[]>([]);

  useEffect(() => {
    if (!user?.id) return;
    supabase
      .from('user_custom_agents')
      .select('id, name, mission, starter_prompt')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(MAX_CUSTOM_AGENTS)
      .then(({ data }) => {
        if (data) setCustomAgents(data as CustomAgent[]);
      });
  }, [user?.id]);

  useEffect(() => {
    supabase.from('workflow_templates').select('*').order('created_at').then(({ data }) => {
      if (data) setTemplates(data as Template[]);
    });
  }, []);

  // Deep-link from agent cards / Manage agents: ?agent_type=content|leads|research
  useEffect(() => {
    if (preselectedTemplate || !agentTypeFromQuery || templates.length === 0) return;
    const match = templates.find((t) => classifyTemplateKind(t.name) === agentTypeFromQuery);
    if (match) {
      setSelectedTemplate(match.id);
      setWizardStep(1);
    }
  }, [preselectedTemplate, agentTypeFromQuery, templates]);

  useEffect(() => {
    if (!agentTypeFromQuery || !user?.id) {
      setSelectedAgentId(null);
      return;
    }
    void (async () => {
      const { data } = await (supabase.from('agents' as any) as any)
        .select('id')
        .eq('user_id', user.id)
        .eq('type', agentTypeFromQuery)
        .maybeSingle();
      setSelectedAgentId(data?.id ?? null);
    })();
  }, [agentTypeFromQuery, user?.id]);

  const loadRun = useCallback(async (rid: string) => {
    const { data: run } = await supabase
      .from('workflow_runs')
      .select('*, workflow_templates(*)')
      .eq('id', rid)
      .single();

    if (run) {
      setCurrentStep(run.current_step || 'input_received');
      setStatus(run.status);
      setInputText(run.input_text);
      setGoal(run.goal || '');
      setTone(run.tone || 'professional');
      setArchivedAt(run.archived_at ?? null);
      {
        const wt = run.workflow_templates as { steps?: string[] } | null;
        setSteps(Array.isArray(wt?.steps) ? wt.steps : []);
      }

      if (run.status === 'completed' || run.status === 'failed') {
        const { data: outs } = await supabase
          .from('workflow_outputs')
          .select('*')
          .eq('run_id', rid)
          .order('position');
        if (outs) setOutputs(outs as Output[]);
      } else {
        setOutputs([]);
      }
    }
  }, []);

  useEffect(() => {
    if (runId && !isNew) loadRun(runId);
  }, [runId, isNew, loadRun]);

  useEffect(() => {
    if (!runId || isNew) return;

    // Poll for workflow run updates every 3 seconds until completed/failed
    const interval = window.setInterval(async () => {
      const { data } = await supabase
        .from('workflow_runs')
        .select('current_step, status, archived_at')
        .eq('id', runId)
        .single();

      if (!data) return;
      const updated = data as { current_step?: string; status?: string; archived_at?: string | null };
      setCurrentStep(updated.current_step || 'done');
      if (typeof updated.status === 'string') setStatus(updated.status);
      if ('archived_at' in updated) setArchivedAt(updated.archived_at ?? null);

      if (updated.status === 'completed' || updated.status === 'failed') {
        window.clearInterval(interval);
        if (updated.status === 'completed') {
          const { data: outData } = await supabase
            .from('workflow_outputs')
            .select('*')
            .eq('run_id', runId)
            .order('position');
          if (outData) setOutputs(outData as Output[]);
        }
      }
    }, 3000);

    return () => {
      window.clearInterval(interval);
    };
  }, [runId, isNew]);

  const selectedTemplateName = useMemo(
    () => templates.find((t) => t.id === selectedTemplate)?.name ?? '',
    [templates, selectedTemplate],
  );
  const isResearchTemplate = selectedTemplateName.toLowerCase().includes('research');

  const handleSelectTemplate = (tid: string) => {
    setSelectedTemplate(tid);
    setWizardStep(1);
  };

  const executeRun = async () => {
    if (!user || !selectedTemplate || !inputText.trim()) return;
    setRunning(true);
    setError('');

    const template = templates.find((t) => t.id === selectedTemplate);
    if (template) setSteps(template.steps as string[]);

    try {
      const { data: run, error: runErr } = await supabase
        .from('workflow_runs')
        .insert({
          user_id: user.id,
          template_id: selectedTemplate,
          ...(selectedAgentId ? { agent_id: selectedAgentId } : {}),
          input_text: inputText.trim(),
          goal: goal.trim() || null,
          tone,
          status: 'running',
          current_step: 'input_received',
        })
        .select()
        .single();

      if (runErr || !run) throw new Error(runErr?.message || 'Failed to create run');

      setRunId(run.id);
      setStatus('running');
      setCurrentStep('input_received');

      const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;
      if (sessionErr || !accessToken) {
        throw new Error('Your session expired. Sign in again.');
      }

      const source_urls = isResearchTemplate ? parseSourceUrls(researchUrlsRaw) : [];

      const resp = await fetch(WORKFLOW_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({
          run_id: run.id,
          input_text: inputText.trim(),
          goal: goal.trim() || undefined,
          tone,
          ...(source_urls.length ? { source_urls } : {}),
        }),
      });

      if (!resp.ok) {
        const errText = await resp.text();
        let parsed: { error?: string; message?: string } = {};
        try {
          parsed = JSON.parse(errText) as { error?: string; message?: string };
        } catch {
          /* plain text */
        }
        if (resp.status === 429 && parsed.error === 'free_tier_exhausted') {
          await supabase.from('workflow_runs').update({ status: 'failed' }).eq('id', run.id);
          setStatus('failed');
          setError(parsed.message || 'Free tier workflow limit reached for this month.');
          toast({
            title: 'Monthly run limit',
            description: parsed.message || 'Upgrade in Settings → Billing to continue.',
            variant: 'destructive',
          });
          setRunning(false);
          return;
        }
        throw new Error(errText || `Error ${resp.status}`);
      }

      const reader = resp.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          let newlineIdx: number;
          while ((newlineIdx = buffer.indexOf('\n')) !== -1) {
            const line = buffer.slice(0, newlineIdx).trim();
            buffer = buffer.slice(newlineIdx + 1);

            if (!line.startsWith('data: ')) continue;
            const jsonStr = line.slice(6).trim();
            if (jsonStr === '[DONE]') break;

            try {
              const evt = JSON.parse(jsonStr) as {
                step?: string;
                status?: string;
                outputs?: Output[];
                error?: string;
              };
              if (evt.step) setCurrentStep(evt.step);
              if (evt.status) setStatus(evt.status);
              if (evt.outputs) setOutputs(evt.outputs);
              if (evt.error) setError(evt.error);
            } catch {
              /* ignore partial */
            }
          }
        }
      }

      navigate(dashboardRunPath(run.id), { replace: true });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
      setStatus('failed');
    } finally {
      setRunning(false);
    }
  };

  const handleArchive = async () => {
    if (!runId || isNew) return;
    setLifecycleBusy(true);
    await supabase.from('workflow_runs').update({ archived_at: new Date().toISOString() }).eq('id', runId);
    setArchivedAt(new Date().toISOString());
    setLifecycleBusy(false);
    navigate(ROUTES.dashboard.history);
  };

  const handleUnarchive = async () => {
    if (!runId || isNew) return;
    setLifecycleBusy(true);
    await supabase.from('workflow_runs').update({ archived_at: null }).eq('id', runId);
    setArchivedAt(null);
    setLifecycleBusy(false);
  };

  const handleDelete = async () => {
    if (!runId || isNew) return;
    if (!window.confirm('Delete this workflow run permanently? This cannot be undone.')) return;
    setLifecycleBusy(true);
    await supabase.from('workflow_runs').delete().eq('id', runId);
    setLifecycleBusy(false);
    navigate(ROUTES.dashboard.history);
  };

  if (isNew && status === 'pending') {
    return (
      <div className="mx-auto min-h-0 min-w-0 max-w-3xl px-3 py-4 sm:px-6 sm:py-6">
        <button
          type="button"
          onClick={() => navigate(ROUTES.dashboard.root)}
          className="mb-4 sm:mb-6 flex items-center gap-2 text-[13px] sm:text-sm text-muted-foreground hover:text-foreground min-h-[44px]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>

        <h1 className="text-lg font-semibold text-foreground sm:text-xl">New Workflow Run</h1>
        {agentTypeFromQuery && (
          <p className="mt-1 text-[12px] text-muted-foreground">
            Template:{' '}
            <span className="font-medium text-foreground">
              {agentTypeFromQuery === 'leads'
                ? 'Leads Agent'
                : agentTypeFromQuery === 'research'
                  ? 'Research Agent'
                  : 'Content Agent'}
            </span>
            {selectedAgentId ? ' — run is tied to your agent in Command Center.' : ''}
          </p>
        )}

        {wizardStep === 0 && (
          <div className="mt-4 sm:mt-6 space-y-6">
            {/* Built-in agents */}
            <div>
              <p className="text-[13px] sm:text-sm font-medium text-foreground mb-3">Built-in Agents</p>
              <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {['content', 'leads', 'research'].map((agentType) => {
                  const info = BUILTIN_AGENT_INFO[agentType];
                  const matchingTemplate = templates.find((t) => classifyTemplateKind(t.name) === agentType);
                  const isDisabled = info.status === 'Coming soon';
                  return (
                    <button
                      key={agentType}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => {
                        if (matchingTemplate) handleSelectTemplate(matchingTemplate.id);
                      }}
                      className={cn(
                        'flex flex-col items-start gap-1.5 rounded-xl border border-border bg-card p-4 text-left transition-all',
                        isDisabled
                          ? 'cursor-not-allowed opacity-50'
                          : 'hover:border-primary/40 hover:shadow-sm',
                      )}
                    >
                      <div className="flex w-full items-center justify-between">
                        <Bot className="h-5 w-5 text-primary" />
                        <span className={cn(
                          'rounded-full px-2 py-0.5 text-[10px] font-medium',
                          info.status === 'Live' ? 'bg-emerald-500/15 text-emerald-600' :
                          info.status === 'Beta' ? 'bg-amber-500/15 text-amber-600' :
                          'bg-muted text-muted-foreground',
                        )}>
                          {info.status}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-foreground">{info.label}</p>
                      <p className="text-[11px] text-muted-foreground">{info.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom agents */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[13px] sm:text-sm font-medium text-foreground">
                  Your Custom Agents ({customAgents.length}/{MAX_CUSTOM_AGENTS})
                </p>
                {customAgents.length < MAX_CUSTOM_AGENTS && (
                  <Link
                    to={ROUTES.dashboard.noraAgentBuilder}
                    className="flex items-center gap-1 text-[11px] text-primary hover:underline"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Create agent
                  </Link>
                )}
              </div>
              {customAgents.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border bg-card/50 p-5 text-center">
                  <p className="text-[12px] text-muted-foreground">No custom agents yet</p>
                  <Link
                    to={ROUTES.dashboard.noraAgentBuilder}
                    className="mt-1 inline-block text-[12px] text-primary hover:underline"
                  >
                    Build one with Nora →
                  </Link>
                </div>
              ) : (
                <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {customAgents.map((a) => {
                    const contentTemplate = templates.find((t) => classifyTemplateKind(t.name) === 'content');
                    return (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => {
                          if (contentTemplate) {
                            handleSelectTemplate(contentTemplate.id);
                            if (a.mission) setGoal(a.mission);
                            if (a.starter_prompt) setInputText(a.starter_prompt);
                          }
                        }}
                        className="flex flex-col items-start gap-1.5 rounded-xl border border-border bg-card p-4 text-left transition-all hover:border-primary/40 hover:shadow-sm"
                      >
                        <Bot className="h-5 w-5 text-muted-foreground" />
                        <p className="text-sm font-medium text-foreground">{a.name}</p>
                        <p className="line-clamp-2 text-[11px] text-muted-foreground">{a.mission}</p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Workflow templates */}
            <div>
              <p className="text-[13px] sm:text-sm font-medium text-foreground mb-3">Or choose a workflow template</p>
              <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {templates.map((t) => (
                  <TemplateCard
                    key={t.id}
                    name={t.name}
                    description={t.description}
                    icon={t.icon}
                    status={t.status}
                    onSelect={() => handleSelectTemplate(t.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {wizardStep >= 1 && (
          <div className="mt-4 sm:mt-6 space-y-4 sm:space-y-5">
            <div className="surface-panel p-3.5 sm:p-5">
              <label className="mb-2 block text-sm font-medium text-foreground">
                {isResearchTemplate ? 'Research focus & notes' : 'Your raw idea or thought'}
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  isResearchTemplate
                    ? 'What you want to learn, your niche, and context (required).'
                    : 'e.g. building XenoraAI taught me most founders don’t need more ideas, they need better execution loops'
                }
                rows={4}
                className="w-full resize-none rounded-lg border border-border bg-card/50 p-3 text-sm text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-primary/30"
              />
            </div>

            {isResearchTemplate && (
              <div className="surface-panel p-5">
                <label className="mb-2 block text-sm font-medium text-foreground">Source URLs (optional, max 5)</label>
                <p className="mb-2 text-xs text-muted-foreground">
                  One per line. Reddit thread links are fetched server-side when possible; failures still run on your notes.
                </p>
                <textarea
                  value={researchUrlsRaw}
                  onChange={(e) => setResearchUrlsRaw(e.target.value)}
                  placeholder="https://www.reddit.com/r/SomeSub/comments/..."
                  rows={3}
                  className="w-full resize-none rounded-lg border border-border bg-card/50 p-3 text-sm text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-primary/30"
                />
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="surface-panel p-5">
                <label className="mb-2 block text-sm font-medium text-foreground">Goal (optional)</label>
                <Input
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g. Drive signups for beta"
                  className="bg-card/50 border-border"
                />
              </div>
              <div className="surface-panel p-5">
                <label className="mb-2 block text-sm font-medium text-foreground">Tone</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full rounded-lg border border-border bg-card/50 px-3 py-2 text-sm text-foreground outline-none focus:border-primary/30"
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="bold">Bold</option>
                  <option value="witty">Witty</option>
                  <option value="inspirational">Inspirational</option>
                </select>
              </div>
            </div>

            {error && <p className="text-[13px] sm:text-sm text-destructive">{error}</p>}

            <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
              {!preselectedTemplate && (
                <Button variant="outline" onClick={() => setWizardStep(0)} className="min-h-[44px] sm:min-h-0">
                  Back
                </Button>
              )}
              <Button onClick={() => void executeRun()} disabled={running || !inputText.trim()} className="gap-2 min-h-[44px] sm:min-h-0">
                <Play className="h-4 w-4" />
                {running ? 'Running...' : 'Run workflow'}
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-0 min-w-0 max-w-3xl px-3 py-4 sm:px-6 sm:py-6">
      <button
        type="button"
        onClick={() => navigate(ROUTES.dashboard.root)}
        className="mb-4 sm:mb-6 flex items-center gap-2 text-[13px] sm:text-sm text-muted-foreground hover:text-foreground min-h-[44px]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </button>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <h1 className="text-lg font-semibold text-foreground sm:text-xl">Workflow Run</h1>
        {!isNew && runId && (
          <div className="flex flex-wrap gap-2">
            {archivedAt ? (
              <Button variant="outline" size="sm" disabled={lifecycleBusy} onClick={() => void handleUnarchive()} className="gap-1.5">
                <ArchiveRestore className="h-3.5 w-3.5" />
                Unarchive
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled={lifecycleBusy} onClick={() => void handleArchive()} className="gap-1.5">
                <Archive className="h-3.5 w-3.5" />
                Archive
              </Button>
            )}
            <Button variant="outline" size="sm" disabled={lifecycleBusy} onClick={() => void handleDelete()} className="gap-1.5 text-destructive hover:text-destructive">
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </Button>
          </div>
        )}
      </div>

      {archivedAt && (
        <p className="mt-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-800 dark:text-amber-200">
          This run is archived. It is hidden from the main dashboard and history lists.
        </p>
      )}

      <div className="surface-panel mt-4 p-4">
        <p className="text-xs text-muted-foreground">Input</p>
        <p className="mt-1 text-sm text-foreground">{inputText}</p>
      </div>

      {steps.length > 0 && (
        <div className="mt-6">
          <h2 className="mb-3 text-sm font-medium text-foreground">Progress</h2>
          <div className="surface-panel p-5">
            <WorkflowTimeline steps={steps} currentStep={currentStep} />
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {outputs.length > 0 && (
        <div className="mt-6">
          <h2 className="mb-3 text-sm font-medium text-foreground">Outputs</h2>
          <div className="space-y-3">
            {outputs.map((o, idx) => (
              <OutputCard
                key={o.id ?? `out-${o.position}-${idx}`}
                id={o.id}
                type={o.output_type}
                content={o.content}
                position={o.position}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowRun;
