-- 1. Remove workflow_runs from Realtime publication to prevent unscoped channel access
ALTER PUBLICATION supabase_realtime DROP TABLE public.workflow_runs;

-- 2. Tighten workflow_templates SELECT policy to only return active templates
DROP POLICY IF EXISTS "Authenticated users can read templates" ON public.workflow_templates;
CREATE POLICY "Authenticated users can read templates" 
  ON public.workflow_templates 
  FOR SELECT 
  TO authenticated 
  USING (status = 'active');