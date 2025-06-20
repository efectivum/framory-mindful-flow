
-- Create user onboarding progress tracking table
CREATE TABLE public.user_onboarding (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  completed_steps TEXT[] DEFAULT '{}',
  current_step TEXT DEFAULT 'welcome',
  tour_completed BOOLEAN DEFAULT false,
  onboarding_completed BOOLEAN DEFAULT false,
  completion_percentage INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create achievements/milestones table
CREATE TABLE public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  achievement_type TEXT NOT NULL,
  achievement_key TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_seen BOOLEAN DEFAULT false,
  icon TEXT,
  category TEXT DEFAULT 'general',
  UNIQUE(user_id, achievement_key)
);

-- Create user feedback table
CREATE TABLE public.user_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  feedback_type TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  message TEXT,
  feature_context TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sample content templates table
CREATE TABLE public.sample_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL, -- 'journal', 'habit', 'goal'
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  description TEXT,
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.user_onboarding ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sample_templates ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_onboarding
CREATE POLICY "Users can view their own onboarding progress" 
  ON public.user_onboarding FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own onboarding progress" 
  ON public.user_onboarding FOR ALL 
  USING (auth.uid() = user_id);

-- RLS policies for user_achievements
CREATE POLICY "Users can view their own achievements" 
  ON public.user_achievements FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own achievements" 
  ON public.user_achievements FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert achievements" 
  ON public.user_achievements FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- RLS policies for user_feedback
CREATE POLICY "Users can manage their own feedback" 
  ON public.user_feedback FOR ALL 
  USING (auth.uid() = user_id);

-- RLS policies for sample_templates (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view sample templates" 
  ON public.sample_templates FOR SELECT 
  TO authenticated 
  USING (is_active = true);

-- Create trigger for updating updated_at column
CREATE TRIGGER update_user_onboarding_updated_at
  BEFORE UPDATE ON public.user_onboarding
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample templates for new users
INSERT INTO public.sample_templates (type, title, content, description, category, sort_order) VALUES
  ('journal', 'My First Day', 'Today marks the beginning of my personal growth journey. I feel excited and ready to explore my thoughts and emotions through journaling.

What I''m grateful for:
- This opportunity to start fresh
- The time I''m dedicating to self-reflection
- The support system around me

My intention for this journey:
To become more mindful and intentional in my daily life.', 'A welcoming first journal entry to get started', 'getting_started', 1),
  
  ('journal', 'Reflection on Today', 'Today was a day of small victories and learning moments.

What went well:
- I took time for myself this morning
- I was present during conversations
- I made progress on my goals

What I learned:
- It''s okay to take things one step at a time
- Small actions can lead to big changes

Tomorrow I will:
- Continue building on today''s momentum
- Be kind to myself if things don''t go as planned', 'A template for daily reflection', 'daily_reflection', 2),
  
  ('habit', 'Morning Meditation', 'Start each day with 5-10 minutes of mindfulness meditation to center yourself and set positive intentions.', 'Build a consistent morning mindfulness practice', 'mindfulness', 1),
  
  ('habit', 'Evening Gratitude', 'Before bed, write down three things you''re grateful for from the day.', 'Cultivate gratitude and positive thinking', 'gratitude', 2),
  
  ('habit', 'Daily Movement', 'Incorporate at least 20 minutes of physical activity into your day, whether it''s walking, stretching, or exercise.', 'Maintain physical health and energy', 'health', 3);

-- Create function to initialize user onboarding
CREATE OR REPLACE FUNCTION public.initialize_user_onboarding(user_id_param UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.user_onboarding (user_id, current_step, completed_steps, completion_percentage)
  VALUES (user_id_param, 'welcome', '{}', 0)
  ON CONFLICT (user_id) DO NOTHING;
END;
$$;

-- Create function to check and award achievements
CREATE OR REPLACE FUNCTION public.check_achievements(user_id_param UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  entry_count INTEGER;
  habit_count INTEGER;
  streak_count INTEGER;
BEGIN
  -- Count journal entries
  SELECT COUNT(*) INTO entry_count
  FROM public.journal_entries 
  WHERE user_id = user_id_param AND deleted_at IS NULL;
  
  -- Count active habits
  SELECT COUNT(*) INTO habit_count
  FROM public.habits 
  WHERE user_id = user_id_param AND is_active = true;
  
  -- Get max streak
  SELECT COALESCE(MAX(current_streak), 0) INTO streak_count
  FROM public.habits 
  WHERE user_id = user_id_param;
  
  -- Award achievements based on milestones
  IF entry_count >= 1 THEN
    INSERT INTO public.user_achievements (user_id, achievement_type, achievement_key, title, description, icon, category)
    VALUES (user_id_param, 'milestone', 'first_entry', 'First Entry', 'You wrote your first journal entry!', '📝', 'journaling')
    ON CONFLICT (user_id, achievement_key) DO NOTHING;
  END IF;
  
  IF entry_count >= 7 THEN
    INSERT INTO public.user_achievements (user_id, achievement_type, achievement_key, title, description, icon, category)
    VALUES (user_id_param, 'milestone', 'week_writer', 'Week Writer', 'You''ve written 7 journal entries!', '🗓️', 'journaling')
    ON CONFLICT (user_id, achievement_key) DO NOTHING;
  END IF;
  
  IF habit_count >= 1 THEN
    INSERT INTO public.user_achievements (user_id, achievement_type, achievement_key, title, description, icon, category)
    VALUES (user_id_param, 'milestone', 'habit_starter', 'Habit Starter', 'You created your first habit!', '🎯', 'habits')
    ON CONFLICT (user_id, achievement_key) DO NOTHING;
  END IF;
  
  IF streak_count >= 7 THEN
    INSERT INTO public.user_achievements (user_id, achievement_type, achievement_key, title, description, icon, category)
    VALUES (user_id_param, 'milestone', 'week_streak', 'Week Streak', 'You maintained a 7-day habit streak!', '🔥', 'habits')
    ON CONFLICT (user_id, achievement_key) DO NOTHING;
  END IF;
END;
$$;
