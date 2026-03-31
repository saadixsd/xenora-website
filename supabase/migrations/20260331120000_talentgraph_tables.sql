-- TalentGraph demo tables (public insert only; no read access)

CREATE TABLE public.talentgraph_searches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT,
  exemplar_handles TEXT[] NOT NULL DEFAULT '{}'::text[],
  taste_profile JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.talentgraph_candidates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  search_id UUID NOT NULL REFERENCES public.talentgraph_searches(id) ON DELETE CASCADE,
  github_username TEXT NOT NULL,
  score INTEGER,
  score_breakdown JSONB,
  why_this_one TEXT,
  red_flags JSONB,
  raw_profile JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.talentgraph_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.talentgraph_candidates ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for demo). No select/update/delete (private).
CREATE POLICY "Anyone can insert talentgraph searches"
ON public.talentgraph_searches
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Anyone can insert talentgraph candidates"
ON public.talentgraph_candidates
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

