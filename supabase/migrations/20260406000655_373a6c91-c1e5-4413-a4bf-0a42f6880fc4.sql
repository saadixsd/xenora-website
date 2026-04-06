
-- Add missing columns to workflow_runs
ALTER TABLE public.workflow_runs 
  ADD COLUMN IF NOT EXISTS estimated_minutes_saved integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS archived_at timestamp with time zone DEFAULT NULL;

-- Create nora_query_logs table for daily query counting
CREATE TABLE IF NOT EXISTS public.nora_query_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  query_text text,
  agent_type text DEFAULT 'chat',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public.nora_query_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own logs" ON public.nora_query_logs FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Service role can insert logs" ON public.nora_query_logs FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Create nora_chat_sessions table
CREATE TABLE IF NOT EXISTS public.nora_chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  chat_kind text NOT NULL DEFAULT 'general',
  title text DEFAULT 'Chat',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public.nora_chat_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own sessions" ON public.nora_chat_sessions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sessions" ON public.nora_chat_sessions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own sessions" ON public.nora_chat_sessions FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Create nora_chat_messages table
CREATE TABLE IF NOT EXISTS public.nora_chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.nora_chat_sessions(id) ON DELETE CASCADE,
  role text NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public.nora_chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own messages" ON public.nora_chat_messages FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.nora_chat_sessions s WHERE s.id = nora_chat_messages.session_id AND s.user_id = auth.uid())
);
CREATE POLICY "Users can insert own messages" ON public.nora_chat_messages FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.nora_chat_sessions s WHERE s.id = nora_chat_messages.session_id AND s.user_id = auth.uid())
);
CREATE POLICY "Users can delete own messages" ON public.nora_chat_messages FOR DELETE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.nora_chat_sessions s WHERE s.id = nora_chat_messages.session_id AND s.user_id = auth.uid())
);

-- Create user_custom_agents table
CREATE TABLE IF NOT EXISTS public.user_custom_agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  mission text,
  target_user text,
  raw_inputs text,
  output_deliverables text,
  guardrails text,
  interview_summary text,
  starter_prompt text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public.user_custom_agents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own agents" ON public.user_custom_agents FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own agents" ON public.user_custom_agents FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own agents" ON public.user_custom_agents FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own agents" ON public.user_custom_agents FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Create get_daily_query_count function
CREATE OR REPLACE FUNCTION public.get_daily_query_count(p_user_id uuid)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(COUNT(*)::integer, 0)
  FROM public.nora_query_logs
  WHERE user_id = p_user_id
    AND created_at >= date_trunc('day', now() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC';
$$;

-- Allow workflow_runs delete for cleanup
CREATE POLICY "Users can delete own runs" ON public.workflow_runs FOR DELETE TO authenticated USING (auth.uid() = user_id);
