// AES-GCM encryption helper for OAuth tokens.
// Key is derived from NORA_APP_SECRET via SHA-256 to guarantee 32 bytes.

const enc = new TextEncoder();
const dec = new TextDecoder();

async function getKey(): Promise<CryptoKey> {
  const secret = Deno.env.get('NORA_APP_SECRET');
  if (!secret) throw new Error('NORA_APP_SECRET is not configured');
  const hash = await crypto.subtle.digest('SHA-256', enc.encode(secret));
  return crypto.subtle.importKey('raw', hash, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
}

function toB64(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let s = '';
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s);
}

function fromB64(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export async function encryptToken(plaintext: string): Promise<{ ciphertext: string; iv: string }> {
  const key = await getKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(plaintext));
  return { ciphertext: toB64(ct), iv: toB64(iv) };
}

export async function decryptToken(ciphertext: string, iv: string): Promise<string> {
  const key = await getKey();
  const pt = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: fromB64(iv) },
    key,
    fromB64(ciphertext),
  );
  return dec.decode(pt);
}

// Signed state tokens to prevent CSRF on the OAuth callback.
// Format: base64url(payloadJson) + "." + base64url(hmacSha256)

async function hmacKey(): Promise<CryptoKey> {
  const secret = Deno.env.get('NORA_APP_SECRET');
  if (!secret) throw new Error('NORA_APP_SECRET is not configured');
  return crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

function b64url(input: string | Uint8Array): string {
  const b = typeof input === 'string' ? btoa(input) : toB64(input);
  return b.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromB64url(s: string): string {
  const pad = s.length % 4 === 0 ? '' : '='.repeat(4 - (s.length % 4));
  return atob(s.replace(/-/g, '+').replace(/_/g, '/') + pad);
}

export interface StatePayload {
  user_id: string;
  provider: string;
  nonce: string;
  exp: number; // unix seconds
}

export async function signState(payload: StatePayload): Promise<string> {
  const key = await hmacKey();
  const json = JSON.stringify(payload);
  const body = b64url(json);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(body));
  return `${body}.${b64url(new Uint8Array(sig))}`;
}

export async function verifyState(token: string): Promise<StatePayload | null> {
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;
  const key = await hmacKey();
  const sigBytes = fromB64(sig.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (sig.length % 4)) % 4));
  const ok = await crypto.subtle.verify('HMAC', key, sigBytes, enc.encode(body));
  if (!ok) return null;
  try {
    const payload = JSON.parse(fromB64url(body)) as StatePayload;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}
