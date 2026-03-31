

## Plan: Secure the Claude Edge Function

### The Problem

The `nora-claude` edge function is publicly accessible (`verify_jwt = false`, CORS `*`) with your `CLAUDE_API_KEY` behind it. The existing rate limiter is in-memory and resets on every cold start — anyone can cycle through IPs or wait for resets to abuse your Anthropic quota.

### The Fix: Origin Lock + Shared Secret

Since this is a public-facing chat (no user auth), we can't require JWT auth. Instead we layer two defenses:

1. **Origin allowlist** — restrict CORS to your actual domains only
2. **Shared secret header** — the client sends a secret token the edge function validates, preventing raw `curl` abuse
3. **Tighten rate limits** — lower to 5 req/min/IP and add a global daily cap

### Changes

#### 1. Edge function (`supabase/functions/nora-claude/index.ts`)

- **CORS origin lock**: Replace `Access-Control-Allow-Origin: *` with a check against allowed origins (`xenoraai.com`, `xenora-ai-portal.lovable.app`, `localhost` for dev). Return 403 for unknown origins.
- **App secret validation**: Read a `NORA_APP_SECRET` from env. Require the client to send it as `x-app-token` header. Reject requests without a valid token (401).
- **Lower rate limit**: 5 req/min/IP instead of 10. Add a global counter capping total requests at 500/day across all IPs (resets on cold start, but provides a safety net).
- **System prompt lock**: Instead of accepting a `system` field from the client (which lets attackers inject arbitrary system prompts), hardcode the system prompt server-side or ignore the client-sent one entirely. This prevents prompt injection.

#### 2. Add the secret (`secrets` tool)

- Add `NORA_APP_SECRET` as a new Supabase secret (a random string).

#### 3. Client (`src/lib/claude.ts`)

- Send `x-app-token` header with the secret value. Since this is a client-side app, the secret will be in the JS bundle — it's not true auth, but it stops casual `curl` abuse. The real protection is the origin check + rate limit.
- Stop sending `system` in the request body (server handles it).

#### 4. System prompt server-side (`supabase/functions/nora-claude/index.ts`)

- Move the Nora system prompt into the edge function so clients can't override it. Keep `buildNoraSystemPrompt()` in `claude.ts` only as a reference/fallback.

### Files

| File | Change |
|------|--------|
| `supabase/functions/nora-claude/index.ts` | Origin allowlist, app secret check, server-side system prompt, lower rate limits, daily cap |
| `src/lib/claude.ts` | Add `x-app-token` header, remove `system` from request body |
| Secrets | Add `NORA_APP_SECRET` |

### What this does NOT solve

- The `x-app-token` is visible in the JS bundle — a determined attacker can extract it. But combined with origin checks and tight rate limits, it raises the bar significantly.
- For true protection, you'd need user authentication (login before chatting). That's a bigger change for later.

