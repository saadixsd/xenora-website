

## Plan: Fix Build Error + Power "Ask Nora" with Claude via Lovable Cloud

### Problem
1. **Build error**: Line 177 in `Index.tsx` has `<Reveal delay={0.05}>` with no children — needs content or removal.
2. **Claude API key storage**: You have a Claude API key and want Ask Nora to work on the deployed site.

### Solution

**Step 1: Fix build error**
- Remove the empty `<Reveal delay={0.05}></Reveal>` on lines 177-178 of `src/pages/Index.tsx`.

**Step 2: Store Claude API key securely**
- Your project already has a backend function at `supabase/functions/nora-claude/index.ts` that proxies Claude API calls. This is exactly what you need.
- Store your Claude API key as a backend secret using Lovable's secret management (the key will be available to the backend function as `CLAUDE_API_KEY`).
- No code changes needed in the edge function — it already reads `CLAUDE_API_KEY` from the environment.

**Step 3: Update `TryNora.tsx` to call the backend function**
- Replace the current Claude/Ollama switching logic with a single path that calls the `nora-claude` backend function via `supabase.functions.invoke()` or direct fetch to `${VITE_SUPABASE_URL}/functions/v1/nora-claude/claude`.
- Remove the Ollama fallback and local-dev-only Claude logic — everything goes through the backend function.
- Remove the `vite/plugin-claude-api.ts` dev plugin and its reference in `vite.config.ts` (no longer needed).

**Step 4: Simplify `src/lib/claude.ts`**
- Update `claudeApiBasePath()` to always point to the backend function URL: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/nora-claude`.
- Remove the dev-server-only logic and `VITE_CLAUDE_API_BASE` complexity.

### Files to modify
- `src/pages/Index.tsx` — remove empty Reveal
- `src/lib/claude.ts` — simplify to always use backend function
- `src/pages/TryNora.tsx` — simplify provider logic
- `vite.config.ts` — remove claude plugin import
- `vite/plugin-claude-api.ts` — delete (optional cleanup)

### Secret to add
- `CLAUDE_API_KEY` — your Anthropic API key, stored securely as a backend secret

