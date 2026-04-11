
INSERT INTO public.workflow_templates (name, description, icon, status, steps)
VALUES
  ('Lead Agent', 'Inbound form or DM → Nora scores, drafts a personalized reply, and queues follow-up. You approve before send.', 'Mail', 'active', '["input_received", "parsing", "drafting", "personalizing", "formatting", "done"]'::jsonb),
  ('Research Agent', 'Notes plus optional public URLs → pain signals, content angles, and relevance you can act on.', 'Search', 'active', '["input_received", "researching", "analyzing", "summarizing", "formatting", "done"]'::jsonb)
ON CONFLICT DO NOTHING;
