DROP POLICY IF EXISTS "No one can read waitlist" ON public.waitlist;

CREATE POLICY "No one can read waitlist"
ON public.waitlist
FOR SELECT
TO anon, authenticated
USING (false);