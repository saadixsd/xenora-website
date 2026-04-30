-- Add missing INSERT and UPDATE policies on user_connections so authenticated users
-- cannot insert rows with someone else's user_id or overwrite another user's OAuth tokens.
DROP POLICY IF EXISTS "Users can insert their own connections" ON public.user_connections;
DROP POLICY IF EXISTS "Users can update their own connections" ON public.user_connections;

CREATE POLICY "Users can insert their own connections"
  ON public.user_connections
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own connections"
  ON public.user_connections
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own Ask Nora query history.
DROP POLICY IF EXISTS "Users can delete their own query logs" ON public.nora_query_logs;
CREATE POLICY "Users can delete their own query logs"
  ON public.nora_query_logs
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
