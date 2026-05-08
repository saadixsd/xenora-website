
ALTER TABLE public.workflow_runs
  ADD COLUMN IF NOT EXISTS custom_agent_id uuid REFERENCES public.user_custom_agents(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_workflow_runs_user_template_created
  ON public.workflow_runs (user_id, template_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_workflow_runs_user_custom_agent_created
  ON public.workflow_runs (user_id, custom_agent_id, created_at DESC);

CREATE OR REPLACE FUNCTION public.get_template_run_count_this_month(
  p_user_id uuid,
  p_template_id uuid
)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(COUNT(*)::integer, 0)
  FROM public.workflow_runs
  WHERE user_id = p_user_id
    AND template_id = p_template_id
    AND created_at >= date_trunc('month', now() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC';
$$;

CREATE OR REPLACE FUNCTION public.get_custom_agent_run_count_today(
  p_user_id uuid,
  p_custom_agent_id uuid
)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(COUNT(*)::integer, 0)
  FROM public.workflow_runs
  WHERE user_id = p_user_id
    AND custom_agent_id = p_custom_agent_id
    AND created_at >= date_trunc('day', now() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC';
$$;
