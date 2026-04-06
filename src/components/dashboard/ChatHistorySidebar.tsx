import { useEffect, useState, useCallback } from 'react';
import { History, X, Plus, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

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
}

export function ChatHistorySidebar({
  userId,
  currentSessionId,
  chatKind,
  onSelectSession,
  onNewChat,
  open,
  onClose,
}: ChatHistorySidebarProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(false);

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
        sessionsWithPreviews.push({
          ...s,
          preview: msgs?.[0]?.content?.slice(0, 80) || null,
        });
      }
      setSessions(sessionsWithPreviews);
    }
    setLoading(false);
  }, [userId, chatKind]);

  useEffect(() => {
    if (open) void loadSessions();
  }, [open, loadSessions]);

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

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-[2px]"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-[65] flex w-[min(320px,85vw)] flex-col border-r border-border bg-card/95 backdrop-blur-xl shadow-2xl transition-transform duration-300 ease-in-out',
          'lg:left-64',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium text-foreground">Chat History</h3>
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

        {/* Session list */}
        <div className="flex-1 overflow-y-auto overscroll-y-contain p-2">
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
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  onSelectSession(s.id);
                  onClose();
                }}
                className={cn(
                  'flex w-full flex-col gap-0.5 rounded-lg px-3 py-2.5 text-left transition-colors',
                  s.id === currentSessionId
                    ? 'bg-primary/10 text-foreground'
                    : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                )}
              >
                <span className="truncate text-sm font-medium">
                  {s.preview || s.title || 'New chat'}
                </span>
                <span className="text-[10px] text-muted-foreground/70">
                  {formatDate(s.updated_at)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
