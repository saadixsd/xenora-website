
-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT,
  preferred_tone TEXT DEFAULT 'professional',
  default_audience TEXT DEFAULT 'founders',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create workflow_templates table
CREATE TABLE public.workflow_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Zap',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'coming_soon')),
  steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.workflow_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read templates" ON public.workflow_templates FOR SELECT TO authenticated USING (true);

-- Seed 3 templates
INSERT INTO public.workflow_templates (name, description, icon, status, steps) VALUES
  ('Content Agent', 'Turn a raw founder thought into publish-ready content: X post, hooks, LinkedIn post, and CTA.', 'PenLine', 'active', '["input_received","classifying","generating","formatting","done"]'::jsonb),
  ('Research Agent', 'Deep-dive into a topic, competitor, or market and get a structured brief.', 'Search', 'coming_soon', '["input_received","researching","analyzing","summarizing","done"]'::jsonb),
  ('Lead Follow-up Agent', 'Draft personalized follow-up emails from meeting notes or lead info.', 'Mail', 'coming_soon', '["input_received","parsing","drafting","personalizing","done"]'::jsonb);

-- Create workflow_runs table
CREATE TABLE public.workflow_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  template_id UUID REFERENCES public.workflow_templates(id) NOT NULL,
  input_text TEXT NOT NULL,
  goal TEXT,
  tone TEXT DEFAULT 'professional',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  current_step TEXT DEFAULT 'input_received',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.workflow_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own runs" ON public.workflow_runs FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own runs" ON public.workflow_runs FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own runs" ON public.workflow_runs FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Create workflow_outputs table
CREATE TABLE public.workflow_outputs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID REFERENCES public.workflow_runs(id) ON DELETE CASCADE NOT NULL,
  output_type TEXT NOT NULL CHECK (output_type IN ('x_post', 'hook', 'linkedin_post', 'cta')),
  content TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.workflow_outputs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own outputs" ON public.workflow_outputs FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.workflow_runs WHERE id = run_id AND user_id = auth.uid())
);
CREATE POLICY "Users can insert own outputs" ON public.workflow_outputs FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.workflow_runs WHERE id = run_id AND user_id = auth.uid())
);

-- Enable realtime for workflow_runs
ALTER PUBLICATION supabase_realtime ADD TABLE public.workflow_runs;
