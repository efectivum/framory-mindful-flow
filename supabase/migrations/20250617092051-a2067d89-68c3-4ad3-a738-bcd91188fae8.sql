
-- Create a table for storing deep reflections
CREATE TABLE public.deep_reflections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entry_id UUID REFERENCES public.journal_entries(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reflection_content TEXT NOT NULL,
  probing_question TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.deep_reflections ENABLE ROW LEVEL SECURITY;

-- Create policies for deep reflections
CREATE POLICY "Users can view their own deep reflections" 
  ON public.deep_reflections 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own deep reflections" 
  ON public.deep_reflections 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own deep reflections" 
  ON public.deep_reflections 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own deep reflections" 
  ON public.deep_reflections 
  FOR DELETE 
  USING (auth.uid() = user_id);
