-- Tighten EXECUTE on SECURITY DEFINER functions: revoke from public/anon, grant only to authenticated where appropriate
REVOKE ALL ON FUNCTION public.get_daily_query_count(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.get_nora_chat_usage_this_month(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.get_workflow_run_count_this_month(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.get_daily_query_count(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_nora_chat_usage_this_month(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_workflow_run_count_this_month(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

-- handle_new_user is a trigger function on auth.users; revoke any direct execute
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;