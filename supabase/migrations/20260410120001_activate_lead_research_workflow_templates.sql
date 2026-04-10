-- Built-in Lead and Research templates were seeded as coming_soon; RLS only exposes
-- status = 'active' (see 20260408033339). Ensure they stay selectable and runnable.
UPDATE public.workflow_templates
SET status = 'active'
WHERE name IN ('Research Agent', 'Lead Follow-up Agent');
