-- Xenora Command Center: agents, feed_items, connections tables
-- Plus: update signup trigger to seed agents, add agent_id to workflow_runs, realtime

-- ── agents ───────────────────────────────────────────────────────────────────
CREATE TABLE public.agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('content', 'leads', 'research')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'running')),
  system_prompt TEXT NOT NULL DEFAULT '',
  tone TEXT NOT NULL DEFAULT 'professional',
  response_depth FLOAT NOT NULL DEFAULT 0.5,
  tools JSONB NOT NULL DEFAULT '[]'::jsonb,
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  last_run_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, type)
);

ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own agents"
  ON public.agents FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ── feed_items ───────────────────────────────────────────────────────────────
CREATE TABLE public.feed_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  agent_id UUID REFERENCES public.agents(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  action_type TEXT NOT NULL DEFAULT 'info' CHECK (action_type IN ('approve', 'done', 'info')),
  action_payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

ALTER TABLE public.feed_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own feed items"
  ON public.feed_items FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX feed_items_user_created ON public.feed_items (user_id, created_at DESC);

-- ── connections (schema only, OAuth deferred) ────────────────────────────────
CREATE TABLE public.connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('gmail', 'x', 'instagram', 'linkedin')),
  status TEXT NOT NULL DEFAULT 'disconnected' CHECK (status IN ('connected', 'disconnected', 'expired')),
  scopes TEXT[],
  connected_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, platform)
);

ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own connections"
  ON public.connections FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ── Add agent_id to workflow_runs ────────────────────────────────────────────
ALTER TABLE public.workflow_runs
  ADD COLUMN IF NOT EXISTS agent_id UUID REFERENCES public.agents(id) ON DELETE SET NULL;

-- ── Realtime: agents + feed_items ────────────────────────────────────────────
ALTER PUBLICATION supabase_realtime ADD TABLE public.agents;
ALTER PUBLICATION supabase_realtime ADD TABLE public.feed_items;

-- ── Update signup trigger to seed 3 agents per user ─────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));

  INSERT INTO public.agents (user_id, type, system_prompt, tools) VALUES
    (NEW.id, 'content',
     'You are the Content Agent for a solo founder. Analyze raw thoughts and generate publish-ready social content: X posts, hooks, LinkedIn posts, and CTAs. Write in the founder''s voice. Be direct, sharp, no fluff.',
     '["x_api", "instagram_api", "linkedin_api"]'::jsonb),
    (NEW.id, 'leads',
     'You are the Leads Agent. Classify inbound messages (lead, reply-needed, newsletter, spam), summarize in one sentence, draft personalized replies, and queue 48-hour follow-ups. Nothing sends without user approval.',
     '["gmail_read", "gmail_send", "followup_timer"]'::jsonb),
    (NEW.id, 'research',
     'You are the Research Agent. Query public sources for pain signals, group by theme, score relevance, and surface content angles. Feed insights to the Content Agent and Leads Agent.',
     '["reddit_search", "x_search", "web_search"]'::jsonb);

  RETURN NEW;
END;
$$;

-- Seed agents for existing users who don't have them yet
INSERT INTO public.agents (user_id, type, system_prompt, tools)
SELECT u.id, t.type, t.prompt, t.tools::jsonb
FROM auth.users u
CROSS JOIN (VALUES
  ('content',
   'You are the Content Agent for a solo founder. Analyze raw thoughts and generate publish-ready social content: X posts, hooks, LinkedIn posts, and CTAs. Write in the founder''s voice. Be direct, sharp, no fluff.',
   '["x_api", "instagram_api", "linkedin_api"]'),
  ('leads',
   'You are the Leads Agent. Classify inbound messages (lead, reply-needed, newsletter, spam), summarize in one sentence, draft personalized replies, and queue 48-hour follow-ups. Nothing sends without user approval.',
   '["gmail_read", "gmail_send", "followup_timer"]'),
  ('research',
   'You are the Research Agent. Query public sources for pain signals, group by theme, score relevance, and surface content angles. Feed insights to the Content Agent and Leads Agent.',
   '["reddit_search", "x_search", "web_search"]')
) AS t(type, prompt, tools)
WHERE NOT EXISTS (
  SELECT 1 FROM public.agents a WHERE a.user_id = u.id AND a.type = t.type
);
