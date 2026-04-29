-- 1. Lock down billing_subscriptions writes: only service role may write.
CREATE POLICY "No client inserts on billing"
  ON public.billing_subscriptions
  AS RESTRICTIVE
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (false);

CREATE POLICY "No client updates on billing"
  ON public.billing_subscriptions
  AS RESTRICTIVE
  FOR UPDATE
  TO authenticated, anon
  USING (false)
  WITH CHECK (false);

CREATE POLICY "No client deletes on billing"
  ON public.billing_subscriptions
  AS RESTRICTIVE
  FOR DELETE
  TO authenticated, anon
  USING (false);

-- 2. Prevent privilege escalation on user_roles: only admins (existing ALL policy) may write.
-- Add a RESTRICTIVE policy that blocks non-admin writes explicitly.
CREATE POLICY "Only admins may insert roles"
  ON public.user_roles
  AS RESTRICTIVE
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins may update roles"
  ON public.user_roles
  AS RESTRICTIVE
  FOR UPDATE
  TO authenticated, anon
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins may delete roles"
  ON public.user_roles
  AS RESTRICTIVE
  FOR DELETE
  TO authenticated, anon
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 3. Revoke EXECUTE on SECURITY DEFINER helper functions from anon/authenticated.
-- These should only be invoked from server-side (edge functions via service role) or internal SQL.
REVOKE EXECUTE ON FUNCTION public.get_daily_query_count(uuid) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.get_nora_chat_usage_this_month(uuid) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.get_workflow_run_count_this_month(uuid) FROM anon, authenticated, public;
-- has_role is used inside RLS policies; keep callable but restrict direct API exposure
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, public;