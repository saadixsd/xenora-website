export type ChatRole = 'user' | 'assistant' | 'system';
export type ChatMessage = { role: ChatRole; content: string };

// System prompt is now server-side only. This is kept for reference/typing but not sent.
export function buildNoraSystemPrompt(): string {
  return ''; // Server-side only — not sent from client
}

const EDGE_FN_BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/nora-claude`;

export async function checkClaudeBackend(): Promise<boolean> {
  try {
    const res = await fetch(`${EDGE_FN_BASE}/claude/health`);
    if (!res.ok) return false;
    const data = (await res.json()) as { ok?: boolean };
    return Boolean(data.ok);
  } catch {
    return false;
  }
}

export async function sendClaudeChat(params: {
  systemPrompt?: string;
  messages: ChatMessage[];
}): Promise<string> {
  const msgs = params.messages.filter((m) => m.role === 'user' || m.role === 'assistant');

  const res = await fetch(`${EDGE_FN_BASE}/claude`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      // System prompt is server-side — only send messages
      messages: msgs.map((m) => ({ role: m.role, content: m.content })),
    }),
  });

  const data = (await res.json().catch(() => ({}))) as { content?: string; error?: string };

  if (!res.ok) {
    throw new Error(data.error || res.statusText || 'Claude request failed');
  }

  const content = data.content;
  if (!content || !content.trim()) {
    throw new Error('Empty response from Claude');
  }

  return content;
}
