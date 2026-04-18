import { isNoraQuotaExemptEmail } from '@/config/noraQuota';

export type ChatRole = 'user' | 'assistant' | 'system';
export type ChatMessage = { role: ChatRole; content: string };

const EDGE_FN_BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/nora-claude`;

/** Thrown when server returns free_tier_exhausted but user is exempt (stale edge deploy). User should retry. */
export const CHAT_LIMIT_RESPONSE_UNEXPECTED = 'CHAT_LIMIT_RESPONSE_UNEXPECTED';

const FREE_MONTHLY_LIMIT = 3;

export class FreeTierExhaustedError extends Error {
  readonly code = 'free_tier_exhausted' as const;
  readonly queries_used: number;
  readonly limit: number;

  constructor(message: string, queries_used: number, limit: number) {
    super(message);
    this.name = 'FreeTierExhaustedError';
    this.queries_used = queries_used;
    this.limit = limit;
  }
}

/** @deprecated Use FreeTierExhaustedError */
export const DailyQueryLimitError = FreeTierExhaustedError;

export type ClaudeChatSuccess = {
  content: string;
  queries_used: number;
  limit: number;
  queries_remaining: number;
  paid?: boolean;
  tier?: string;
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

export type NoraChatKind = 'general' | 'agent_builder';

export async function sendClaudeChat(params: {
  messages: ChatMessage[];
  accessToken: string;
  /** When agent_builder, Nora runs the structured interview and can emit a deployable agent spec. */
  mode?: NoraChatKind;
  /** Signed-in email — exempt accounts must not be treated as free_tier_exhausted (client matches server allowlist). */
  userEmail?: string | null;
  /** App route summary for context-aware replies (edge function appends to system prompt). */
  clientContext?: string;
}): Promise<ClaudeChatSuccess> {
  const msgs = params.messages
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => ({ role: m.role, content: m.content }));

  const res = await fetch(`${EDGE_FN_BASE}/claude`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.accessToken}`,
    },
    body: JSON.stringify({
      messages: msgs,
      ...(params.mode === 'agent_builder' ? { mode: 'agent_builder' } : {}),
      ...(params.clientContext?.trim() ? { client_context: params.clientContext.trim().slice(0, 4000) } : {}),
    }),
  });

  const data = (await res.json().catch(() => ({}))) as {
    content?: string;
    error?: string;
    message?: string;
    queries_used?: number;
    limit?: number;
    queries_remaining?: number;
    paid?: boolean;
    tier?: string;
  };

  if (res.status === 401) {
    throw new Error('SESSION_EXPIRED');
  }

  if (res.status === 429) {
    if (data.error === 'free_tier_exhausted') {
      if (isNoraQuotaExemptEmail(params.userEmail)) {
        throw new Error(CHAT_LIMIT_RESPONSE_UNEXPECTED);
      }
      throw new FreeTierExhaustedError(
        data.message ??
          "You've used all free Ask Nora messages for this calendar month (UTC). Upgrade in Settings → Billing.",
        data.queries_used ?? FREE_MONTHLY_LIMIT,
        data.limit ?? FREE_MONTHLY_LIMIT,
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

  const limit = data.limit ?? FREE_MONTHLY_LIMIT;
  const used = data.queries_used ?? 0;

  return {
    content: String(content),
    queries_used: used,
    limit,
    queries_remaining: data.queries_remaining ?? Math.max(0, limit - used),
    paid: data.paid,
    tier: data.tier,
  };
}
