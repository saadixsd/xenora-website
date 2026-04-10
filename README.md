# XenoraAI — Nora

Marketing site and app shell for **XenoraAI**. **Nora** is the product: an agentic workflow engine for solo founders and small teams (content, lead workflows, and more) — visible steps, approve before publish or send.

## Tech stack
- React + TypeScript (Vite)
- Tailwind CSS + DaisyUI
- Framer Motion (page polish/animations)
- React Router (pages: Home, FAQ, Privacy, 404)
- Supabase (Try Nora signup stored in `public.waitlist`)

## Try Nora signup / Supabase
- The landing “Try Nora” form collects: `name`, `email`, `role`, and optional `biggest_pain`.
- Data is written to the Supabase table `public.waitlist` using the anon/public client.
- Row Level Security is enabled; insert access is allowed while reads are intentionally restricted for security.

## Local development
1. `npm install`
2. Create/update `.env` with:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
3. `npm run dev` (default [http://localhost:8080](http://localhost:8080))

**Ask Nora (`/dashboard/nora`, signed in)** calls the Supabase Edge Function `nora-claude` with the user’s JWT (the function validates `Authorization` in code; `verify_jwt` is off in `supabase/config.toml` so CORS preflight works—still require a valid session token). Deploy that function, set **`CLAUDE_API_KEY`** (or **`ANTHROPIC_API_KEY`**) in **Supabase Edge secrets** (never in `VITE_*`). Use a `.env` with the same project’s `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY` (anon key only). Local dev allows listed origins in the function’s CORS allowlist.

## Notes
- Page metadata (title/description/OG/Twitter) is in `index.html`.
- Supabase schema changes live in `supabase/migrations/`.