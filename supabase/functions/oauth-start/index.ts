import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { signState } from '../_shared/oauthCrypto.ts';
import { PROVIDERS, getRedirectUri, isProvider } from '../_shared/oauthProviders.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const url = new URL(req.url);
    const provider = url.searchParams.get('provider');
    if (!isProvider(provider)) {
      return new Response(JSON.stringify({ error: 'Invalid provider' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const cfg = PROVIDERS[provider];
    const clientId = Deno.env.get(cfg.clientIdEnv);
    if (!clientId) {
      return new Response(
        JSON.stringify({ error: `${cfg.clientIdEnv} is not configured. Add it in Lovable Cloud secrets.` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const nonce = crypto.randomUUID();
    const state = await signState({
      user_id: userData.user.id,
      provider,
      nonce,
      exp: Math.floor(Date.now() / 1000) + 600, // 10 min
    });

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: getRedirectUri(),
      response_type: 'code',
      scope: cfg.scopes.join(provider === 'linkedin' || provider === 'instagram' ? ',' : ' '),
      state,
      ...(cfg.extraAuthParams ?? {}),
    });

    // X requires PKCE
    if (provider === 'x') {
      // Use the nonce as the (plain) verifier and challenge for simplicity.
      params.set('code_challenge', nonce);
      params.set('code_challenge_method', 'plain');
    }

    const authorizeUrl = `${cfg.authorizeUrl}?${params.toString()}`;
    return new Response(JSON.stringify({ url: authorizeUrl }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('oauth-start error', err);
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
