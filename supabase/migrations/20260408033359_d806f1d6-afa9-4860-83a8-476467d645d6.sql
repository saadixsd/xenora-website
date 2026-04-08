-- Tighten waitlist INSERT policy to validate required fields instead of blanket true
DROP POLICY IF EXISTS "Anyone can join waitlist" ON public.waitlist;
CREATE POLICY "Anyone can join waitlist" 
  ON public.waitlist 
  FOR INSERT 
  TO anon, authenticated 
  WITH CHECK (
    name IS NOT NULL AND length(trim(name)) > 0 
    AND email IS NOT NULL AND length(trim(email)) > 0
  );