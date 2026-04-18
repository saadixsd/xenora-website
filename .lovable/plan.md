

## Plan: Per-user OAuth connections for Gmail, X, Instagram, LinkedIn

### The honest reality first

These four platforms require **per-user OAuth** (each user authorizes their own account), not workspace-level connectors. That means:

1. **You** must register a developer app with each platform (Google Cloud Console, X Developer Portal, Meta for Developers, LinkedIn Developer Portal) and get OAuth Client IDs + Secrets.
2. We store those secrets in Lovable Cloud (server-side only, never in the browser).
3. We build the OAuth flow + encrypted token storage.

There is no shortcut — Lovable's built-in connectors authenticate *one* developer account, not each end-user. Per-user OAuth must be implemented from scratch.

---

### Architecture

```text
User clicks "Connect Gmail"
   -> Frontend redirects to /functions/v1/oauth-start?provider=gmail
   -> Edge function builds provider auth URL with state token, redirects user
   -> User approves on Google's consent screen
   -> Google redirects to /functions/v1/oauth-callback?code=...&state=...
   -> Edge function exchanges code for access+refresh tokens
   -> Tokens encrypted with NORA_APP_SECRET (AES-GCM) and stored in user_connections
   -> User redirected back to /dashboard/connections with success toast
```

### Database (one new table)

`public.user_connections`
- `id uuid pk`
- `user_id uuid references auth.users` (RLS: owner only)
- `provider text` (`gmail` | `x` | `instagram` | `linkedin`)
- `provider_account_id text` (e.g. Gmail address, X handle)
- `access_token_encrypted text`, `refresh_token_encrypted text`, `token_iv text`
- `scopes text[]`, `expires_at timestamptz`
- `status text` (`active` | `revoked` | `expired`)
- `connected_at`, `updated_at`
- Unique `(user_id, provider)`
- RLS: users can only `SELECT`/`DELETE` their own rows. No client `INSERT`/`UPDATE` — only edge functions (service role) write tokens.

### Edge functions (3 new)

1. **`oauth-start`** — validates user JWT, generates signed `state` (HMAC with `NORA_APP_SECRET`), returns the provider auth URL. Frontend does `window.location = url`.
2. **`oauth-callback`** — verifies `state`, exchanges `code` for tokens per provider, encrypts tokens with AES-GCM (key derived from `NORA_APP_SECRET`), upserts into `user_connections`, redirects to `/dashboard/connections?connected=<provider>`.
3. **`disconnect-provider`** — revokes token upstream where supported, marks row `revoked`, deletes encrypted tokens.

A shared helper module handles encryption/decryption so other agents (Leads, Content) can later read tokens server-side only.

### Frontend changes

- `src/pages/Connections.tsx` — replace disabled buttons with real Connect / Disconnect actions, fetch live status from `user_connections`, show connected account label + connected date, surface OAuth callback success/error toasts via query params.
- Add "Reconnect" affordance when `status = expired`.
- Show clear "What this enables" copy and "Revoke any time" reassurance.

### Secrets you'll need to add (I'll request them via the secrets tool when we reach that step)

| Provider | Secrets |
|----------|---------|
| Gmail (Google) | `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET` |
| X (Twitter) | `X_OAUTH_CLIENT_ID`, `X_OAUTH_CLIENT_SECRET` |
| Instagram | `META_APP_ID`, `META_APP_SECRET` (Instagram Graph via Facebook Login) |
| LinkedIn | `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET` |

For each, the **Authorized Redirect URI** to register on the provider side will be:
`https://bblzvdfztnxrebfupjtj.supabase.co/functions/v1/oauth-callback`

### Security guarantees

- Tokens never touch the browser. Frontend only sees `{ provider, status, account_label, expires_at }`.
- AES-GCM encryption at rest using a key derived from `NORA_APP_SECRET` (already in your secrets).
- Signed `state` parameter prevents CSRF on the OAuth callback.
- RLS prevents any user from reading another user's connections.
- Refresh tokens auto-rotated by edge functions when expired (background refresh on agent runs).
- Disconnect calls provider revoke endpoints (Google revoke, X revoke, LinkedIn revoke) before deleting locally.

### Implementation order (one approval = all of this)

1. Migration: `user_connections` table + RLS.
2. Shared encryption helper in `supabase/functions/_shared/crypto.ts`.
3. `oauth-start` + `oauth-callback` + `disconnect-provider` edge functions (Gmail first, then X, Instagram, LinkedIn — same pattern).
4. Rewrite `src/pages/Connections.tsx` with real status + actions.
5. Request the 8 OAuth secrets via the secrets tool, with step-by-step guidance for each provider's developer console.
6. Test Gmail end-to-end first (most documented), then the others.

### What I need from you after approval

- A confirmation that you're willing to register developer apps on Google, X, Meta, and LinkedIn (it's free but takes 10–30 min per provider).
- We can ship Gmail first and add the others incrementally if you'd prefer to validate the flow before doing all four registrations.

