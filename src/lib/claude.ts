import type { ChatMessage } from '@/lib/ollama';

/** User asked for Claude in env (may still be unusable on static hosting without a proxy URL). */
export function isClaudeProvider(): boolean {
  return import.meta.env.VITE_AI_PROVIDER === 'claude';
}

/**
 * Use Claude for Ask Nora only when:
 * - local dev (Vite injects /api/claude from the dev server, key in .env.local), or
 * - production build with VITE_CLAUDE_API_BASE pointing at *your* HTTPS proxy that holds the key.
 *
 * GitHub Pages alone cannot do this — there is no server for secrets or /api.
 */
export function shouldUseClaudeChat(): boolean {
  if (import.meta.env.VITE_AI_PROVIDER !== 'claude') return false;
  if (import.meta.env.DEV) return true;
  return Boolean(String(import.meta.env.VITE_CLAUDE_API_BASE || '').trim());
}

function claudeApiBasePath(): string {
  if (import.meta.env.DEV) return '/api';
  const base = import.meta.env.VITE_CLAUDE_API_BASE;
  if (base && String(base).trim().length > 0) {
    return `${String(base).replace(/\/$/, '')}`;
  }
  return '/api';
}

export async function checkClaudeBackend(): Promise<boolean> {
  const url = `${claudeApiBasePath()}/claude/health`;
  try {
    const res = await fetch(url);
    if (!res.ok) return false;
    const data = (await res.json()) as { ok?: boolean };
    return Boolean(data.ok);
  } catch {
    return false;
  }
}

export async function sendClaudeChat(params: {
  systemPrompt: string;
  messages: ChatMessage[];
}): Promise<string> {
  const url = `${claudeApiBasePath()}/claude`;
  const msgs = params.messages.filter((m) => m.role === 'user' || m.role === 'assistant');

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system: params.systemPrompt,
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
