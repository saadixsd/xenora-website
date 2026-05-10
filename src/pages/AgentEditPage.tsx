import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentWorkspaceId } from '@/lib/currentWorkspace';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { ROUTES } from '@/config/routes';
import { cn } from '@/lib/utils';

interface AgentRow {
  id: string;
  type: string;
  status: string;
  system_prompt: string;
  tone: string;
  response_depth: number;
  tools: string[];
  settings: Record<string, unknown>;
}

const TONE_OPTIONS = ['professional', 'casual', 'direct', 'deep analysis'] as const;

const TOOLS_BY_TYPE: Record<string, { id: string; label: string }[]> = {
  content: [
    { id: 'x_api', label: 'X API' },
    { id: 'instagram_api', label: 'Instagram API' },
    { id: 'linkedin_api', label: 'LinkedIn API' },
  ],
  leads: [
    { id: 'gmail_read', label: 'Gmail Read' },
    { id: 'gmail_send', label: 'Gmail Send' },
    { id: 'followup_timer', label: 'Follow-up Timer' },
  ],
  research: [
    { id: 'reddit_search', label: 'Reddit Search' },
    { id: 'x_search', label: 'X Search' },
    { id: 'web_search', label: 'Web Search' },
  ],
};

const TYPE_LABELS: Record<string, string> = {
  content: 'Content Agent',
  leads: 'Leads Agent',
  research: 'Research Agent',
};

export default function AgentEditPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [agent, setAgent] = useState<AgentRow | null>(null);
  const [systemPrompt, setSystemPrompt] = useState('');
  const [tone, setTone] = useState('professional');
  const [depth, setDepth] = useState(0.5);
  const [enabledTools, setEnabledTools] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [testOutput, setTestOutput] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);

  const loadAgent = useCallback(async () => {
    if (!id || !user) return;
    const { data, error } = await (supabase.from('agents' as any) as any)
      .select('id, type, status, system_prompt, tone, response_depth, tools, settings')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error || !data) {
      toast({ title: 'Agent not found', variant: 'destructive' });
      navigate(ROUTES.dashboard.agents.manage);
      return;
    }

    const row = data as AgentRow;
    setAgent(row);
    setSystemPrompt(row.system_prompt);
    setTone(row.tone);
    setDepth(row.response_depth);
    setEnabledTools(Array.isArray(row.tools) ? row.tools : []);
  }, [id, user, navigate, toast]);

  useEffect(() => {
    void loadAgent();
  }, [loadAgent]);

  const handleSave = async () => {
    if (!agent) return;
    setSaving(true);
    const { error } = await (supabase.from('agents' as any) as any)
      .update({
        system_prompt: systemPrompt,
        tone,
        response_depth: depth,
        tools: enabledTools,
      })
      .eq('id', agent.id);

    if (error) {
      toast({ title: 'Save failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Agent updated' });
    }
    setSaving(false);
  };

  const handleTestRun = async () => {
    if (!agent || !user) return;
    setTesting(true);
    setTestOutput(null);

    try {
      const { data: templates } = await supabase
        .from('workflow_templates')
        .select('id, name');

      const tName = agent.type === 'leads' ? 'lead' : agent.type;
      const template = (templates ?? []).find((t) =>
        t.name.toLowerCase().includes(tName),
      );

      if (!template) {
        setTestOutput('Error: Could not find a matching workflow template.');
        setTesting(false);
        return;
      }

      const workspaceId = await getCurrentWorkspaceId(user.id);
      const { data: run } = await (supabase.from('workflow_runs') as any)
        .insert({
          user_id: user.id,
          workspace_id: workspaceId,
          template_id: template.id,
          agent_id: agent.id,
          input_text: `Test run: ${systemPrompt.slice(0, 200)}`,
          tone,
          status: 'running',
        })
        .select('id')
        .single();

      if (!run) {
        setTestOutput('Error: Could not create test run.');
        setTesting(false);
        return;
      }

      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

      const resp = await fetch(`${supabaseUrl}/functions/v1/nora-workflow`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({
          run_id: run.id,
          input_text: `Test run: ${systemPrompt.slice(0, 200)}`,
          tone,
        }),
      });

      if (!resp.ok) {
        const text = await resp.text();
        let j: { error?: string; message?: string } = {};
        try {
          j = JSON.parse(text) as { error?: string; message?: string };
        } catch {
          /* */
        }
        if (resp.status === 429 && j.error === 'free_tier_exhausted') {
          setTestOutput(j.message || 'Free tier workflow limit reached — upgrade in Settings → Billing.');
          setTesting(false);
          return;
        }
        setTestOutput(`Error: ${text || resp.status}`);
        setTesting(false);
        return;
      }

      const reader = resp.body?.getReader();
      const decoder = new TextDecoder();
      let result = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const payload = JSON.parse(line.slice(6));
                if (payload.outputs) {
                  result = payload.outputs
                    .map((o: { output_type: string; content: string }) => `[${o.output_type}]\n${o.content}`)
                    .join('\n\n');
                } else if (payload.error) {
                  result = `Error: ${payload.error}`;
                } else if (payload.step) {
                  result = `Step: ${payload.step}...`;
                  setTestOutput(result);
                }
              } catch {
                // skip malformed SSE lines
              }
            }
          }
        }
      }

      setTestOutput(result || 'Run completed but no output was returned.');
    } catch (e) {
      setTestOutput(`Error: ${e instanceof Error ? e.message : 'Unknown error'}`);
    } finally {
      setTesting(false);
    }
  };

  const toggleTool = (toolId: string) => {
    setEnabledTools((prev) =>
      prev.includes(toolId) ? prev.filter((t) => t !== toolId) : [...prev, toolId],
    );
  };

  if (!agent) {
    return (
      <div className="mx-auto max-w-2xl px-3 sm:px-4 py-10">
        <p className="text-sm text-muted-foreground">Loading agent...</p>
      </div>
    );
  }

  const availableTools = TOOLS_BY_TYPE[agent.type] || [];

  return (
    <div className="mx-auto min-h-0 min-w-0 max-w-2xl px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
      <button
        type="button"
        onClick={() => navigate(ROUTES.dashboard.agents.manage)}
        className="mb-3 sm:mb-4 flex items-center gap-2 text-[13px] sm:text-sm text-muted-foreground hover:text-foreground min-h-[44px]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to agents
      </button>

      <h1 className="font-syne text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
        Edit {TYPE_LABELS[agent.type] || 'Agent'}
      </h1>
      <p className="mt-1 text-[13px] sm:text-sm text-muted-foreground">
        Tune the system prompt, tone, response depth, and tools for this agent.
      </p>

      <div className="mt-4 sm:mt-6 space-y-5 sm:space-y-6">
        <div>
          <label htmlFor="system-prompt" className="block text-[13px] sm:text-sm font-medium text-foreground mb-1.5">
            System Prompt
          </label>
          <textarea
            id="system-prompt"
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            rows={8}
            className="w-full rounded-lg border border-border bg-card px-3 py-2.5 font-mono text-[12px] sm:text-[13px] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:rows-12 resize-y min-h-[160px] sm:min-h-[240px]"
            placeholder="Define how this agent behaves..."
          />
        </div>

        <div>
          <p className="text-[13px] sm:text-sm font-medium text-foreground mb-2">Tone</p>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {TONE_OPTIONS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTone(t)}
                className={cn(
                  'rounded-lg border px-2.5 sm:px-3 py-1.5 text-[12px] sm:text-[13px] capitalize transition-colors min-h-[36px] sm:min-h-0',
                  tone === t
                    ? 'border-primary bg-primary/10 font-medium text-primary'
                    : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground',
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[13px] sm:text-sm font-medium text-foreground mb-2">Response Depth</p>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-[11px] sm:text-[12px] text-muted-foreground shrink-0">Concise</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.1}
              value={depth}
              onChange={(e) => setDepth(parseFloat(e.target.value))}
              className="flex-1 accent-primary h-2"
            />
            <span className="text-[11px] sm:text-[12px] text-muted-foreground shrink-0">Thorough</span>
          </div>
          <p className="mt-1 text-[10px] sm:text-[11px] text-muted-foreground text-center">
            {depth <= 0.3 ? 'Quick, concise outputs' : depth <= 0.7 ? 'Balanced depth' : 'Deep, thorough analysis'}
          </p>
        </div>

        <div>
          <p className="text-[13px] sm:text-sm font-medium text-foreground mb-2">Tools</p>
          <div className="space-y-1.5 sm:space-y-2">
            {availableTools.map((tool) => (
              <label
                key={tool.id}
                className="flex items-center gap-3 rounded-lg border border-border px-3 py-2.5 cursor-pointer transition-colors hover:bg-muted/30 min-h-[44px]"
              >
                <input
                  type="checkbox"
                  checked={enabledTools.includes(tool.id)}
                  onChange={() => toggleTool(tool.id)}
                  className="h-4 w-4 rounded border-border accent-primary shrink-0"
                />
                <span className="text-[12px] sm:text-[13px] text-foreground">{tool.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3 border-t border-border pt-4">
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={saving}
            className="rounded-lg bg-primary px-4 py-2.5 sm:py-2 text-[13px] font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50 min-h-[44px] sm:min-h-0"
          >
            {saving ? 'Saving...' : 'Save changes'}
          </button>
          <button
            type="button"
            onClick={() => void handleTestRun()}
            disabled={testing}
            className="rounded-lg border border-border bg-card px-4 py-2.5 sm:py-2 text-[13px] text-foreground transition-colors hover:bg-muted disabled:opacity-50 min-h-[44px] sm:min-h-0"
          >
            {testing ? 'Running test...' : 'Test run'}
          </button>
        </div>

        {testOutput && (
          <div className="rounded-lg border border-border bg-muted/30 p-3 sm:p-4">
            <p className="text-[11px] sm:text-[12px] font-medium text-foreground mb-2">Test Output</p>
            <pre className="whitespace-pre-wrap text-[11px] sm:text-[12px] text-muted-foreground font-mono leading-relaxed overflow-x-auto">
              {testOutput}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
