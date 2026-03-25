-- Add Nora agentic waitlist fields
ALTER TABLE public.waitlist
ADD COLUMN role text,
ADD COLUMN company_size text;

