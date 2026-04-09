
-- Fix 1: Block authenticated users from reading waitlist entries
CREATE POLICY "No one can read waitlist"
ON public.waitlist
FOR SELECT
TO authenticated
USING (false);

-- Fix 2: Add UPDATE/DELETE policies scoped to owner on workflow_outputs
CREATE POLICY "Users can update own outputs"
ON public.workflow_outputs
FOR UPDATE
TO authenticated
USING (EXISTS (
  SELECT 1 FROM workflow_runs
  WHERE workflow_runs.id = workflow_outputs.run_id
    AND workflow_runs.user_id = auth.uid()
));

CREATE POLICY "Users can delete own outputs"
ON public.workflow_outputs
FOR DELETE
TO authenticated
USING (EXISTS (
  SELECT 1 FROM workflow_runs
  WHERE workflow_runs.id = workflow_outputs.run_id
    AND workflow_runs.user_id = auth.uid()
));
