
-- Create habit templates table for structured routines
CREATE TABLE public.habit_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'wellness',
  estimated_duration_minutes INTEGER,
  difficulty_level TEXT NOT NULL DEFAULT 'beginner',
  is_coach_recommended BOOLEAN NOT NULL DEFAULT false,
  coach_context TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create habit steps table for individual steps within routines
CREATE TABLE public.habit_steps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID REFERENCES public.habit_templates(id) ON DELETE CASCADE,
  step_order INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  prompt_question TEXT,
  estimated_duration_minutes INTEGER,
  is_optional BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user habit routines table (instances of templates for users)
CREATE TABLE public.user_habit_routines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  template_id UUID REFERENCES public.habit_templates(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  scheduled_time TIME,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create routine completions table for tracking full routine completions
CREATE TABLE public.routine_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_routine_id UUID REFERENCES public.user_habit_routines(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  total_steps_completed INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  mood_rating INTEGER
);

-- Create step completions table for tracking individual step completions
CREATE TABLE public.step_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  routine_completion_id UUID REFERENCES public.routine_completions(id) ON DELETE CASCADE,
  step_id UUID REFERENCES public.habit_steps(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reflection_response TEXT,
  duration_minutes INTEGER
);

-- Enable Row Level Security
ALTER TABLE public.habit_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_habit_routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routine_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.step_completions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for habit_templates (readable by all, manageable by admins)
CREATE POLICY "Anyone can view habit templates" ON public.habit_templates FOR SELECT USING (true);
CREATE POLICY "Admins can manage habit templates" ON public.habit_templates FOR ALL USING (
  EXISTS (SELECT 1 FROM public.admin_roles WHERE user_id = auth.uid())
);

-- Create RLS policies for habit_steps (readable by all, manageable by admins)
CREATE POLICY "Anyone can view habit steps" ON public.habit_steps FOR SELECT USING (true);
CREATE POLICY "Admins can manage habit steps" ON public.habit_steps FOR ALL USING (
  EXISTS (SELECT 1 FROM public.admin_roles WHERE user_id = auth.uid())
);

-- Create RLS policies for user_habit_routines
CREATE POLICY "Users can view their own routines" ON public.user_habit_routines 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own routines" ON public.user_habit_routines 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own routines" ON public.user_habit_routines 
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own routines" ON public.user_habit_routines 
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for routine_completions
CREATE POLICY "Users can view their own routine completions" ON public.routine_completions 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own routine completions" ON public.routine_completions 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own routine completions" ON public.routine_completions 
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for step_completions
CREATE POLICY "Users can view their own step completions" ON public.step_completions 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own step completions" ON public.step_completions 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own step completions" ON public.step_completions 
  FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_habit_steps_template_id ON public.habit_steps(template_id);
CREATE INDEX idx_habit_steps_order ON public.habit_steps(template_id, step_order);
CREATE INDEX idx_user_routines_user_id ON public.user_habit_routines(user_id);
CREATE INDEX idx_routine_completions_user_id ON public.routine_completions(user_id);
CREATE INDEX idx_routine_completions_date ON public.routine_completions(user_id, completed_at);
CREATE INDEX idx_step_completions_routine_id ON public.step_completions(routine_completion_id);

-- Insert the morning routine template based on the coach recommendation
INSERT INTO public.habit_templates (title, description, category, estimated_duration_minutes, difficulty_level, is_coach_recommended, coach_context) 
VALUES (
  'Energizing Morning Routine', 
  'A comprehensive morning routine designed to start your day with intention, gratitude, and energy. Includes hydration, movement, mindfulness, journaling, and planning.',
  'wellness',
  55,
  'beginner',
  true,
  'Tailored morning routine that aligns with your goals and emotional needs'
);

-- Insert the morning routine steps
INSERT INTO public.habit_steps (template_id, step_order, title, description, prompt_question, estimated_duration_minutes, is_optional) 
VALUES 
  ((SELECT id FROM public.habit_templates WHERE title = 'Energizing Morning Routine'), 1, 'Wake Up & Gratitude', 'Start your day by acknowledging something positive', 'What is one thing I''m grateful for today?', 5, false),
  ((SELECT id FROM public.habit_templates WHERE title = 'Energizing Morning Routine'), 2, 'Hydrate', 'Drink a glass of water to kickstart your metabolism', null, 5, false),
  ((SELECT id FROM public.habit_templates WHERE title = 'Energizing Morning Routine'), 3, 'Movement', 'Engage in 10-15 minutes of light stretching or a quick workout', 'How does my body feel? What type of movement energizes me today?', 15, false),
  ((SELECT id FROM public.habit_templates WHERE title = 'Energizing Morning Routine'), 4, 'Mindfulness', 'Spend 5-10 minutes in meditation or deep breathing', 'What thoughts or feelings am I noticing right now?', 10, false),
  ((SELECT id FROM public.habit_templates WHERE title = 'Energizing Morning Routine'), 5, 'Journaling', 'Write for 10-15 minutes about your intentions for the day', 'What are three things I want to accomplish today? What challenges might I face?', 15, false),
  ((SELECT id FROM public.habit_templates WHERE title = 'Energizing Morning Routine'), 6, 'Planning', 'Review your tasks and prioritize them', 'What is the most important thing I need to focus on today?', 5, false);

-- Create function to update routine streaks
CREATE OR REPLACE FUNCTION public.update_routine_streak(user_routine_id_param uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  latest_completion timestamp with time zone;
  streak_count integer := 0;
  current_date_check date;
BEGIN
  -- Get the latest completion for this routine
  SELECT completed_at INTO latest_completion
  FROM public.routine_completions 
  WHERE user_routine_id = user_routine_id_param 
  ORDER BY completed_at DESC 
  LIMIT 1;

  -- If no completions, set streak to 0
  IF latest_completion IS NULL THEN
    UPDATE public.user_habit_routines 
    SET current_streak = 0, updated_at = now()
    WHERE id = user_routine_id_param;
    RETURN;
  END IF;

  -- Calculate streak from latest completion backwards
  current_date_check := latest_completion::date;
  
  WHILE EXISTS (
    SELECT 1 FROM public.routine_completions 
    WHERE user_routine_id = user_routine_id_param 
    AND completed_at::date = current_date_check
  ) LOOP
    streak_count := streak_count + 1;
    current_date_check := current_date_check - interval '1 day';
  END LOOP;

  -- Update the routine with new streak
  UPDATE public.user_habit_routines 
  SET 
    current_streak = streak_count,
    longest_streak = GREATEST(longest_streak, streak_count),
    updated_at = now()
  WHERE id = user_routine_id_param;
END;
$$;

-- Create trigger to automatically update streaks
CREATE OR REPLACE FUNCTION public.trigger_update_routine_streak()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.update_routine_streak(NEW.user_routine_id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_routine_streak_trigger
  AFTER INSERT ON public.routine_completions
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_update_routine_streak();
