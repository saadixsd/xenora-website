-- Allow any output_type label for multi-agent workflows
ALTER TABLE public.workflow_outputs
  DROP CONSTRAINT IF EXISTS workflow_outputs_output_type_check;

-- Archive + time-saved tracking
ALTER TABLE public.workflow_runs
  ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS estimated_minutes_saved INTEGER NOT NULL DEFAULT 0;

-- Activate Lead and Research templates for production use
UPDATE public.workflow_templates
SET status = 'active'
WHERE name IN ('Research Agent', 'Lead Follow-up Agent');

-- Allow editing saved outputs on own runs
CREATE POLICY "Users can update own outputs"
  ON public.workflow_outputs
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.workflow_runs WHERE id = run_id AND user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.workflow_runs WHERE id = run_id AND user_id = auth.uid())
  );

-- Hard delete own runs (cascades to workflow_outputs)
CREATE POLICY "Users can delete own runs"
  ON public.workflow_runs
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
