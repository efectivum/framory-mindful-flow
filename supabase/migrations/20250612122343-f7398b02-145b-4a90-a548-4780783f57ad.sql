
-- Create table for storing weekly AI insights
CREATE TABLE public.weekly_insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  week_start_date DATE NOT NULL,
  week_end_date DATE NOT NULL,
  insights JSONB NOT NULL DEFAULT '{}'::jsonb,
  emotional_summary TEXT,
  key_patterns TEXT[],
  recommendations TEXT[],
  growth_observations TEXT[],
  entry_count INTEGER NOT NULL DEFAULT 0,
  average_mood NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security
ALTER TABLE public.weekly_insights ENABLE ROW LEVEL SECURITY;

-- Create policies for weekly_insights
CREATE POLICY "Users can view their own weekly insights" 
  ON public.weekly_insights 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own weekly insights" 
  ON public.weekly_insights 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weekly insights" 
  ON public.weekly_insights 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create table for storing quick analysis results
CREATE TABLE public.entry_quick_analysis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entry_id UUID REFERENCES public.journal_entries(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  quick_takeaways TEXT[] NOT NULL DEFAULT '{}',
  emotional_insights TEXT[],
  growth_indicators TEXT[],
  action_suggestions TEXT[],
  confidence_score NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security
ALTER TABLE public.entry_quick_analysis ENABLE ROW LEVEL SECURITY;

-- Create policies for entry_quick_analysis
CREATE POLICY "Users can view their own entry analysis" 
  ON public.entry_quick_analysis 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own entry analysis" 
  ON public.entry_quick_analysis 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Add index for better performance
CREATE INDEX idx_weekly_insights_user_date ON public.weekly_insights(user_id, week_start_date);
CREATE INDEX idx_entry_quick_analysis_entry ON public.entry_quick_analysis(entry_id);
