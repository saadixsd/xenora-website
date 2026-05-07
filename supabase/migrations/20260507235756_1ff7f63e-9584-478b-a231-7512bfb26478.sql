-- Workflow items: persistent units of work
CREATE TABLE public.workflow_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  run_id uuid REFERENCES public.workflow_runs(id) ON DELETE SET NULL,
  source_output_id uuid REFERENCES public.workflow_outputs(id) ON DELETE SET NULL,
  type text NOT NULL DEFAULT 'idea',
  stage text NOT NULL DEFAULT 'idea',
  title text,
  input_text text,
  ai_draft text,
  platform text,
  due_date timestamptz,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT workflow_items_type_chk CHECK (type IN ('post','reply','idea','research_note','follow_up')),
  CONSTRAINT workflow_items_stage_chk CHECK (stage IN ('idea','drafting','review','ready','sent','archived'))
);

CREATE INDEX workflow_items_user_stage_idx ON public.workflow_items (user_id, stage, updated_at DESC);
CREATE INDEX workflow_items_run_idx ON public.workflow_items (run_id);

ALTER TABLE public.workflow_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own items"
  ON public.workflow_items FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own items"
  ON public.workflow_items FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own items"
  ON public.workflow_items FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own items"
  ON public.workflow_items FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE TRIGGER workflow_items_updated_at
  BEFORE UPDATE ON public.workflow_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Workflow step logs: per-run narration timeline (and optionally per-item)
CREATE TABLE public.workflow_step_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id uuid NOT NULL REFERENCES public.workflow_runs(id) ON DELETE CASCADE,
  item_id uuid REFERENCES public.workflow_items(id) ON DELETE CASCADE,
  step_name text NOT NULL,
  status text NOT NULL DEFAULT 'running',
  narration text,
  debug_info jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT workflow_step_logs_status_chk CHECK (status IN ('running','complete','failed','skipped'))
);

CREATE INDEX workflow_step_logs_run_idx ON public.workflow_step_logs (run_id, created_at);
CREATE INDEX workflow_step_logs_item_idx ON public.workflow_step_logs (item_id, created_at);

ALTER TABLE public.workflow_step_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read step logs for own runs"
  ON public.workflow_step_logs FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.workflow_runs r
    WHERE r.id = workflow_step_logs.run_id AND r.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert step logs for own runs"
  ON public.workflow_step_logs FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.workflow_runs r
    WHERE r.id = workflow_step_logs.run_id AND r.user_id = auth.uid()
  ));