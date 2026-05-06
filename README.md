# XenoraAI / Nora

Marketing site and operator dashboard for **XenoraAI**. **Nora** is the product — an agentic
workflow engine that observes how a business operates, adapts to the operator's tools, and
autonomously executes repetitive workflows (content, leads, research) with reviewable runs.

> For the architectural map (folders, routing, edge functions, RLS, secrets), see
> [`ARCHITECTURE.md`](./ARCHITECTURE.md).

## Stack

- **Frontend** — React 18 + TypeScript, Vite, Tailwind + shadcn/ui, Framer Motion, React Router.
- **Backend** — Supabase (Postgres + RLS, Auth, Edge Functions) provisioned via Lovable Cloud.
- **AI** — Anthropic Claude for chat (`nora-claude`); Lovable AI gateway for workflow generation
  (`nora-workflow`); ElevenLabs for voice (`nora-tts`).
- **Billing** — Stripe Checkout + Billing Portal + webhook → `billing_subscriptions`.

## Surfaces

| Route group | Brand | Notes |
|---|---|---|
| `/`, `/about`, `/faq`, `/privacy` | XenoraAI (public) | Static marketing |
| `/login`, `/signup`, `/auth/callback` | — | Email/password + Google OAuth |
| `/dashboard/*` | Nora (authed) | Quick run, agents, history, settings, connections |

Path constants live in `src/config/routes.ts` — import `ROUTES` instead of hardcoding strings.

## Local development

```bash
npm install
npm run dev      # http://localhost:8080
```

`.env` is auto-managed by Lovable Cloud and only contains the Supabase URL + anon key.
All private keys (Claude, Stripe, ElevenLabs, NORA_APP_SECRET, …) live exclusively in
Supabase Edge secrets — see [`ARCHITECTURE.md` §7](./ARCHITECTURE.md#7-secrets).

## Edge functions

Deployed automatically on push. Every function authenticates the caller in code via
`getUser(authHeader)`; `verify_jwt = false` in `supabase/config.toml` is intentional so the
CORS preflight passes (browsers do not attach Authorization to OPTIONS). Public webhooks
(`stripe-webhook`, `submit-lead`, `oauth-callback`) skip JWT and authenticate by signature.

## Database

All user-owned tables enforce `auth.uid() = user_id` via RLS. Admin tables (`leads`,
`lead_notes`, `lead_activities`) use `has_role(auth.uid(), 'admin')`. Roles live in
`public.user_roles` — never on `profiles`. Schema changes go through `supabase/migrations/`.

## Conventions

- Tailwind semantic tokens only — no hardcoded colors.
- Geist font everywhere; accent green used sparingly.
- No competitor names, no location/founder mentions.
- Lazy-load every page in `App.tsx` to keep landing TTI fast.
- Workflow status uses 3-second polling, not Supabase Realtime.
