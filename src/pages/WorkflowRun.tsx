import { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { WorkflowTimeline } from '@/components/dashboard/WorkflowTimeline';
import { OutputCard } from '@/components/dashboard/OutputCard';
import { TemplateCard } from '@/components/dashboard/TemplateCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Play } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: string;
  steps: string[];
}

interface Output {
  id: string;
  output_type: string;
  content: string;
  position: number;
}

const WORKFLOW_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/nora-workflow`;

const WorkflowRun = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const isNew = id === 'new';
  const preselectedTemplate = searchParams.get('template');
  const prefilledInput = searchParams.get('input') || '';

  // Wizard state
  const [wizardStep, setWizardStep] = useState(preselectedTemplate ? 1 : 0);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>(preselectedTemplate || '');
  const [inputText, setInputText] = useState(prefilledInput);
  const [goal, setGoal] = useState('');
  const [tone, setTone] = useState('professional');

  // Run state
  const [runId, setRunId] = useState<string | null>(isNew ? null : id || null);
  const [currentStep, setCurrentStep] = useState('input_received');
  const [steps, setSteps] = useState<string[]>([]);
  const [status, setStatus] = useState('pending');
  const [outputs, setOutputs] = useState<Output[]>([]);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState('');

  // Load templates for wizard
  useEffect(() => {
    supabase.from('workflow_templates').select('*').order('created_at').then(({ data }) => {
      if (data) setTemplates(data as Template[]);
    });
  }, []);

  // Load existing run
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
      {
        const wt = run.workflow_templates as { steps?: string[] } | null;
        setSteps(Array.isArray(wt?.steps) ? wt.steps : []);
      }

      if (run.status === 'completed') {
        const { data: outs } = await supabase
          .from('workflow_outputs')
          .select('*')
          .eq('run_id', rid)
          .order('position');
        if (outs) setOutputs(outs);
      }
    }
  }, []);

  useEffect(() => {
    if (runId && !isNew) loadRun(runId);
  }, [runId, isNew, loadRun]);

  // Subscribe to realtime updates for the run
  useEffect(() => {
    if (!runId || isNew) return;

    const channel = supabase
      .channel(`run-${runId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'workflow_runs',
        filter: `id=eq.${runId}`,
      }, (payload) => {
        const updated = payload.new as { current_step?: string; status?: string };
        setCurrentStep(updated.current_step || 'done');
        if (typeof updated.status === 'string') setStatus(updated.status);
        if (updated.status === 'completed') {
          supabase
            .from('workflow_outputs')
            .select('*')
            .eq('run_id', runId)
            .order('position')
            .then(({ data }) => { if (data) setOutputs(data); });
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [runId, isNew]);

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
      // Create the run record
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

      // Edge function uses verify_jwt: user access token (not the anon key).
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
        }),
      });

      if (!resp.ok) {
        const errText = await resp.text();
        throw new Error(errText || `Error ${resp.status}`);
      }

      // Parse SSE stream
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
              const evt = JSON.parse(jsonStr);
              if (evt.step) setCurrentStep(evt.step);
              if (evt.status) setStatus(evt.status);
              if (evt.outputs) setOutputs(evt.outputs);
            } catch { /* ignore partial */ }
          }
        }
      }

      // Navigate to the run detail
      navigate(`/dashboard/run/${run.id}`, { replace: true });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
      setStatus('failed');
    } finally {
      setRunning(false);
    }
  };

  // Wizard view for new runs
  if (isNew && status === 'pending') {
    return (
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>

        <h1 className="text-xl font-semibold text-foreground">New Workflow Run</h1>

        {/* Step 0: Choose template */}
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

        {/* Step 1: Input */}
        {wizardStep >= 1 && (
          <div className="mt-6 space-y-5">
            <div className="surface-panel p-5">
              <label className="mb-2 block text-sm font-medium text-foreground">Your raw idea or thought</label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="e.g. building Nora taught me most founders don't need more ideas, they need better execution loops"
                rows={4}
                className="w-full resize-none rounded-lg border border-border bg-card/50 p-3 text-sm text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-primary/30"
              />
            </div>

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

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <div className="flex gap-3">
              {!preselectedTemplate && (
                <Button variant="outline" onClick={() => setWizardStep(0)}>
                  Back
                </Button>
              )}
              <Button
                onClick={executeRun}
                disabled={running || !inputText.trim()}
                className="gap-2"
              >
                <Play className="h-4 w-4" />
                {running ? 'Running...' : 'Run Nora'}
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Running / completed view
  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <button
        type="button"
        onClick={() => navigate('/dashboard')}
        className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </button>

      <h1 className="text-xl font-semibold text-foreground">Workflow Run</h1>

      {/* Input preview */}
      <div className="surface-panel mt-4 p-4">
        <p className="text-xs text-muted-foreground">Input</p>
        <p className="mt-1 text-sm text-foreground">{inputText}</p>
      </div>

      {/* Timeline */}
      {steps.length > 0 && (
        <div className="mt-6">
          <h2 className="mb-3 text-sm font-medium text-foreground">Progress</h2>
          <div className="surface-panel p-5">
            <WorkflowTimeline steps={steps} currentStep={currentStep} />
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-4 rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Outputs */}
      {outputs.length > 0 && (
        <div className="mt-6">
          <h2 className="mb-3 text-sm font-medium text-foreground">Generated Content</h2>
          <div className="space-y-3">
            {outputs.map((o) => (
              <OutputCard key={o.id} type={o.output_type} content={o.content} position={o.position} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowRun;
