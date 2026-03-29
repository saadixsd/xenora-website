import { Link } from 'react-router-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import { XenoraLogo } from '@/components/nora-landing/XenoraLogo';
import { SiteNav } from '@/components/nora-landing/SiteNav';
import { NeuralMeshBackground } from '@/components/nora-landing/NeuralMeshBackground';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { checkClaudeBackend, isClaudeProvider, sendClaudeChat, shouldUseClaudeChat } from '@/lib/claude';
import {
  buildNoraSystemPrompt,
  checkOllamaConnection,
  DEFAULT_OLLAMA_MODEL,
  sendOllamaChat,
  type ChatMessage,
} from '@/lib/ollama';

const useClaude = shouldUseClaudeChat();
const claudeRequestedButStaticHosting =
  isClaudeProvider() &&
  !import.meta.env.DEV &&
  !String(import.meta.env.VITE_CLAUDE_API_BASE || '').trim();

type WorkflowFocus = 'general' | 'IT' | 'HR' | 'Finance';

const EXAMPLE_PROMPTS: { label: string; focus: WorkflowFocus; text: string }[] = [
  {
    label: 'IT',
    focus: 'IT',
    text: 'Our team gets repeated VPN disconnect tickets for remote staff. Draft a triage checklist and first-response template.',
  },
  {
    label: 'HR',
    focus: 'HR',
    text: 'Create a concise phone-screen rubric for a mid-level accountant role (5 criteria + scoring).',
  },
  {
    label: 'Finance',
    focus: 'Finance',
    text: 'Outline a weekly cash position review checklist for a 25-person startup with one bookkeeper.',
  },
];

const TryNora = () => {
  const smoothTop = () => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  const [focus, setFocus] = useState<WorkflowFocus>('general');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [typingReply, setTypingReply] = useState(false);
  const [backendOk, setBackendOk] = useState<boolean | null>(null);
  const [lastError, setLastError] = useState('');
  const transcriptRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<number | null>(null);

  const refreshConnection = useCallback(async () => {
    setBackendOk(null);
    if (useClaude) {
      const ok = await checkClaudeBackend();
      setBackendOk(ok);
      if (!ok) {
        setLastError(
          import.meta.env.DEV
            ? 'Claude backend not ready. Add CLAUDE_API_KEY to .env.local, set VITE_AI_PROVIDER=claude, restart npm run dev. Never commit your API key.'
            : 'Claude is not reachable from this origin. On GitHub Pages there is no private server for your key. Run Ask Nora with Claude locally (npm run dev + .env.local), or host a small HTTPS proxy and set VITE_CLAUDE_API_BASE at build time.',
        );
      } else {
        setLastError('');
      }
      return;
    }

    const ok = await checkOllamaConnection();
    setBackendOk(ok);
    if (!ok) {
      setLastError(
        'Cannot reach Ollama. Start it with `ollama serve`, ensure `ollama pull llama3.2:3b`, and use `npm run dev` so the /ollama proxy works.',
      );
    } else {
      setLastError('');
    }
  }, []);

  useEffect(() => {
    void refreshConnection();
  }, [refreshConnection]);

  useEffect(() => {
    const el = transcriptRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, sending, typingReply]);

  useEffect(() => {
    return () => {
      if (typingTimerRef.current !== null) {
        window.clearInterval(typingTimerRef.current);
        typingTimerRef.current = null;
      }
    };
  }, []);

  const animateAssistantReply = (reply: string) =>
    new Promise<void>((resolve) => {
      const reduceMotion =
        typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduceMotion) {
        setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
        resolve();
        return;
      }

      const charsPerTick = reply.length > 1400 ? 9 : reply.length > 700 ? 6 : 4;
      const tickMs = 18;
      let index = 0;
      setTypingReply(true);

      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      typingTimerRef.current = window.setInterval(() => {
        index = Math.min(reply.length, index + charsPerTick);
        const partial = reply.slice(0, index);
        setMessages((prev) => {
          if (prev.length === 0) return prev;
          const last = prev[prev.length - 1];
          if (last.role !== 'assistant') return prev;
          return [...prev.slice(0, -1), { ...last, content: partial }];
        });

        if (index >= reply.length && typingTimerRef.current !== null) {
          window.clearInterval(typingTimerRef.current);
          typingTimerRef.current = null;
          setTypingReply(false);
          resolve();
        }
      }, tickMs);
    });

  const send = async (text: string, focusOverride?: WorkflowFocus) => {
    const trimmed = text.trim();
    if (!trimmed || sending || typingReply) return;

    const effectiveFocus = focusOverride ?? focus;
    if (focusOverride) setFocus(focusOverride);

    setLastError('');
    const userMsg: ChatMessage = { role: 'user', content: trimmed };
    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setInput('');
    setSending(true);

    try {
      const system = buildNoraSystemPrompt(effectiveFocus === 'general' ? undefined : effectiveFocus);
      const reply = useClaude
        ? await sendClaudeChat({ systemPrompt: system, messages: nextHistory })
        : await sendOllamaChat({
            model: DEFAULT_OLLAMA_MODEL,
            messages: nextHistory,
            systemPrompt: system,
          });
      await animateAssistantReply(reply);
      setBackendOk(true);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Something went wrong';
      setLastError(msg);
      setBackendOk(false);
      if (typingTimerRef.current !== null) {
        window.clearInterval(typingTimerRef.current);
        typingTimerRef.current = null;
      }
      setTypingReply(false);
      setMessages((prev) => prev.slice(0, -1));
      setInput(trimmed);
    } finally {
      setSending(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void send(input);
  };

  const chatActive = messages.length > 0;

  return (
    <div className="flex h-dvh max-h-dvh w-full flex-col overflow-hidden bg-base-100 text-base-content">
      <NeuralMeshBackground />

      {!chatActive && (
        <div className="pointer-events-none fixed inset-0 z-[1] flex items-center justify-center" aria-hidden>
          <XenoraLogo decorative className="h-[min(40vh,280px)] w-auto max-w-[82vw] opacity-[0.1] sm:h-[min(48vh,360px)]" />
        </div>
      )}

      <header className="fixed left-0 right-0 top-0 z-50 shrink-0 border-b border-base-content/[0.1] bg-base-100 pt-[env(safe-area-inset-top,0px)]">
        <div className="mx-auto flex min-h-[3.25rem] max-w-5xl items-center justify-between gap-2 px-[max(0.75rem,env(safe-area-inset-left,0px))] py-2 pr-[max(0.75rem,env(safe-area-inset-right,0px))] sm:min-h-16 sm:px-6">
          <Link to="/" onClick={smoothTop} className="flex items-center gap-2 sm:gap-2.5 cursor-pointer" aria-label="XenoraAI home">
            <XenoraLogo decorative className="h-10 w-10 sm:h-14 sm:w-14" />
            <span className="text-base font-semibold text-base-content sm:text-xl">XenoraAI</span>
          </Link>
          <SiteNav />
        </div>
      </header>

      <main
        className={`relative z-10 mx-auto flex min-h-0 w-full max-w-full flex-1 flex-col overflow-hidden px-[max(0.75rem,env(safe-area-inset-left,0px))] pb-[max(0.5rem,env(safe-area-inset-bottom,0px))] pr-[max(0.75rem,env(safe-area-inset-right,0px))] pt-[calc(3.75rem+env(safe-area-inset-top,0px))] sm:px-5 sm:pt-[calc(5.5rem+env(safe-area-inset-top,0px))] ${chatActive ? 'max-w-3xl xl:max-w-4xl 2xl:max-w-5xl' : 'max-w-6xl 2xl:max-w-7xl'}`}
      >
        {!chatActive && (
          <>
            <div
              className="pointer-events-none absolute -left-24 top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -right-12 top-56 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl"
              aria-hidden
            />
            <div className="mb-2 shrink-0 sm:mb-3">
              <p className="font-playfair text-[11px] font-medium uppercase tracking-[0.14em] text-base-content/45">Local demo</p>
              <h1 className="premium-heading mt-0.5 text-balance text-xl font-semibold sm:mt-1 sm:text-2xl">Ask Nora</h1>
              <p className="mt-0.5 line-clamp-2 text-[11px] text-base-content/55 sm:mt-1 sm:text-sm sm:line-clamp-none">
                {useClaude
                  ? 'Powered by Claude (Anthropic). Your API key stays on the dev server only, not in the browser bundle. Nothing is sent to Xenora servers.'
                  : 'General chat powered by your machine. Nothing is saved or sent to Xenora servers.'}
              </p>
              <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px]">
                <span
                  className={`rounded-full border px-2 py-0.5 ${
                    backendOk === null
                      ? 'border-base-content/15 text-base-content/50'
                      : backendOk
                        ? 'border-primary/40 text-primary'
                        : 'border-error/40 text-error'
                  }`}
                >
                  {useClaude
                    ? backendOk === null
                      ? 'Checking Claude…'
                      : backendOk
                        ? 'Claude ready'
                        : 'Claude unavailable'
                    : backendOk === null
                      ? 'Checking Ollama…'
                      : backendOk
                        ? 'Ollama reachable'
                        : 'Ollama offline'}
                </span>
                <Button type="button" variant="outline" size="sm" className="h-7 text-[11px]" onClick={() => void refreshConnection()}>
                  Retry connection
                </Button>
              </div>
            </div>

            {claudeRequestedButStaticHosting && (
              <div className="mb-2 shrink-0 rounded-lg border border-warning/30 bg-warning/5 px-3 py-2 text-[11px] text-base-content/80 sm:text-xs">
                This site is static (e.g. GitHub Pages): it cannot run Claude with a secret API key. Use{' '}
                <strong>npm run dev</strong> and <strong>.env.local</strong> for Claude, or leave{' '}
                <strong>VITE_AI_PROVIDER=ollama</strong> for the public build. GitHub Actions secrets are not
                available in the browser.
              </div>
            )}
            {lastError && (
              <div className="mb-2 shrink-0 rounded-lg border border-error/30 bg-error/5 px-3 py-2 text-[11px] text-base-content/80 sm:text-xs">
                {lastError}
              </div>
            )}
          </>
        )}

        {chatActive && lastError && (
          <div className="mb-1 shrink-0 rounded-md border border-error/25 bg-error/5 px-2 py-1.5 text-[11px] text-error">
            {lastError}
          </div>
        )}

        <div
          className={
            chatActive
              ? 'flex min-h-0 flex-1 flex-col'
              : 'grid min-h-0 flex-1 grid-cols-1 grid-rows-[auto_minmax(0,1fr)] gap-2 sm:gap-3 lg:grid-cols-[220px_minmax(0,1fr)] lg:grid-rows-1 lg:gap-4'
          }
        >
          {!chatActive && (
            <aside className="max-h-[min(26vh,200px)] shrink-0 overflow-y-auto rounded-xl border border-base-content/[0.14] bg-base-200/90 p-2.5 shadow-[0_8px_22px_rgba(0,0,0,0.18)] sm:max-h-none sm:p-3 lg:max-h-none lg:min-h-0 lg:overflow-y-auto">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-base-content/45">Session mode</p>
              <div className="mt-2 grid grid-cols-2 gap-1.5 lg:grid-cols-1">
                {(['general', 'IT', 'HR', 'Finance'] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFocus(f)}
                    className={`min-h-[44px] rounded-md border px-2 py-2 text-left text-[11px] font-medium transition-colors md:min-h-0 md:py-1.5 ${
                      focus === f
                        ? 'border-primary/60 bg-primary/15 text-base-content'
                        : 'border-base-content/12 bg-base-300/40 text-base-content/70 hover:border-base-content/25'
                    }`}
                  >
                    {f === 'general' ? 'General workflow' : `${f} workflow`}
                  </button>
                ))}
              </div>
              <div className="mt-2 rounded-md border border-base-content/12 bg-base-300/35 px-2 py-1.5 text-[10px] text-base-content/60 sm:mt-2.5">
                Nora uses NORACore: <strong>Observe</strong>, <strong>Adapt</strong>, <strong>Execute</strong>, plus a short <strong>Results</strong> line. IT, HR, or Finance only.
              </div>
            </aside>
          )}

          <section
            className={
              chatActive
                ? 'flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-base-content/[0.12] bg-base-200/90'
                : 'flex min-h-0 flex-col overflow-hidden rounded-xl border border-base-content/[0.14] bg-base-200/85 shadow-[0_12px_30px_rgba(0,0,0,0.22)]'
            }
          >
            {!chatActive && (
              <div className="shrink-0 border-b border-base-content/[0.1] bg-base-300/45 px-3 py-2 sm:px-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-base-content/45">Quick starts</p>
                  <div className="h-1 w-20 rounded-full bg-gradient-to-r from-primary/20 via-primary/65 to-violet-400/55" />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {EXAMPLE_PROMPTS.map((ex) => (
                    <button
                      key={ex.label}
                      type="button"
                      className="min-h-[40px] rounded-md border border-base-content/15 bg-base-100/90 px-2.5 py-2 text-[10px] text-base-content/70 hover:border-primary/35 sm:min-h-0 sm:py-1"
                      onClick={() => void send(ex.text, ex.focus)}
                      disabled={sending || typingReply}
                    >
                      Example: {ex.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div
              ref={transcriptRef}
              className="min-h-0 flex-1 space-y-3 overflow-y-auto overflow-x-hidden overscroll-y-contain bg-base-100/50 px-3 py-2 [-webkit-overflow-scrolling:touch] sm:px-4 sm:py-3"
            >
            {messages.length === 0 && (
              <p className="rounded-lg border border-dashed border-base-content/15 bg-base-100/80 px-3 py-4 text-center text-xs text-base-content/50 sm:text-sm">
                Ask about IT, HR, or Finance automation. Replies use the NORACore format and end with a waitlist link.
              </p>
            )}
            {messages.map((m, i) => (
              <div
                key={`${i}-${m.role}`}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[min(92%,42rem)] break-words rounded-xl px-3 py-2 text-xs leading-relaxed sm:max-w-[85%] sm:text-sm ${
                    m.role === 'user'
                      ? 'border border-primary/35 bg-primary/20 text-base-content'
                      : 'border border-base-content/12 bg-base-200 text-base-content/90'
                  }`}
                >
                  {m.role === 'assistant' ? (
                    <div className="whitespace-pre-wrap break-words font-sans text-xs leading-relaxed text-base-content/90 sm:text-sm">{m.content}</div>
                  ) : (
                    m.content
                  )}
                </div>
              </div>
            ))}
            {(sending || typingReply) && (
              <div className="flex justify-start">
                <div className="rounded-xl border border-base-content/15 bg-base-200 px-3 py-2 text-xs text-base-content/60">
                  <span className="loading loading-spinner loading-sm align-middle" /> Thinking…
                </div>
              </div>
            )}
            </div>

            <form
              onSubmit={onSubmit}
              className="shrink-0 border-t border-base-content/[0.1] bg-base-300/35 px-2 py-2 sm:px-3"
            >
              <div className="flex items-stretch gap-2 sm:items-center">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      void send(input);
                    }
                  }}
                  placeholder="Message Nora…"
                  inputMode="text"
                  enterKeyHint="send"
                  autoComplete="off"
                  autoCorrect="off"
                  className="min-h-11 flex-1 border-base-content/15 bg-base-100 text-base text-base-content placeholder:text-base-content/40 focus-visible:ring-primary/30 sm:h-9 sm:min-h-0 sm:text-sm"
                  disabled={sending || typingReply}
                  aria-label="Message to Nora"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="min-h-11 min-w-[4.5rem] shrink-0 self-center px-4 sm:h-9 sm:min-h-0"
                  disabled={sending || typingReply || !input.trim()}
                >
                  {sending || typingReply ? 'Sending…' : 'Send'}
                </Button>
              </div>
            </form>
          </section>
        </div>

        {!chatActive && (
          <p className="mt-1.5 shrink-0 pb-0.5 text-center text-[11px] text-base-content/40">
            <Link to="/" className="underline-offset-2 hover:underline">
              Back to home
            </Link>
          </p>
        )}
      </main>
    </div>
  );
};

export default TryNora;
