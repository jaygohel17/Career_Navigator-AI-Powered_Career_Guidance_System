-- Remove resume-related columns from profiles table
ALTER TABLE public.profiles 
DROP COLUMN IF EXISTS resume_url;

-- Drop resume_analyses table
DROP TABLE IF EXISTS public.resume_analyses;