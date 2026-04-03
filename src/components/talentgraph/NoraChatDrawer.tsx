import { useCallback, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { X, Send } from 'lucide-react';
import { sendClaudeChat, type ChatMessage } from '@/lib/claude';
import { cn } from '@/lib/utils';
import type { TasteProfile, ScoredCandidate } from '@/lib/talentgraph/talentgraph';

interface NoraChatDrawerProps {
  open: boolean;
  onClose: () => void;
  taste: TasteProfile | null;
  results: ScoredCandidate[];
  initialMessage?: string;
}

function buildContext(taste: TasteProfile | null, results: ScoredCandidate[]): string {
  if (!taste && !results.length) return '';
  const parts: string[] = ['[TalentGraph context]'];
  if (taste) {
    parts.push(`Taste profile: languages=${(taste.primaryLanguages || []).join(', ')}, signals=${(taste.signals || []).join(', ')}, query="${taste.searchQuery || ''}"`);
  }
  if (results.length) {
    parts.push('Top candidates:');
    results.slice(0, 5).forEach((c) => {
      parts.push(`- @${c.user.login} (score ${c.score ?? '?'}): ${c.user.bio || 'no bio'}`);
    });
  }
  return parts.join('\n');
}

export function NoraChatDrawer({ open, onClose, taste, results, initialMessage }: NoraChatDrawerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const didSendInitial = useRef(false);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || sending) return;

      const context = buildContext(taste, results);
      const userContent = context ? `${context}\n\nUser question: ${trimmed}` : trimmed;
      const userMsg: ChatMessage = { role: 'user', content: userContent };
      const displayMsg: ChatMessage = { role: 'user', content: trimmed };

      const nextHistory = [...messages, userMsg];
      setMessages((prev) => [...prev, displayMsg]);
      setInput('');
      setSending(true);

      try {
        const reply = await sendClaudeChat({ messages: nextHistory });
        setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
      } catch (e) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: `⚠️ ${e instanceof Error ? e.message : 'Something went wrong'}` },
        ]);
      } finally {
        setSending(false);
      }
    },
    [messages, taste, results, sending],
  );

  // Auto-send initial message when opened with one
  useEffect(() => {
    if (open && initialMessage && !didSendInitial.current) {
      didSendInitial.current = true;
      void sendMessage(initialMessage);
    }
    if (!open) didSendInitial.current = false;
  }, [open, initialMessage, sendMessage]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, sending]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void sendMessage(input);
  };

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-[60] bg-background/60 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          'fixed right-0 top-0 z-[70] flex h-full w-full flex-col border-l border-border bg-background shadow-2xl transition-transform duration-300 max-w-full sm:max-w-[420px]',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-sm font-semibold text-foreground">Ask Nora</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="min-h-0 flex-1 overflow-y-auto px-4 py-4 space-y-4"
        >
          {messages.length === 0 && !sending && (
            <p className="text-center text-xs text-muted-foreground pt-8">
              Ask Nora about any candidate or your taste profile.
            </p>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}
            >
              <div
                className={cn(
                  'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
                  m.role === 'user'
                    ? 'bg-primary/15 text-foreground'
                    : 'bg-muted text-foreground/90',
                )}
              >
                {m.role === 'assistant' ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0.5 prose-strong:text-foreground prose-a:text-primary prose-headings:text-foreground">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                ) : (
                  m.content
                )}
              </div>
            </div>
          ))}

          {sending && (
            <div className="flex justify-start">
              <div className="flex items-center gap-1.5 rounded-2xl bg-muted px-4 py-3">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground/40" />
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground/40" style={{ animationDelay: '150ms' }} />
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground/40" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-border px-4 py-3">
          <form onSubmit={onSubmit} className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-3 py-2 focus-within:border-primary/30 transition-colors">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about a candidate..."
              autoComplete="off"
              className="min-h-[40px] flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/50"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-opacity disabled:opacity-30"
              aria-label="Send"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
