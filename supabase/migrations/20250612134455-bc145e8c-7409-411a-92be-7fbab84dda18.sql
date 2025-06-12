
-- Create table to track coaching interactions and patterns
CREATE TABLE public.coaching_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  entry_id UUID REFERENCES public.journal_entries(id) ON DELETE CASCADE,
  response_level INTEGER NOT NULL CHECK (response_level IN (1, 2, 3)),
  response_type TEXT NOT NULL,
  response_content TEXT NOT NULL,
  pattern_detected TEXT,
  confidence_score NUMERIC,
  user_engaged BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table to track user patterns for Level 2 insights
CREATE TABLE public.user_patterns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  pattern_type TEXT NOT NULL, -- 'emotion_frequency', 'time_pattern', 'mood_correlation', etc.
  pattern_key TEXT NOT NULL, -- the specific pattern (e.g., 'frustrated', 'thursday_afternoon')
  pattern_value JSONB NOT NULL DEFAULT '{}', -- pattern data and metadata
  occurrence_count INTEGER NOT NULL DEFAULT 1,
  confidence_level NUMERIC NOT NULL DEFAULT 0,
  last_detected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, pattern_type, pattern_key)
);

-- Create table to track coaching cooldowns and intervention history
CREATE TABLE public.coaching_state (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  last_level_2_response TIMESTAMP WITH TIME ZONE,
  last_level_3_response TIMESTAMP WITH TIME ZONE,
  level_2_count_this_week INTEGER NOT NULL DEFAULT 0,
  level_3_count_this_week INTEGER NOT NULL DEFAULT 0,
  week_start_date DATE NOT NULL DEFAULT date_trunc('week', now())::date,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on coaching tables
ALTER TABLE public.coaching_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coaching_state ENABLE ROW LEVEL SECURITY;

-- RLS policies for coaching_interactions
CREATE POLICY "Users can view their own coaching interactions" 
  ON public.coaching_interactions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own coaching interactions" 
  ON public.coaching_interactions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own coaching interactions" 
  ON public.coaching_interactions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- RLS policies for user_patterns
CREATE POLICY "Users can view their own patterns" 
  ON public.user_patterns 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own patterns" 
  ON public.user_patterns 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own patterns" 
  ON public.user_patterns 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- RLS policies for coaching_state
CREATE POLICY "Users can view their own coaching state" 
  ON public.coaching_state 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own coaching state" 
  ON public.coaching_state 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own coaching state" 
  ON public.coaching_state 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Function to reset weekly coaching counts
CREATE OR REPLACE FUNCTION public.reset_weekly_coaching_counts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.coaching_state 
  SET 
    level_2_count_this_week = 0,
    level_3_count_this_week = 0,
    week_start_date = date_trunc('week', now())::date,
    updated_at = now()
  WHERE week_start_date < date_trunc('week', now())::date;
END;
$$;
