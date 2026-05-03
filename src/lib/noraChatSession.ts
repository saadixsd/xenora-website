import { supabase } from '@/integrations/supabase/client';

/** Fired after a Nora chat session is deleted so History + sidebar stay in sync. */
export const NORA_CHAT_SESSIONS_CHANGED = 'xenora:nora-chat-sessions-changed';

export type NoraChatSessionsChangedDetail = { sessionId?: string };

export function dispatchNoraChatSessionsChanged(sessionId?: string) {
  if (typeof window !== 'undefined') {
    const detail: NoraChatSessionsChangedDetail = sessionId ? { sessionId } : {};
    window.dispatchEvent(new CustomEvent(NORA_CHAT_SESSIONS_CHANGED, { detail }));
  }
}

/** Deletes the session row; messages cascade-delete. RLS must allow DELETE on nora_chat_sessions. */
export async function deleteNoraChatSession(sessionId: string) {
  return (supabase.from('nora_chat_sessions' as any) as any).delete().eq('id', sessionId);
}
