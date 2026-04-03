# XenoraAI — Nora (Knowledge-First Agentic AI)

This repo contains the XenoraAI marketing site for **Nora**, an agentic AI engine designed to automate business operations across IT, HR, and Finance.

## Tech stack
- React + TypeScript (Vite)
- Tailwind CSS + DaisyUI
- Framer Motion (page polish/animations)
- React Router (pages: Home, FAQ, Privacy, 404)
- Supabase (waitlist storage)

## Waitlist / Supabase
- The waitlist form collects: `name`, `email`, `role`, and `company_size`.
- Data is written to the Supabase table `public.waitlist` using the anon/public client.
- Row Level Security is enabled; insert access is allowed while reads are intentionally restricted for security.

## Local development
1. `npm install`
2. Create/update `.env` with:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
3. `npm run dev` (default [http://localhost:8080](http://localhost:8080))

**Ask Nora (`/try-nora`)** calls the Supabase Edge Function `nora-claude`. For chat to work: deploy that function, set **`CLAUDE_API_KEY`** (or **`ANTHROPIC_API_KEY`**) under **Project Settings → Edge Functions → Secrets**, and use a `.env` with the same project’s `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY`. Local dev uses any `http://localhost:*` origin (CORS).

## Notes
- Page metadata (title/description/OG/Twitter) is in `index.html`.
- Supabase schema changes live in `supabase/migrations/`.