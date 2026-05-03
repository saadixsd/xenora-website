const fnBase = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

function edgeHeaders(accessToken: string): HeadersInit {
  return {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
    apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  };
}

export async function createPortalSession(accessToken: string): Promise<string> {
  const res = await fetch(`${fnBase}/create-portal-session`, {
    method: 'POST',
    headers: edgeHeaders(accessToken),
  });
  const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
  if (!res.ok) {
    throw new Error(data.error || `Portal failed (${res.status})`);
  }
  if (!data.url) throw new Error('No portal URL returned');
  return data.url;
}
