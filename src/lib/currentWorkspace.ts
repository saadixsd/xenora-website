import { supabase } from '@/integrations/supabase/client';

/**
 * Returns the current user's active workspace id. For Phase 1 of the team-workspaces rollout
 * every user has exactly one personal workspace they own, so we just return it. When the
 * workspace switcher ships we'll read the active id from local storage / context here.
 */
let cached: { userId: string; workspaceId: string } | null = null;

export async function getCurrentWorkspaceId(userId: string): Promise<string> {
  if (cached && cached.userId === userId) return cached.workspaceId;

  const { data, error } = await supabase
    .from('workspace_members' as any)
    .select('workspace_id, role, joined_at')
    .eq('user_id', userId)
    .order('joined_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  const row = data as { workspace_id?: string } | null;
  if (!row?.workspace_id) throw new Error('No workspace found for user');
  cached = { userId, workspaceId: row.workspace_id };
  return row.workspace_id;
}

export function clearWorkspaceCache() {
  cached = null;
}
