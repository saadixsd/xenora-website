// Per-provider OAuth configuration. Tokens are exchanged server-side only.

export type ProviderId = 'gmail' | 'x' | 'instagram' | 'linkedin';

export interface ProviderConfig {
  id: ProviderId;
  authorizeUrl: string;
  tokenUrl: string;
  scopes: string[];
  // Returns extra params for the authorize URL (e.g. access_type=offline).
  extraAuthParams?: Record<string, string>;
  clientIdEnv: string;
  clientSecretEnv: string;
  // Optional: returns the human-readable account label after token exchange.
  fetchAccount?: (accessToken: string) => Promise<{ id?: string; label?: string }>;
  // Optional: revoke endpoint called on disconnect.
  revoke?: (accessToken: string) => Promise<void>;
}

const REDIRECT_URI = `${Deno.env.get('SUPABASE_URL')}/functions/v1/oauth-callback`;

export function getRedirectUri(): string {
  return REDIRECT_URI;
}

export const PROVIDERS: Record<ProviderId, ProviderConfig> = {
  gmail: {
    id: 'gmail',
    authorizeUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    scopes: [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
    extraAuthParams: {
      access_type: 'offline',
      prompt: 'consent',
      include_granted_scopes: 'true',
    },
    clientIdEnv: 'GOOGLE_OAUTH_CLIENT_ID',
    clientSecretEnv: 'GOOGLE_OAUTH_CLIENT_SECRET',
    fetchAccount: async (accessToken) => {
      const r = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!r.ok) return {};
      const data = await r.json();
      return { id: data.sub, label: data.email };
    },
    revoke: async (accessToken) => {
      await fetch(`https://oauth2.googleapis.com/revoke?token=${encodeURIComponent(accessToken)}`, {
        method: 'POST',
      });
    },
  },
  x: {
    id: 'x',
    authorizeUrl: 'https://twitter.com/i/oauth2/authorize',
    tokenUrl: 'https://api.twitter.com/2/oauth2/token',
    scopes: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'],
    extraAuthParams: {
      // PKCE plain — secure-enough when paired with our signed state.
      // The actual code_challenge/verifier is generated per-request below.
    },
    clientIdEnv: 'X_OAUTH_CLIENT_ID',
    clientSecretEnv: 'X_OAUTH_CLIENT_SECRET',
    fetchAccount: async (accessToken) => {
      const r = await fetch('https://api.twitter.com/2/users/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!r.ok) return {};
      const data = await r.json();
      return { id: data.data?.id, label: data.data?.username ? `@${data.data.username}` : undefined };
    },
    revoke: async (accessToken) => {
      const clientId = Deno.env.get('X_OAUTH_CLIENT_ID') ?? '';
      const clientSecret = Deno.env.get('X_OAUTH_CLIENT_SECRET') ?? '';
      const basic = btoa(`${clientId}:${clientSecret}`);
      await fetch('https://api.twitter.com/2/oauth2/revoke', {
        method: 'POST',
        headers: {
          Authorization: `Basic ${basic}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ token: accessToken, token_type_hint: 'access_token' }),
      });
    },
  },
  instagram: {
    id: 'instagram',
    // Instagram Graph via Facebook Login for Business
    authorizeUrl: 'https://www.facebook.com/v19.0/dialog/oauth',
    tokenUrl: 'https://graph.facebook.com/v19.0/oauth/access_token',
    scopes: ['instagram_basic', 'instagram_content_publish', 'pages_show_list', 'business_management'],
    clientIdEnv: 'META_APP_ID',
    clientSecretEnv: 'META_APP_SECRET',
    fetchAccount: async (accessToken) => {
      const r = await fetch(`https://graph.facebook.com/v19.0/me?fields=id,name&access_token=${accessToken}`);
      if (!r.ok) return {};
      const data = await r.json();
      return { id: data.id, label: data.name };
    },
  },
  linkedin: {
    id: 'linkedin',
    authorizeUrl: 'https://www.linkedin.com/oauth/v2/authorization',
    tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
    scopes: ['r_liteprofile', 'w_member_social', 'r_emailaddress'],
    clientIdEnv: 'LINKEDIN_CLIENT_ID',
    clientSecretEnv: 'LINKEDIN_CLIENT_SECRET',
    fetchAccount: async (accessToken) => {
      const r = await fetch('https://api.linkedin.com/v2/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!r.ok) return {};
      const data = await r.json();
      const label = [data.localizedFirstName, data.localizedLastName].filter(Boolean).join(' ');
      return { id: data.id, label: label || undefined };
    },
  },
};

export function isProvider(s: string | null): s is ProviderId {
  return s === 'gmail' || s === 'x' || s === 'instagram' || s === 'linkedin';
}
