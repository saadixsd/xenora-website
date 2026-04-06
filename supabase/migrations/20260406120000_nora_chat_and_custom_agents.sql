-- Tighten Nora chat + custom agents schema after 20260406000655 (Lovable baseline).
-- Idempotent: safe if tables were created by 06000655 or by an older run of this file.

-- ── nora_chat_sessions ─────────────────────────────────────────────────────
ALTER TABLE public.nora_chat_sessions
  DROP CONSTRAINT IF EXISTS nora_chat_sessions_chat_kind_check;

ALTER TABLE public.nora_chat_sessions
  ADD CONSTRAINT nora_chat_sessions_chat_kind_check
  CHECK (chat_kind IN ('general', 'agent_builder'));

DO $$
BEGIN
  ALTER TABLE public.nora_chat_sessions
    ADD CONSTRAINT nora_chat_sessions_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS nora_chat_sessions_user_updated
  ON public.nora_chat_sessions (user_id, updated_at DESC);

-- ── nora_chat_messages ───────────────────────────────────────────────────────
ALTER TABLE public.nora_chat_messages
  DROP CONSTRAINT IF EXISTS nora_chat_messages_role_check;

ALTER TABLE public.nora_chat_messages
  ADD CONSTRAINT nora_chat_messages_role_check
  CHECK (role IN ('user', 'assistant', 'system'));

CREATE INDEX IF NOT EXISTS nora_chat_messages_session_created
  ON public.nora_chat_messages (session_id, created_at);

-- ── user_custom_agents ───────────────────────────────────────────────────────
DO $$
BEGIN
  ALTER TABLE public.user_custom_agents
    ADD CONSTRAINT user_custom_agents_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE public.user_custom_agents
  ADD COLUMN IF NOT EXISTS deployed_at TIMESTAMPTZ NOT NULL DEFAULT now();

UPDATE public.user_custom_agents SET mission = '' WHERE mission IS NULL;

ALTER TABLE public.user_custom_agents
  ALTER COLUMN mission SET NOT NULL;

CREATE INDEX IF NOT EXISTS user_custom_agents_user_created
  ON public.user_custom_agents (user_id, created_at DESC);

-- Prefer consolidated policies (drop Lovable granular names if present)
DROP POLICY IF EXISTS "Users can read own sessions" ON public.nora_chat_sessions;
DROP POLICY IF EXISTS "Users can insert own sessions" ON public.nora_chat_sessions;
DROP POLICY IF EXISTS "Users can update own sessions" ON public.nora_chat_sessions;
DROP POLICY IF EXISTS "Users manage own chat sessions" ON public.nora_chat_sessions;

CREATE POLICY "Users manage own chat sessions"
  ON public.nora_chat_sessions FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can read own messages" ON public.nora_chat_messages;
DROP POLICY IF EXISTS "Users can insert own messages" ON public.nora_chat_messages;
DROP POLICY IF EXISTS "Users can delete own messages" ON public.nora_chat_messages;
DROP POLICY IF EXISTS "Users read own chat messages" ON public.nora_chat_messages;
DROP POLICY IF EXISTS "Users insert own chat messages" ON public.nora_chat_messages;
DROP POLICY IF EXISTS "Users delete own chat messages" ON public.nora_chat_messages;

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

DROP POLICY IF EXISTS "Users can read own agents" ON public.user_custom_agents;
DROP POLICY IF EXISTS "Users can insert own agents" ON public.user_custom_agents;
DROP POLICY IF EXISTS "Users can update own agents" ON public.user_custom_agents;
DROP POLICY IF EXISTS "Users can delete own agents" ON public.user_custom_agents;
DROP POLICY IF EXISTS "Users manage own custom agents" ON public.user_custom_agents;

CREATE POLICY "Users manage own custom agents"
  ON public.user_custom_agents FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Idempotent: ensure built-in workflow templates stay selectable in UI if older DB missed prior migration
UPDATE public.workflow_templates
SET status = 'active'
WHERE name IN ('Research Agent', 'Lead Follow-up Agent');
