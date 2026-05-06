# Architecture — XenoraAI / Nora

This document is the human-first map of the codebase. If you are reviewing a PR or onboarding,
start here. For product positioning copy, see `mem://product/positioning`.

## 1. Mental model

Two names, one product:

| Surface | Brand | Audience |
|---|---|---|
| Public site (`/`, `/about`, `/faq`, `/privacy`) | **XenoraAI** | Visitors, prospects |
| Authenticated app (`/dashboard/*`) | **Nora** | Signed-in operators |

**XenoraAI** is the umbrella company. **Nora** is the agentic engine that runs inside it —
it observes how a business operates, adapts to the operator's tools, and autonomously executes
repetitive workflows (content drafting, lead follow-up, research). Every run is reviewable
before anything is published or sent.

## 2. Layers

```
┌──────────────────────────────────────────────────────────────────────┐
│  React + Vite SPA (this repo, /src)                                  │
│  ├─ Marketing pages (Index, About, FAQ, Privacy)                     │
│  └─ Dashboard (Layout + 9 routes, all behind <ProtectedRoute>)       │
└─────────────────────────────┬────────────────────────────────────────┘
                              │  supabase-js (anon key only)
                              ▼
┌──────────────────────────────────────────────────────────────────────┐
│  Supabase (Lovable Cloud)                                            │
│  ├─ Postgres + RLS  (user-scoped tables, app_role enum, has_role)    │
│  ├─ Auth            (email/password + Google OAuth)                  │
│  └─ Edge Functions  (Deno; see §5)                                   │
└─────────────────────────────┬────────────────────────────────────────┘
                              │  service-role + outbound HTTP
                              ▼
                   Anthropic · Lovable AI · Stripe · ElevenLabs · OAuth providers
```

## 3. Folder map

```
src/
├─ App.tsx                      Single router. Lazy-loads every route. Wraps Theme + Auth providers.
├─ config/
│  ├─ routes.ts                 Canonical path constants (ROUTES.*). Import these — never hardcode.
│  ├─ noraQuota.ts              Allowlist of emails exempt from public free-tier caps (mirror of edge).
│  └─ stripePaymentLinks.ts     Public payment-link URLs (publishable; safe in client).
├─ pages/                       One file per route. Marketing pages own their own footer.
├─ components/
│  ├─ ProtectedRoute.tsx        Auth gate for /dashboard/*.
│  ├─ app/                      App-shell primitives: ThemeProvider, ScrollManager.
│  ├─ nora-landing/             Marketing-only widgets (SiteNav, hero pieces, lead form).
│  ├─ dashboard/                Dashboard shell + agent UIs (NoraChatPanel, QuickRunInput, etc).
│  ├─ motion/Reveal.tsx         Single Framer Motion primitive.
│  └─ ui/                       shadcn/ui primitives (do not edit by hand).
├─ hooks/
│  ├─ useAuth.tsx               Context-based session. Sync localStorage hydration (no post-login flash).
│  ├─ useAdminRole.ts           Reads user_roles via has_role().
│  ├─ useTheme.ts               Reads ThemeProvider context. Toggle lives in Settings → Appearance.
│  └─ useNoraVoiceWake.ts       Wake-word + clap detector for the voice orb.
├─ lib/
│  ├─ claude.ts                 Client wrapper around the nora-claude edge function.
│  ├─ noraAgentSpec.ts          Agent-builder schema (Zod) + parser.
│  ├─ noraChatSession.ts        Chat-session CRUD (sidebar/history sync).
│  ├─ noraPersonalContext.ts    Builds the personalization preamble for chat.
│  ├─ noraPointerContext.ts     Cursor-orb context (what the user is hovering).
│  ├─ noraRouteContext.ts       Maps the current route to a human description for Nora.
│  ├─ noraTts.ts / noraVoice.ts ElevenLabs TTS + browser STT bindings.
│  ├─ stripeEdge.ts             Client wrapper around create-portal-session.
│  └─ utils.ts                  cn() and small helpers.
└─ integrations/supabase/       AUTO-GENERATED. Never edit client.ts or types.ts by hand.

supabase/
├─ config.toml                  Edge-function flags. All functions use verify_jwt = false (see §5).
├─ migrations/                  Append-only SQL history.
└─ functions/
   ├─ _shared/                  Cross-function modules (billing, quota, OAuth crypto, providers).
   ├─ nora-claude/              Ask Nora chat (Anthropic Claude). Per-user monthly cap on free.
   ├─ nora-workflow/            SSE workflow runner (Content / Lead / Research).
   ├─ nora-tts/                 ElevenLabs proxy.
   ├─ create-checkout-session/  Stripe Checkout (Plus / Pro).
   ├─ create-portal-session/    Stripe Billing Portal.
   ├─ stripe-webhook/           Updates billing_subscriptions on subscription events.
   ├─ oauth-start/              Begins OAuth for Gmail/Slack/Notion etc. Signs CSRF state.
   ├─ oauth-callback/           Exchanges code, encrypts tokens (AES-GCM), stores in user_connections.
   ├─ disconnect-provider/      Revokes + deletes a stored connection.
   └─ submit-lead/              Public contact form → leads table (service-role insert).
```

## 4. Routing

**Single source of truth**: `src/config/routes.ts`. The router in `src/App.tsx` reads from it,
and every `<Link>` / `navigate(...)` call should import `ROUTES` rather than typing literal paths.
Helpers `agentEditPath(id)` and `dashboardRunPath(runId)` exist for parameterized paths.

Public routes: `/`, `/about`, `/faq`, `/privacy`, `/login`, `/signup`, `/auth/callback`.
Bridge route: `/try-nora` — gated by `<ProtectedRoute>` and immediately redirects to
`/dashboard/nora` for signed-in users (guests are sent to `/login` first).
Dashboard routes (all behind `<ProtectedRoute>` + `<DashboardLayout>`): `index`, `nora`,
`run/:id`, `history`, `settings`, `agents/manage`, `agents/:id/edit`, `agents/:slug`, `connections`.

SPA fallback is handled by Lovable hosting — no `_redirects` file.

## 5. Edge functions & auth model

Every function in `supabase/functions/*` declares `verify_jwt = false` in `supabase/config.toml`.
This is **deliberate**: it lets the OPTIONS preflight succeed without an Authorization header
(which the browser does not attach to preflight requests). Each function then validates the
caller's JWT in code:

```ts
const { data: { user } } = await supabase.auth.getUser(authHeader);
if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, ... });
```

Public webhooks (`stripe-webhook`, `submit-lead`, `oauth-callback`) skip the JWT check and
authenticate via signature / signed-state / no-auth-needed respectively.

## 6. Database & RLS

All user data is scoped by `auth.uid() = user_id`. Admin-only tables (`leads`, `lead_notes`,
`lead_activities`) are gated by `has_role(auth.uid(), 'admin')`. Roles are stored exclusively
in `public.user_roles` — never on `profiles` — to avoid privilege-escalation patterns.

### Usage counters (caller-scoped)

| Function | Scope | Caller |
|---|---|---|
| `my_nora_chat_usage_this_month()` | own row | authenticated client |
| `my_workflow_run_count_this_month()` | own row | authenticated client |
| `get_nora_chat_usage_this_month(uuid)` | any user | service_role only (edge functions) |
| `get_workflow_run_count_this_month(uuid)` | any user | service_role only (edge functions) |
| `get_daily_query_count(uuid)` | any user | service_role only |
| `has_role(uuid, app_role)` | any user | authenticated (RLS helper, returns bool) |

### Realtime

Not used. The dashboard polls every 3 seconds for workflow status.

## 7. Secrets

| Secret | Where it lives | Why |
|---|---|---|
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` | `.env` (auto-managed) | Anon key, safe in client |
| `CLAUDE_API_KEY` | Supabase Edge secrets | Anthropic API |
| `LOVABLE_API_KEY` | Supabase Edge secrets | Lovable AI gateway (workflow gen) |
| `ELEVENLABS_API_KEY` | Supabase Edge secrets | TTS proxy |
| `NORA_APP_SECRET` | Supabase Edge secrets | HMAC for OAuth state + AES key derivation |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_*` | Supabase Edge secrets | Billing |
| `SUPABASE_SERVICE_ROLE_KEY` | Auto-injected into edge functions only | Privileged DB |

Nothing private should ever be added with a `VITE_` prefix.

## 8. Conventions

- **Design tokens only** — no hardcoded colors. Tokens live in `src/index.css` + `tailwind.config.ts`.
- **Geist** font everywhere. `font-syne` and `.premium-heading` both alias to Geist.
- **Accent green**: `#10b981` (dark) / `#0E8F6E` (light), used sparingly on CTAs and focus states.
- **No competitor names**. No location / founder mentions. Tone is formal corporate, not personal.
- **Auth context only** — never read `localStorage` for session state in components; use `useAuth()`.
- **Lazy-load every page** in `App.tsx` for landing-page TTI.
