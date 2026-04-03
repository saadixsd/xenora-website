-- Optional free-text field for waitlist (replaces packing into focus_killer)
ALTER TABLE public.waitlist
ADD COLUMN IF NOT EXISTS biggest_pain text;
