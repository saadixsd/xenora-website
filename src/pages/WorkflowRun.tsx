import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { WorkflowTimeline } from '@/components/dashboard/WorkflowTimeline';
import { OutputCard } from '@/components/dashboard/OutputCard';
import { TemplateCard } from '@/components/dashboard/TemplateCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Play, Archive, Trash2, ArchiveRestore } from 'lucide-react';
import { ROUTES, dashboardRunPath } from '@/config/routes';

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

const WorkflowRun = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const isNew = id === 'new';
  const preselectedTemplate = searchParams.get('template');
  const prefilledInput = searchParams.get('input') || '';
  const prefilledGoal = searchParams.get('goal') || '';

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

  useEffect(() => {
    supabase.from('workflow_templates').select('*').order('created_at').then(({ data }) => {
      if (data) setTemplates(data as Template[]);
    });
  }, []);

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
      <div className="mx-auto min-h-0 min-w-0 max-w-3xl px-4 py-6 sm:px-6">
        <button
          type="button"
          onClick={() => navigate(ROUTES.dashboard.root)}
          className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>

        <h1 className="text-xl font-semibold text-foreground">New Workflow Run</h1>

        {wizardStep === 0 && (
          <div className="mt-6">
            <p className="text-sm text-muted-foreground">Choose a workflow</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
        )}

        {wizardStep >= 1 && (
          <div className="mt-6 space-y-5">
            <div className="surface-panel p-5">
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

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex gap-3">
              {!preselectedTemplate && (
                <Button variant="outline" onClick={() => setWizardStep(0)}>
                  Back
                </Button>
              )}
              <Button onClick={() => void executeRun()} disabled={running || !inputText.trim()} className="gap-2">
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
    <div className="mx-auto min-h-0 min-w-0 max-w-3xl px-4 py-6 sm:px-6">
      <button
        type="button"
        onClick={() => navigate(ROUTES.dashboard.root)}
        className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </button>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <h1 className="text-xl font-semibold text-foreground">Workflow Run</h1>
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
