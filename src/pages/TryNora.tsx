import { Link } from 'react-router-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { XenoraLogo } from '@/components/nora-landing/XenoraLogo';
import { SiteNav } from '@/components/nora-landing/SiteNav';
import { NeuralMeshBackground } from '@/components/nora-landing/NeuralMeshBackground';
import { checkClaudeBackend, sendClaudeChat, buildNoraSystemPrompt, type ChatMessage } from '@/lib/claude';
import { Send } from 'lucide-react';

const SUGGESTIONS = [
  { label: 'Taste matching', text: 'How does Nora learn my hiring taste from past hires?' },
  { label: 'Sourcing', text: 'How does Nora find candidates on LinkedIn without job posts?' },
  { label: 'Scheduling', text: 'Can Nora book interviews automatically via Calendly?' },
];

const TryNora = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [typingReply, setTypingReply] = useState(false);
  const [backendOk, setBackendOk] = useState<boolean | null>(null);
  const [lastError, setLastError] = useState('');
  const transcriptRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const refreshConnection = useCallback(async () => {
    setBackendOk(null);
    const ok = await checkClaudeBackend();
    setBackendOk(ok);
    if (!ok) setLastError('Nora is unavailable right now. Please try again later.');
    else setLastError('');
  }, []);

  useEffect(() => { void refreshConnection(); }, [refreshConnection]);

  useEffect(() => {
    const el = transcriptRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, sending, typingReply]);

  useEffect(() => {
    return () => {
      if (typingTimerRef.current !== null) {
        window.clearInterval(typingTimerRef.current);
      }
    };
  }, []);

  const animateAssistantReply = (reply: string) =>
    new Promise<void>((resolve) => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduceMotion) {
        setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
        resolve();
        return;
      }
      const charsPerTick = reply.length > 1400 ? 12 : reply.length > 700 ? 8 : 5;
      const tickMs = 14;
      let index = 0;
      setTypingReply(true);
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      typingTimerRef.current = window.setInterval(() => {
        index = Math.min(reply.length, index + charsPerTick);
        const partial = reply.slice(0, index);
        setMessages((prev) => {
          if (!prev.length) return prev;
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

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || sending || typingReply) return;

    setLastError('');
    const userMsg: ChatMessage = { role: 'user', content: trimmed };
    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setInput('');
    setSending(true);

    try {
      const system = buildNoraSystemPrompt();
      const reply = await sendClaudeChat({ systemPrompt: system, messages: nextHistory });
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
    <div className="fixed inset-0 flex w-full flex-col overflow-hidden bg-base-100 text-base-content" style={{ touchAction: 'manipulation', overscrollBehavior: 'none', height: '100dvh' }}>
      <NeuralMeshBackground />

      {/* Header */}
      <header className="fixed left-0 right-0 top-0 z-50 shrink-0 border-b border-base-content/[0.08] bg-base-100/95 backdrop-blur-sm pt-[env(safe-area-inset-top,0px)]">
        <div className="mx-auto flex min-h-[3.25rem] max-w-5xl items-center justify-between gap-2 px-4 py-2 sm:min-h-14 sm:px-6">
          <Link to="/" className="flex items-center gap-2 cursor-pointer" aria-label="XenoraAI home">
            <XenoraLogo decorative className="h-8 w-8 sm:h-10 sm:w-10" />
            <span className="text-sm font-semibold text-base-content sm:text-base">XenoraAI</span>
          </Link>
          <SiteNav />
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 flex min-h-0 w-full flex-1 flex-col pt-[calc(3.75rem+env(safe-area-inset-top,0px))] sm:pt-[calc(4.5rem+env(safe-area-inset-top,0px))]">

        {/* Empty state — centered */}
        {!chatActive && (
          <div className="flex flex-1 flex-col items-center justify-center px-4 pb-8">
            {/* Watermark logo */}
            <div className="pointer-events-none mb-6 opacity-[0.06]" aria-hidden>
              <XenoraLogo decorative className="h-32 w-32 sm:h-44 sm:w-44" />
            </div>

            <h1 className="text-2xl font-semibold text-base-content sm:text-3xl">Ask Nora</h1>
            <p className="mt-2 max-w-md text-center text-sm text-base-content/50">
              AI recruiter that clones your best hires. Ask about sourcing, screening, or scheduling.
            </p>

            {/* Status */}
            {backendOk === false && (
              <p className="mt-3 text-xs text-error">{lastError}</p>
            )}

            {/* Input */}
            <form onSubmit={onSubmit} className="mt-8 w-full max-w-xl">
              <div className="flex items-center gap-2 rounded-xl border border-base-content/10 bg-base-200/60 px-4 py-2 focus-within:border-primary/30 transition-colors">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about hiring automation..."
                  autoComplete="off"
                  autoCorrect="off"
                    className="min-h-[44px] flex-1 bg-transparent text-base text-base-content outline-none placeholder:text-base-content/30 sm:min-h-[40px]"
                    disabled={sending || backendOk === false}
                />
                <button
                  type="submit"
                  disabled={sending || !input.trim() || backendOk === false}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-content transition-opacity disabled:opacity-30"
                  aria-label="Send"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>

            {/* Suggestion chips */}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => void send(s.text)}
                  disabled={sending || backendOk === false}
                  className="rounded-full border border-base-content/10 bg-base-200/40 px-3.5 py-1.5 text-xs text-base-content/60 transition-colors hover:border-primary/25 hover:text-base-content/80 disabled:opacity-40"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat state */}
        {chatActive && (
          <div className="flex min-h-0 flex-1 flex-col">
            {/* Error bar */}
            {lastError && (
              <div className="shrink-0 border-b border-error/20 bg-error/5 px-4 py-2 text-center text-xs text-error">
                {lastError}
              </div>
            )}

            {/* Messages */}
            <div
              ref={transcriptRef}
              className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-y-contain px-4 py-4 [-webkit-overflow-scrolling:touch] sm:px-6"
            >
              <div className="mx-auto max-w-2xl space-y-5">
                {messages.map((m, i) => (
                  <div key={`${i}-${m.role}`} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[88%] sm:max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        m.role === 'user'
                          ? 'bg-primary/15 text-base-content'
                          : 'bg-base-200/70 text-base-content/90'
                      }`}
                    >
                      {m.role === 'assistant' ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1.5 prose-ul:my-1.5 prose-li:my-0.5 prose-strong:text-base-content prose-a:text-primary prose-headings:text-base-content">
                          <ReactMarkdown>{m.content}</ReactMarkdown>
                        </div>
                      ) : (
                        m.content
                      )}
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {sending && !typingReply && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-1.5 rounded-2xl bg-base-200/70 px-4 py-3">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-base-content/30" style={{ animationDelay: '0ms' }} />
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-base-content/30" style={{ animationDelay: '150ms' }} />
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-base-content/30" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom input */}
            <div className="shrink-0 border-t border-base-content/[0.06] bg-base-100/95 backdrop-blur-sm px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] sm:px-6">
              <form onSubmit={onSubmit} className="mx-auto max-w-2xl">
                <div className="flex items-center gap-2 rounded-xl border border-base-content/10 bg-base-200/50 px-4 py-2 focus-within:border-primary/30 transition-colors">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        void send(input);
                      }
                    }}
                    placeholder="Follow up..."
                    autoComplete="off"
                    autoCorrect="off"
                    className="min-h-[44px] flex-1 bg-transparent text-base text-base-content outline-none placeholder:text-base-content/30 sm:min-h-[40px]"
                    disabled={sending || typingReply}
                    aria-label="Message to Nora"
                  />
                  <button
                    type="submit"
                    disabled={sending || typingReply || !input.trim()}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-content transition-opacity disabled:opacity-30"
                    aria-label="Send"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default TryNora;
