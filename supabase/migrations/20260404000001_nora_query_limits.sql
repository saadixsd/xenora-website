-- Nora per-user daily query logs (Claude chat quota)

CREATE TABLE public.nora_query_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  query_text text,
  agent_type text NOT NULL DEFAULT 'chat'
);

CREATE INDEX nora_query_logs_user_created_at_idx
  ON public.nora_query_logs (user_id, created_at);

ALTER TABLE public.nora_query_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "nora_query_logs_select_own"
  ON public.nora_query_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "nora_query_logs_insert_own"
  ON public.nora_query_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.get_daily_query_count(p_user_id uuid)
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
      AND created_at >= (date_trunc('day', timezone('UTC', now())))
  );
END;
$$;

REVOKE ALL ON FUNCTION public.get_daily_query_count(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_daily_query_count(uuid) TO authenticated, service_role;
