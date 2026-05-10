revoke execute on function public.is_workspace_member(uuid, uuid) from public, anon, authenticated;
revoke execute on function public.has_workspace_role(uuid, uuid, public.workspace_role[]) from public, anon, authenticated;
revoke execute on function public.has_role(uuid, public.app_role) from public, anon, authenticated;