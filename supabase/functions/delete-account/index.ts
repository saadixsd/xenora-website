// Deletes the authenticated user's account permanently.
// Requires a valid JWT (verified via getUser) — the user can only delete themselves.
// Cascading data cleanup: profile rows, chat sessions/messages, workflow runs/outputs/items,
// custom agents, connections, etc. are removed by RLS-owned deletes (or cascade where wired).

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: corsHeaders });
  }

  const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
  const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  const ANON = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

  const authHeader = req.headers.get('Authorization') ?? '';
  if (!authHeader.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
  }

  // Verify the caller's JWT.
  const userClient = createClient(SUPABASE_URL, ANON, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: userData, error: userErr } = await userClient.auth.getUser();
  if (userErr || !userData?.user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
  }
  const userId = userData.user.id;

  // Confirm-phrase check.
  let body: { confirm?: string } = {};
  try { body = await req.json(); } catch { /* ignore */ }
  if ((body.confirm ?? '').trim().toLowerCase() !== 'delete') {
    return new Response(JSON.stringify({ error: 'Confirmation phrase required' }), { status: 400, headers: corsHeaders });
  }

  // Service-role client — bypasses RLS for cleanup + admin delete.
  const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

  // Best-effort cascade cleanup of user-owned rows. We swallow per-table errors so
  // a missing/optional table never blocks the auth-user deletion.
  const tables = [
    'workflow_step_logs',
    'workflow_outputs',
    'workflow_items',
    'workflow_runs',
    'nora_chat_messages',
    'nora_chat_sessions',
    'nora_query_logs',
    'user_custom_agents',
    'user_connections',
    'billing_subscriptions',
    'user_roles',
    'profiles',
  ];
  for (const t of tables) {
    try { await admin.from(t).delete().eq('user_id', userId); } catch (_e) { /* ignore */ }
  }

  const { error: delErr } = await admin.auth.admin.deleteUser(userId);
  if (delErr) {
    return new Response(JSON.stringify({ error: delErr.message }), { status: 500, headers: corsHeaders });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
