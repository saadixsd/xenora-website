import { useEffect, useState, useCallback, useRef } from 'react';
import { History, X, Plus, MessageSquare, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import {
  NORA_CHAT_SESSIONS_CHANGED,
  deleteNoraChatSession,
  dispatchNoraChatSessionsChanged,
} from '@/lib/noraChatSession';

interface ChatSession {
  id: string;
  title: string | null;
  chat_kind: string;
  updated_at: string;
  created_at: string;
  preview?: string;
}

interface ChatHistorySidebarProps {
  userId: string | undefined;
  currentSessionId: string | null;
  chatKind: string;
  onSelectSession: (sessionId: string) => void;
  onNewChat: () => void;
  open: boolean;
  onClose: () => void;
  /**
   * When true, overlay + panel are `absolute` inside the Ask Nora sheet (relative parent).
   * When false, use full-viewport `fixed` positioning and offset past the dashboard sidebar on lg.
   */
  embedded?: boolean;
}

export function ChatHistorySidebar({
  userId,
  currentSessionId,
  chatKind,
  onSelectSession,
  onNewChat,
  open,
  onClose,
  embedded = false,
}: ChatHistorySidebarProps) {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadSessions = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const { data } = await supabase
      .from('nora_chat_sessions' as any)
      .select('id, title, chat_kind, updated_at, created_at')
      .eq('user_id', userId)
      .eq('chat_kind', chatKind)
      .order('updated_at', { ascending: false })
      .limit(50);

    if (data) {
      // Load first message preview for each session
      const sessionsWithPreviews: ChatSession[] = [];
      for (const s of data as any[]) {
        const { data: msgs } = await supabase
          .from('nora_chat_messages' as any)
          .select('content')
          .eq('session_id', s.id)
          .eq('role', 'user')
          .order('created_at', { ascending: true })
          .limit(1);
        const firstMsg = (msgs as any)?.[0]?.content?.slice(0, 80) || null;
        sessionsWithPreviews.push({
          ...s,
          preview: firstMsg,
        });
      }
      setSessions(sessionsWithPreviews);
    }
    setLoading(false);
  }, [userId, chatKind]);

  const openRef = useRef(open);
  openRef.current = open;
  const loadSessionsRef = useRef(loadSessions);
  loadSessionsRef.current = loadSessions;

  useEffect(() => {
    if (open) void loadSessions();
  }, [open, loadSessions]);

  useEffect(() => {
    const onChanged = () => {
      if (openRef.current) void loadSessionsRef.current();
    };
    window.addEventListener(NORA_CHAT_SESSIONS_CHANGED, onChanged);
    return () => window.removeEventListener(NORA_CHAT_SESSIONS_CHANGED, onChanged);
  }, []);

  const handleDeleteSession = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    if (!window.confirm('Delete this conversation permanently? This cannot be undone.')) return;
    setDeletingId(sessionId);
    try {
      const { error } = await deleteNoraChatSession(sessionId);
      if (error) {
        toast({ title: 'Could not delete', description: error.message, variant: 'destructive' });
        return;
      }
      dispatchNoraChatSessionsChanged(sessionId);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    } catch (err) {
      console.error(err);
      toast({
        title: 'Could not delete',
        description: err instanceof Error ? err.message : 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const backdropClass = 'absolute inset-0 z-[5] bg-black/40 backdrop-blur-[2px]';

  const panelClass = cn(
    'flex flex-col border-r border-border bg-card/95 backdrop-blur-xl shadow-2xl transition-transform duration-300 ease-in-out',
    'absolute inset-y-0 left-0 z-[10] h-full w-[min(280px,calc(100%-1.5rem))] max-w-[min(320px,88%)]',
    open ? 'translate-x-0' : '-translate-x-full pointer-events-none',
  );

  return (
    <>
      {open && (
        <div
          className={backdropClass}
          onClick={onClose}
          aria-hidden
        />
      )}

      <div className={panelClass} role="dialog" aria-modal={open} aria-label="Chat history">
        <div className="flex min-w-0 shrink-0 items-center justify-between gap-2 border-b border-border px-3 py-3 sm:px-4">
          <div className="flex min-w-0 items-center gap-2">
            <History className="h-4 w-4 shrink-0 text-muted-foreground" />
            <h3 className="truncate text-sm font-medium text-foreground">Chat History</h3>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => { onNewChat(); onClose(); }}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="New chat"
            >
              <Plus className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Close history"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain p-2">
          {loading && sessions.length === 0 && (
            <div className="flex items-center justify-center py-12">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-primary" />
            </div>
          )}

          {!loading && sessions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MessageSquare className="mb-2 h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">No conversations yet</p>
              <p className="mt-1 text-xs text-muted-foreground/60">Start chatting with Nora</p>
            </div>
          )}

          <div className="space-y-1">
            {sessions.map((s) => (
              <div
                key={s.id}
                className={cn(
                  'group flex w-full items-stretch gap-0.5 rounded-lg transition-colors',
                  s.id === currentSessionId ? 'bg-primary/10' : 'hover:bg-muted/60',
                )}
              >
                <button
                  type="button"
                  onClick={() => {
                    onSelectSession(s.id);
                    onClose();
                  }}
                  className={cn(
                    'flex min-w-0 flex-1 flex-col gap-0.5 rounded-lg px-3 py-2.5 text-left transition-colors',
                    s.id === currentSessionId
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  <span className="truncate text-sm font-medium">
                    {s.preview || s.title || 'New chat'}
                  </span>
                  <span className="text-[10px] text-muted-foreground/70">
                    {formatDate(s.updated_at)}
                  </span>
                </button>
                <button
                  type="button"
                  title="Delete conversation"
                  disabled={deletingId === s.id}
                  onClick={(e) => void handleDeleteSession(e, s.id)}
                  className="flex shrink-0 items-center justify-center rounded-lg px-2 text-muted-foreground opacity-70 transition-colors hover:bg-destructive/15 hover:text-destructive group-hover:opacity-100 disabled:opacity-40"
                  aria-label="Delete conversation"
                >
                  {deletingId === s.id ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-primary" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
