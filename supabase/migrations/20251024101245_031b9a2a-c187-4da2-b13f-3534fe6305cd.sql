-- Create iq_test_results table
CREATE TABLE public.iq_test_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  total_score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  feedback TEXT
);

-- Enable Row Level Security
ALTER TABLE public.iq_test_results ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view own IQ test results" 
ON public.iq_test_results 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own IQ test results" 
ON public.iq_test_results 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);