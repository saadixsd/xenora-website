-- Nora chat persistence (per user, multiple sessions)
CREATE TABLE public.nora_chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  chat_kind TEXT NOT NULL DEFAULT 'general' CHECK (chat_kind IN ('general', 'agent_builder')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX nora_chat_sessions_user_updated ON public.nora_chat_sessions (user_id, updated_at DESC);

CREATE TABLE public.nora_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.nora_chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX nora_chat_messages_session_created ON public.nora_chat_messages (session_id, created_at);

-- User-defined agents created via Nora interview ("deploy")
CREATE TABLE public.user_custom_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  mission TEXT NOT NULL,
  target_user TEXT,
  raw_inputs TEXT,
  output_deliverables TEXT,
  guardrails TEXT,
  interview_summary TEXT,
  starter_prompt TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deployed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX user_custom_agents_user_created ON public.user_custom_agents (user_id, created_at DESC);

ALTER TABLE public.nora_chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nora_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_custom_agents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own chat sessions"
  ON public.nora_chat_sessions FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users read own chat messages"
  ON public.nora_chat_messages FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.nora_chat_sessions s WHERE s.id = session_id AND s.user_id = auth.uid())
  );

CREATE POLICY "Users insert own chat messages"
  ON public.nora_chat_messages FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.nora_chat_sessions s WHERE s.id = session_id AND s.user_id = auth.uid())
  );

CREATE POLICY "Users delete own chat messages"
  ON public.nora_chat_messages FOR DELETE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.nora_chat_sessions s WHERE s.id = session_id AND s.user_id = auth.uid())
  );

CREATE POLICY "Users manage own custom agents"
  ON public.user_custom_agents FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Idempotent: ensure built-in workflow templates stay selectable in UI if older DB missed prior migration
UPDATE public.workflow_templates
SET status = 'active'
WHERE name IN ('Research Agent', 'Lead Follow-up Agent');
