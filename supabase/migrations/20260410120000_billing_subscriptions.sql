-- Stripe-backed plans: Nora Plus / Nora Pro. Webhook (service role) writes; users read own row.

CREATE TABLE public.billing_subscriptions (
  user_id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  stripe_customer_id text NOT NULL,
  stripe_subscription_id text,
  plan text NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'plus', 'pro')),
  status text NOT NULL DEFAULT 'inactive' CHECK (
    status IN ('inactive', 'active', 'trialing', 'past_due', 'canceled', 'unpaid', 'incomplete', 'incomplete_expired')
  ),
  current_period_end timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX billing_subscriptions_stripe_customer_idx ON public.billing_subscriptions (stripe_customer_id);
CREATE INDEX billing_subscriptions_stripe_sub_idx ON public.billing_subscriptions (stripe_subscription_id);

ALTER TABLE public.billing_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own billing"
  ON public.billing_subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- No INSERT/UPDATE/DELETE for authenticated clients — only service_role (webhook / checkout bootstrap).

-- Monthly UTC calendar windows (aligned with plan: free tier resets each month)

CREATE OR REPLACE FUNCTION public._month_start_utc()
RETURNS timestamptz
LANGUAGE sql
STABLE
AS $$
  SELECT (date_trunc('month', (NOW() AT TIME ZONE 'UTC')) AT TIME ZONE 'UTC');
$$;

CREATE OR REPLACE FUNCTION public.get_nora_chat_usage_this_month(p_user_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
BEGIN
  IF auth.uid() IS NOT NULL AND p_user_id <> auth.uid() THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  RETURN (
    SELECT COUNT(*)::integer
    FROM public.nora_query_logs
    WHERE user_id = p_user_id
      AND created_at >= public._month_start_utc()
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.get_workflow_run_count_this_month(p_user_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
BEGIN
  IF auth.uid() IS NOT NULL AND p_user_id <> auth.uid() THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  RETURN (
    SELECT COUNT(*)::integer
    FROM public.workflow_runs
    WHERE user_id = p_user_id
      AND created_at >= public._month_start_utc()
      AND COALESCE(status, '') <> 'failed'
  );
END;
$$;

REVOKE ALL ON FUNCTION public.get_nora_chat_usage_this_month(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_nora_chat_usage_this_month(uuid) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.get_workflow_run_count_this_month(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_workflow_run_count_this_month(uuid) TO authenticated, service_role;
