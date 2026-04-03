export type ChatRole = 'user' | 'assistant' | 'system';
export type ChatMessage = { role: ChatRole; content: string };

export function buildNoraSystemPrompt(): string {
  return '';
}

const EDGE_FN_BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/nora-claude`;

const DAILY_LIMIT = 3;

export class DailyQueryLimitError extends Error {
  readonly code = 'daily_limit_reached' as const;
  readonly queries_used: number;
  readonly limit: number;

  constructor(message: string, queries_used: number, limit: number) {
    super(message);
    this.name = 'DailyQueryLimitError';
    this.queries_used = queries_used;
    this.limit = limit;
  }
}

export type ClaudeChatSuccess = {
  content: string;
  queries_used: number;
  limit: number;
  queries_remaining: number;
};

/** Health check requires a valid user JWT when the edge function has verify_jwt enabled. */
export async function checkClaudeBackend(accessToken: string | undefined): Promise<boolean> {
  if (!accessToken) return false;
  try {
    const res = await fetch(`${EDGE_FN_BASE}/claude/health`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { ok?: boolean };
    return Boolean(data.ok);
  } catch {
    return false;
  }
}

export async function sendClaudeChat(params: {
  messages: ChatMessage[];
  accessToken: string;
}): Promise<ClaudeChatSuccess> {
  const msgs = params.messages.filter((m) => m.role === 'user' || m.role === 'assistant');

  const res = await fetch(`${EDGE_FN_BASE}/claude`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.accessToken}`,
    },
    body: JSON.stringify({
      messages: msgs.map((m) => ({ role: m.role, content: m.content })),
    }),
  });

  const data = (await res.json().catch(() => ({}))) as {
    content?: string;
    error?: string;
    message?: string;
    queries_used?: number;
    limit?: number;
    queries_remaining?: number;
  };

  if (res.status === 401) {
    throw new Error('SESSION_EXPIRED');
  }

  if (res.status === 429) {
    if (data.error === 'daily_limit_reached') {
      throw new DailyQueryLimitError(
        data.message ??
          "You've used all 3 of your daily Nora queries. Your limit resets at midnight UTC.",
        data.queries_used ?? DAILY_LIMIT,
        data.limit ?? DAILY_LIMIT,
      );
    }
    throw new Error('RATE_LIMIT');
  }

  if (!res.ok) {
    throw new Error(data.error || data.message || res.statusText || 'Claude request failed');
  }

  const content = data.content;
  if (!content || !String(content).trim()) {
    throw new Error('Empty response from Claude');
  }

  return {
    content: String(content),
    queries_used: data.queries_used ?? 0,
    limit: data.limit ?? DAILY_LIMIT,
    queries_remaining: data.queries_remaining ?? Math.max(0, DAILY_LIMIT - (data.queries_used ?? 0)),
  };
}
