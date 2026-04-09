// @ts-nocheck
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Send, X, History } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import {
  checkClaudeBackend,
  sendClaudeChat,
  DailyQueryLimitError,
  CHAT_LIMIT_RESPONSE_UNEXPECTED,
  type ChatMessage,
  type NoraChatKind,
} from '@/lib/claude';
import { extractNoraAgentSpec, type NoraAgentSpec } from '@/lib/noraAgentSpec';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/config/routes';
import { isNoraQuotaExemptEmail } from '@/config/noraQuota';
import { NORA_CHAT_SESSIONS_CHANGED, type NoraChatSessionsChangedDetail } from '@/lib/noraChatSession';
import { ChatHistorySidebar } from './ChatHistorySidebar';

const DAILY_LIMIT = 3;
const MAX_STORE_CHARS = 30_000;

const SUGGESTIONS_GENERAL = [
  { label: 'Content Agent', text: 'How does the Content Agent work?' },
  { label: 'Lead handling', text: 'What does Nora do with my leads?' },
  { label: 'Research', text: 'How does the Research Agent use URLs and Reddit?' },
  { label: 'Workflows', text: 'How do I get the most out of Nora workflows?' },
];

const AGENT_BUILDER_START =
  "I want to design a custom agent for my workflow. Start the interview — ask your first specific question about my product and audience.";

export type NoraChatPanelVariant = 'page' | 'sheet';

interface NoraChatPanelProps {
  variant?: NoraChatPanelVariant;
  onClose?: () => void;
}

export function NoraChatPanel({ variant = 'page', onClose }: NoraChatPanelProps) {
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const [chatKind, setChatKind] = useState<NoraChatKind>(() =>
    searchParams.get('mode') === 'builder' ? 'agent_builder' : 'general',
  );
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [typingReply, setTypingReply] = useState(false);
  const [backendOk, setBackendOk] = useState<boolean | null>(null);
  const [lastError, setLastError] = useState('');
  const [queriesUsedToday, setQueriesUsedToday] = useState<number | null>(null);
  const [dailyLimitReached, setDailyLimitReached] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [deployedKeys, setDeployedKeys] = useState<Record<string, true>>({});
  const [deployingKey, setDeployingKey] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);

  const transcriptRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  /** Avoid double-loading when `?session=` updates `chatKind` and re-triggers the effect. */
  const loadedSessionFromUrlRef = useRef<string | null>(null);

  const token = session?.access_token;
  const quotaExempt = isNoraQuotaExemptEmail(user?.email);
  const remaining =
    quotaExempt
      ? null
      : queriesUsedToday === null
        ? null
        : Math.max(0, DAILY_LIMIT - queriesUsedToday);

  const loadQueryCount = useCallback(async () => {
    if (!user?.id) return;
    if (isNoraQuotaExemptEmail(user.email)) {
      setQueriesUsedToday(0);
      setDailyLimitReached(false);
      return;
    }
    const { data, error } = await supabase.rpc('get_daily_query_count' as any, { p_user_id: user.id });
    if (error) { console.error(error); return; }
    if (typeof data === 'number') {
      setQueriesUsedToday(data);
      if (data >= DAILY_LIMIT) setDailyLimitReached(true);
    }
  }, [user?.id, user?.email]);

  const loadSessionMessages = useCallback(async (sid: string) => {
    const { data: rows } = await supabase
      .from('nora_chat_messages' as any)
      .select('role, content')
      .eq('session_id', sid)
      .order('created_at', { ascending: true })
      .limit(120);

    const loaded: ChatMessage[] = (rows ?? [])
      .filter((r: any) => r.role === 'user' || r.role === 'assistant')
      .map((r: any) => ({ role: r.role as 'user' | 'assistant', content: r.content }));
    setMessages(loaded);
    setSessionId(sid);
  }, []);

  const loadThreadForKind = useCallback(
    async (kind: NoraChatKind) => {
      if (!user?.id) { setSessionId(null); setMessages([]); return; }
      const { data: sess } = await supabase
        .from('nora_chat_sessions' as any)
        .select('id')
        .eq('user_id', user.id)
        .eq('chat_kind', kind)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!sess?.id) { setSessionId(null); setMessages([]); return; }
      await loadSessionMessages(sess.id);
    },
    [user?.id, loadSessionMessages],
  );

  useEffect(() => {
    if (searchParams.get('mode') === 'builder') setChatKind('agent_builder');
  }, [searchParams]);

  useEffect(() => { void loadQueryCount(); }, [loadQueryCount]);

  useEffect(() => {
    const onSessionsChanged = (e: Event) => {
      const d = (e as CustomEvent<NoraChatSessionsChangedDetail>).detail;
      if (!d?.sessionId || d.sessionId !== sessionId) return;
      setSessionId(null);
      setMessages([]);
      setDeployedKeys({});
      loadedSessionFromUrlRef.current = null;
      if (searchParams.get('session') === d.sessionId) {
        const mode = searchParams.get('mode');
        const next = mode === 'builder' ? '?mode=builder' : '';
        navigate(`${ROUTES.dashboard.nora}${next}`, { replace: true });
      }
    };
    window.addEventListener(NORA_CHAT_SESSIONS_CHANGED, onSessionsChanged);
    return () => window.removeEventListener(NORA_CHAT_SESSIONS_CHANGED, onSessionsChanged);
  }, [sessionId, searchParams, navigate]);

  const sessionFromUrl = searchParams.get('session');
  useEffect(() => {
    if (!user?.id) return;
    if (sessionFromUrl) {
      if (loadedSessionFromUrlRef.current === sessionFromUrl) return;
      loadedSessionFromUrlRef.current = sessionFromUrl;
      void (async () => {
        const { data } = await supabase
          .from('nora_chat_sessions' as any)
          .select('chat_kind')
          .eq('id', sessionFromUrl)
          .eq('user_id', user.id)
          .maybeSingle();
        if (data?.chat_kind === 'general' || data?.chat_kind === 'agent_builder') {
          setChatKind(data.chat_kind);
          await loadSessionMessages(sessionFromUrl);
        }
      })();
      return;
    }
    loadedSessionFromUrlRef.current = null;
    void loadThreadForKind(chatKind);
  }, [user?.id, sessionFromUrl, chatKind, loadThreadForKind, loadSessionMessages]);

  const refreshConnection = useCallback(async () => {
    setBackendOk(null);
    const ok = await checkClaudeBackend(token);
    setBackendOk(ok);
    if (!ok && token) setLastError('Nora chat is unavailable. Check your connection or try again.');
    else setLastError('');
  }, [token]);

  useEffect(() => { void refreshConnection(); }, [refreshConnection]);

  useEffect(() => {
    const el = transcriptRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, sending, typingReply]);

  useEffect(() => {
    return () => { if (typingTimerRef.current !== null) window.clearInterval(typingTimerRef.current); };
  }, []);

  const touchSession = async (sid: string) => {
    await supabase.from('nora_chat_sessions' as any).update({ updated_at: new Date().toISOString() }).eq('id', sid);
  };

  const ensureSession = async (kind: NoraChatKind): Promise<string> => {
    if (!user?.id) throw new Error('Not signed in');
    if (sessionId) return sessionId;
    const { data, error } = await supabase
      .from('nora_chat_sessions' as any)
      .insert({ user_id: user.id, chat_kind: kind, title: kind === 'agent_builder' ? 'Agent builder' : 'Chat' })
      .select('id')
      .single();
    if (error || !data?.id) throw new Error(error?.message || 'Could not start chat session');
    setSessionId(data.id);
    return data.id;
  };

  const animateAssistantReply = (reply: string) =>
    new Promise<void>((resolve) => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduceMotion) { setMessages((prev) => [...prev, { role: 'assistant', content: reply }]); resolve(); return; }
      const charsPerTick = reply.length > 1400 ? 12 : reply.length > 700 ? 8 : 5;
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
      }, 14);
    });

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || sending || typingReply || (dailyLimitReached && !quotaExempt)) return;
    setSessionExpired(false);
    setLastError('');
    const t = session?.access_token;
    if (!t) { setSessionExpired(true); return; }

    const userMsg: ChatMessage = { role: 'user', content: trimmed };
    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setInput('');
    setSending(true);

    let sid: string | null = null;
    let insertedUserRowId: string | null = null;

    try {
      sid = await ensureSession(chatKind);
      const ins = await supabase
        .from('nora_chat_messages' as any)
        .insert({ session_id: sid, role: 'user', content: trimmed.slice(0, MAX_STORE_CHARS) })
        .select('id')
        .single();
      if (ins.data?.id) insertedUserRowId = ins.data.id;
      await touchSession(sid);

      const apiSlice = nextHistory.slice(-28);
      const result = await sendClaudeChat({
        messages: apiSlice,
        accessToken: t,
        mode: chatKind === 'agent_builder' ? 'agent_builder' : undefined,
        userEmail: user?.email ?? null,
      });
      if (!isNoraQuotaExemptEmail(user?.email)) {
        setQueriesUsedToday(result.queries_used);
        if (result.queries_remaining <= 0) setDailyLimitReached(true);
      }
      await animateAssistantReply(result.content);

      await supabase.from('nora_chat_messages' as any).insert({ session_id: sid, role: 'assistant', content: result.content.slice(0, MAX_STORE_CHARS) });
      await touchSession(sid);
      setBackendOk(true);
    } catch (e) {
      if (insertedUserRowId) await supabase.from('nora_chat_messages' as any).delete().eq('id', insertedUserRowId);
      if (e instanceof DailyQueryLimitError) {
        setDailyLimitReached(true);
        setQueriesUsedToday(e.queries_used);
        const limitMsg = "You've used all 3 of your queries for today. Come back tomorrow — your limit resets at midnight UTC. While you wait, browse what Nora can do on the dashboard.";
        setMessages((prev) => [...prev, { role: 'assistant', content: limitMsg }]);
        setBackendOk(true);
      } else if (e instanceof Error && e.message === CHAT_LIMIT_RESPONSE_UNEXPECTED) {
        setLastError('Nora could not complete that message. Please try again in a moment.');
        setBackendOk(false);
        if (typingTimerRef.current !== null) {
          window.clearInterval(typingTimerRef.current);
          typingTimerRef.current = null;
        }
        setTypingReply(false);
        setMessages((prev) => prev.slice(0, -1));
        setInput(trimmed);
      } else if (e instanceof Error && e.message === 'SESSION_EXPIRED') {
        setSessionExpired(true);
        setMessages((prev) => prev.slice(0, -1));
        setInput(trimmed);
      } else {
        const msg = e instanceof Error ? e.message : '';
        if (msg === 'RATE_LIMIT') setLastError("You've hit the rate limit. Please wait a moment and try again.");
        else setLastError('Nora is having trouble right now. Try again in a moment.');
        setBackendOk(false);
        if (typingTimerRef.current !== null) { window.clearInterval(typingTimerRef.current); typingTimerRef.current = null; }
        setTypingReply(false);
        setMessages((prev) => prev.slice(0, -1));
        setInput(trimmed);
      }
    } finally { setSending(false); }
  };

  const startNewThread = async () => {
    if (!user?.id) return;
    const { data, error } = await supabase
      .from('nora_chat_sessions' as any)
      .insert({ user_id: user.id, chat_kind: chatKind, title: chatKind === 'agent_builder' ? 'Agent builder' : 'Chat' })
      .select('id')
      .single();
    if (error || !data?.id) { toast({ title: 'Could not start chat', description: error?.message, variant: 'destructive' }); return; }
    setSessionId(data.id);
    setMessages([]);
    setDeployedKeys({});
    toast({ title: 'New conversation started' });
  };

  const deployAgent = async (spec: NoraAgentSpec, key: string) => {
    if (!user?.id) return;
    setDeployingKey(key);
    const { error } = await supabase.from('user_custom_agents' as any).insert({
      user_id: user.id, name: spec.name.slice(0, 120), mission: spec.mission.slice(0, 4000),
      target_user: spec.target_user.slice(0, 2000) || null, raw_inputs: spec.raw_inputs.slice(0, 4000) || null,
      output_deliverables: spec.output_deliverables.slice(0, 4000) || null, guardrails: spec.guardrails.slice(0, 4000) || null,
      interview_summary: spec.interview_summary.slice(0, 8000) || null, starter_prompt: spec.starter_prompt.slice(0, 4000) || null,
    });
    setDeployingKey(null);
    if (error) { toast({ title: 'Deploy failed', description: error.message, variant: 'destructive' }); return; }
    setDeployedKeys((p) => ({ ...p, [key]: true }));
    toast({ title: 'Agent deployed', description: `${spec.name} is saved. Open Manage agents to run it with the Content workflow.` });
  };

  const onSubmit = (e: React.FormEvent) => { e.preventDefault(); void send(input); };

  const chatActive = messages.length > 0;
  const inputDisabled = sending || typingReply || (dailyLimitReached && !quotaExempt) || sessionExpired;

  const outerClass = cn(
    'relative flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-background',
  );
  const maxHeightStyle = variant === 'page'
    ? { touchAction: 'manipulation' as const, maxHeight: 'calc(100dvh - 3.5rem)' }
    : { touchAction: 'manipulation' as const, maxHeight: '100%' };

  const kindToggle = (
    <div className="flex shrink-0 flex-wrap items-center gap-2">
      <div className="flex rounded-lg border border-border bg-muted/40 p-0.5">
        {(['general', 'agent_builder'] as const).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setChatKind(k)}
            className={cn(
              'rounded-md px-2.5 py-1.5 text-[11px] font-medium transition-colors sm:px-4 sm:text-xs',
              chatKind === k ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {k === 'general' ? 'Chat' : 'Agent'}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className={outerClass} style={maxHeightStyle}>
      {/* Chat History Sidebar */}
      <ChatHistorySidebar
        userId={user?.id}
        currentSessionId={sessionId}
        chatKind={chatKind}
        onSelectSession={(sid) => void loadSessionMessages(sid)}
        onNewChat={() => void startNewThread()}
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        embedded={variant === 'sheet'}
      />

      {variant === 'sheet' && (
        <div className="flex min-w-0 shrink-0 items-center justify-between gap-2 border-b border-border px-3 py-3 sm:px-4">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setHistoryOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Chat history"
            >
              <History className="h-4 w-4" />
            </button>
            <h2 className="truncate font-dm-serif text-base text-foreground sm:text-lg">Ask Nora</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {sessionExpired && (
        <div className="shrink-0 border-b border-border bg-card px-4 py-3 sm:px-6">
          <p className="text-sm text-foreground">Your session expired. Sign in again to continue.</p>
          <button
            type="button"
            onClick={() => navigate(ROUTES.login, { state: { message: 'Sign in to continue chatting with Nora.' } })}
            className="mt-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Sign in
          </button>
        </div>
      )}

      {!chatActive && (
        <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col items-center justify-center overflow-y-auto overflow-x-hidden px-3 pb-8 pt-4 sm:px-4">
          {variant === 'page' && (
            <>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setHistoryOpen(true)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label="Chat history"
                >
                  <History className="h-5 w-5" />
                </button>
                <h1 className="text-center font-dm-serif text-xl text-foreground sm:text-2xl">Ask Nora</h1>
              </div>
              {remaining !== null && (
                <p className="mt-1 text-center text-[11px] text-muted-foreground">
                  {remaining === 0
                    ? 'No queries remaining today — resets at midnight UTC'
                    : `${remaining} ${remaining === 1 ? 'query' : 'queries'} remaining today`}
                </p>
              )}
              <p className="mt-2 max-w-md text-center text-sm text-muted-foreground">
                {chatKind === 'agent_builder'
                  ? 'Nora will interview you with sharp, specific questions, then you can deploy a saved agent to your workspace.'
                  : 'Founder workflows, agents, and how Nora fits your stack. Your conversations are saved per mode.'}
              </p>
            </>
          )}
          {variant === 'sheet' && (
            <p className="mb-4 max-w-md text-center text-sm text-muted-foreground">
              {chatKind === 'agent_builder'
                ? 'Agent builder mode — saved threads resume when you return.'
                : 'Signed-in chat with history. Same daily limits as the full page.'}
            </p>
          )}

          {backendOk === false && lastError && (
            <p className="mt-3 max-w-xl text-center text-xs text-amber-600 dark:text-amber-500">{lastError}</p>
          )}

          <form onSubmit={onSubmit} className="mt-8 w-full min-w-0 max-w-xl">
            <div className="flex min-w-0 items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 focus-within:border-primary/30 sm:px-4">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  chatKind === 'agent_builder'
                    ? 'Or tap "Start agent interview" below…'
                    : 'Ask about workflows, agents, or getting started...'
                }
                autoComplete="off"
                autoCorrect="off"
                className="min-h-[44px] min-w-0 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
                disabled={inputDisabled}
              />
              <button
                type="submit"
                disabled={inputDisabled || !input.trim()}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-opacity disabled:opacity-30"
                aria-label="Send"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            {dailyLimitReached && (
              <p className="mt-1.5 text-center text-[11px] text-muted-foreground">Resets tomorrow (midnight UTC)</p>
            )}
          </form>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {chatKind === 'general' &&
              SUGGESTIONS_GENERAL.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => void send(s.text)}
                  disabled={inputDisabled}
                  className="min-h-[44px] rounded-full border border-border bg-muted/40 px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/25 hover:text-foreground disabled:opacity-40"
                >
                  {s.label}
                </button>
              ))}
            {chatKind === 'agent_builder' && (
              <button
                type="button"
                onClick={() => void send(AGENT_BUILDER_START)}
                disabled={inputDisabled}
                className="min-h-[44px] rounded-full border border-primary/40 bg-primary/10 px-3.5 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/15 disabled:opacity-40"
              >
                Start agent interview
              </button>
            )}
          </div>

          <div className="mt-6">{kindToggle}</div>
        </div>
      )}

      {chatActive && (
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <div className="flex min-w-0 shrink-0 flex-col gap-2 border-b border-border px-3 py-2 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex min-w-0 items-center gap-2">
              <button
                type="button"
                onClick={() => setHistoryOpen(true)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Chat history"
              >
                <History className="h-4 w-4" />
              </button>
              <span className="min-w-0 truncate text-[10px] text-muted-foreground">
                {remaining !== null && remaining > 0
                  ? `${remaining} ${remaining === 1 ? 'query' : 'queries'} left`
                  : remaining === 0 ? 'No queries left today' : ''}
              </span>
            </div>
            <div className="flex min-w-0 flex-wrap items-center justify-end gap-2 sm:gap-3">
              {kindToggle}
              <button
                type="button"
                onClick={() => void startNewThread()}
                className="shrink-0 text-[11px] font-medium text-primary hover:underline"
              >
                New chat
              </button>
            </div>
          </div>
          {lastError && (
            <div className="shrink-0 border-b border-destructive/20 bg-destructive/5 px-4 py-2 text-center text-xs text-destructive">
              {lastError}
            </div>
          )}

          <div
            ref={transcriptRef}
            className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-y-contain px-3 py-4 sm:px-6"
          >
            <div className="mx-auto min-w-0 max-w-2xl space-y-5">
              {messages.map((m, i) => {
                const spec = m.role === 'assistant' ? extractNoraAgentSpec(m.content) : null;
                const deployKey = `${i}-${spec?.name ?? ''}`;
                return (
                  <div key={`${i}-${m.role}`} className={cn('flex flex-col gap-1', m.role === 'user' ? 'items-end' : 'items-start')}>
                    <span className="px-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                      {m.role === 'user' ? 'You' : 'Nora'}
                    </span>
                    <div
                      className={cn(
                        'max-w-[min(88%,100%)] break-words rounded-2xl px-3 py-3 text-sm leading-relaxed sm:max-w-[80%] sm:px-4',
                        m.role === 'user' ? 'bg-primary/15 text-foreground' : 'bg-muted/80 text-foreground',
                      )}
                    >
                      {m.role === 'assistant' ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none break-words prose-p:my-1.5 prose-ul:my-1.5 prose-li:my-0.5 prose-strong:text-foreground prose-a:break-all prose-a:text-primary prose-headings:text-foreground">
                          <ReactMarkdown>{m.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <span className="break-words">{m.content}</span>
                      )}
                    </div>
                    {spec && chatKind === 'agent_builder' && (
                      <div className="max-w-[88%] pl-1 sm:max-w-[80%]">
                        {!deployedKeys[deployKey] ? (
                          <button
                            type="button"
                            disabled={deployingKey === deployKey}
                            onClick={() => void deployAgent(spec, deployKey)}
                            className="mt-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
                          >
                            {deployingKey === deployKey ? 'Deploying…' : `Deploy "${spec.name}"`}
                          </button>
                        ) : (
                          <p className="mt-1 text-[11px] text-primary">Deployed — see Manage agents</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {sending && !typingReply && (
                <div className="flex flex-col gap-1 items-start" aria-live="polite" aria-label="Nora is typing">
                  <span className="px-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Nora</span>
                  <div className="flex items-center gap-1.5 rounded-2xl bg-muted/80 px-4 py-3">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40 [animation-duration:0.55s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40 [animation-duration:0.55s] [animation-delay:0.12s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40 [animation-duration:0.55s] [animation-delay:0.24s]" />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="shrink-0 border-t border-border bg-background/95 px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] backdrop-blur-sm sm:px-6">
            <form onSubmit={onSubmit} className="mx-auto min-w-0 max-w-2xl">
              <div className="flex min-w-0 items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 focus-within:border-primary/30 sm:px-4">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Follow up..."
                  autoComplete="off"
                  autoCorrect="off"
                  className="min-h-[44px] min-w-0 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
                  disabled={inputDisabled}
                  aria-label="Message to Nora"
                />
                <button
                  type="submit"
                  disabled={inputDisabled || !input.trim()}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-opacity disabled:opacity-30"
                  aria-label="Send"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              {dailyLimitReached && (
                <p className="mt-1.5 text-center text-[11px] text-muted-foreground">Resets tomorrow (midnight UTC)</p>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
