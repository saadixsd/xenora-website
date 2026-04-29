import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { encryptToken, verifyState } from '../_shared/oauthCrypto.ts';
import { PROVIDERS, getRedirectUri, isProvider } from '../_shared/oauthProviders.ts';

function redirect(url: string): Response {
  return new Response(null, { status: 302, headers: { Location: url } });
}

const ALLOWED_FRONTEND_ORIGINS = [
  'https://xenora-ai-portal.lovable.app',
  'https://id-preview--cf0b3265-7678-4c8c-b33e-3db7eaeb9c10.lovable.app',
  'http://localhost:8080',
  'http://localhost:5173',
];

function pickFrontendBase(candidate: string | null): string {
  if (candidate) {
    try {
      const u = new URL(candidate);
      const originOnly = `${u.protocol}//${u.host}`;
      if (ALLOWED_FRONTEND_ORIGINS.includes(originOnly)) return originOnly;
    } catch { /* ignore */ }
  }
  return ALLOWED_FRONTEND_ORIGINS[0];
}

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const rawOrigin = req.headers.get('origin') ?? req.headers.get('referer') ?? '';
  const candidate = url.searchParams.get('frontend') || rawOrigin || '';
  const frontendBase = pickFrontendBase(candidate);
  const successUrl = (provider: string) =>
    `${frontendBase}/dashboard/connections?connected=${provider}`;
  const errorUrl = (msg: string) =>
    `${frontendBase}/dashboard/connections?error=${encodeURIComponent(msg)}`;

  try {
    const code = url.searchParams.get('code');
    const stateToken = url.searchParams.get('state');
    const providerError = url.searchParams.get('error');

    if (providerError) return redirect(errorUrl(providerError));
    if (!code || !stateToken) return redirect(errorUrl('missing_code_or_state'));

    const state = await verifyState(stateToken);
    if (!state) return redirect(errorUrl('invalid_state'));
    if (!isProvider(state.provider)) return redirect(errorUrl('invalid_provider'));

    const cfg = PROVIDERS[state.provider];
    const clientId = Deno.env.get(cfg.clientIdEnv);
    const clientSecret = Deno.env.get(cfg.clientSecretEnv);
    if (!clientId || !clientSecret) return redirect(errorUrl('provider_not_configured'));

    // Exchange code for tokens
    const tokenBody = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: getRedirectUri(),
      client_id: clientId,
      client_secret: clientSecret,
    });
    if (state.provider === 'x') {
      tokenBody.set('code_verifier', state.nonce);
    }

    const tokenRes = await fetch(cfg.tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
      body: tokenBody,
    });
    if (!tokenRes.ok) {
      const txt = await tokenRes.text();
      console.error('Token exchange failed', state.provider, tokenRes.status, txt);
      return redirect(errorUrl('token_exchange_failed'));
    }
    const tokens = await tokenRes.json();
    const accessToken: string = tokens.access_token;
    const refreshToken: string | undefined = tokens.refresh_token;
    const expiresIn: number | undefined = tokens.expires_in;
    if (!accessToken) return redirect(errorUrl('no_access_token'));

    // Look up account label
    let accountInfo: { id?: string; label?: string } = {};
    try {
      if (cfg.fetchAccount) accountInfo = await cfg.fetchAccount(accessToken);
    } catch (e) {
      console.error('fetchAccount failed', e);
    }

    // Encrypt tokens
    const accessEnc = await encryptToken(accessToken);
    const refreshEnc = refreshToken ? await encryptToken(refreshToken) : null;

    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const expiresAt = expiresIn ? new Date(Date.now() + expiresIn * 1000).toISOString() : null;

    const { error: upsertErr } = await admin
      .from('user_connections')
      .upsert(
        {
          user_id: state.user_id,
          provider: state.provider,
          provider_account_id: accountInfo.id ?? null,
          account_label: accountInfo.label ?? null,
          access_token_encrypted: accessEnc.ciphertext,
          token_iv: accessEnc.iv,
          refresh_token_encrypted: refreshEnc?.ciphertext ?? null,
          refresh_token_iv: refreshEnc?.iv ?? null,
          scopes: cfg.scopes,
          expires_at: expiresAt,
          status: 'active',
          connected_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,provider' },
      );

    if (upsertErr) {
      console.error('Upsert failed', upsertErr);
      return redirect(errorUrl('save_failed'));
    }

    return redirect(successUrl(state.provider));
  } catch (err) {
    console.error('oauth-callback error', err);
    return redirect(errorUrl('callback_error'));
  }
});
