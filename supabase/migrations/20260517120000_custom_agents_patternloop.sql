-- PatternLoop traceability on custom agents (imported .agent bundles).
ALTER TABLE public.user_custom_agents
  ADD COLUMN IF NOT EXISTS pattern_name text,
  ADD COLUMN IF NOT EXISTS loopspec_hash text;

COMMENT ON COLUMN public.user_custom_agents.pattern_name IS 'PatternLoop pattern stem, e.g. content_outline';
COMMENT ON COLUMN public.user_custom_agents.loopspec_hash IS 'SHA-256 of imported LoopSpec content for versioning';
