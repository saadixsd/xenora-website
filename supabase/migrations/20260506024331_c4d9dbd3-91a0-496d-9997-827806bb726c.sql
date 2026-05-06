-- Harden SECURITY DEFINER usage counters: revoke broad EXECUTE and grant only to the
-- caller's own row via a thin wrapper. Edge functions (service_role) keep full access;
-- signed-in users may only call helpers that pass auth.uid() implicitly.

REVOKE EXECUTE ON FUNCTION public.get_daily_query_count(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_nora_chat_usage_this_month(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_workflow_run_count_this_month(uuid) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.get_daily_query_count(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.get_nora_chat_usage_this_month(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.get_workflow_run_count_this_month(uuid) TO service_role;

-- Caller-scoped wrappers: signed-in clients call these without passing a user_id, so they
-- can never read another user's counters.
CREATE OR REPLACE FUNCTION public.my_nora_chat_usage_this_month()
RETURNS integer
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT COALESCE(COUNT(*)::integer, 0)
  FROM public.nora_query_logs
  WHERE user_id = auth.uid()
    AND created_at >= date_trunc('month', now() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC';
$$;

CREATE OR REPLACE FUNCTION public.my_workflow_run_count_this_month()
RETURNS integer
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT COALESCE(COUNT(*)::integer, 0)
  FROM public.workflow_runs
  WHERE user_id = auth.uid()
    AND created_at >= date_trunc('month', now() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC';
$$;

GRANT EXECUTE ON FUNCTION public.my_nora_chat_usage_this_month() TO authenticated;
GRANT EXECUTE ON FUNCTION public.my_workflow_run_count_this_month() TO authenticated;

-- has_role stays SECURITY DEFINER (needed by RLS policies) but tighten EXECUTE to the
-- roles that actually need it. RLS evaluation runs as the policy owner so this remains valid.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;