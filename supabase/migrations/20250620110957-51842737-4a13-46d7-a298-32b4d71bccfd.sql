
-- Create challenges table to store challenge definitions
CREATE TABLE public.challenges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  duration_days INTEGER NOT NULL DEFAULT 7,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
  challenge_type TEXT NOT NULL DEFAULT 'habit',
  category TEXT NOT NULL DEFAULT 'wellness',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  -- Challenge content and structure
  what_included TEXT[] NOT NULL DEFAULT '{}',
  benefits TEXT[] NOT NULL DEFAULT '{}',
  daily_prompts TEXT[] DEFAULT '{}',
  tips TEXT[] DEFAULT '{}',
  -- Completion criteria
  completion_criteria JSONB DEFAULT '{}',
  -- Metadata
  participant_count INTEGER NOT NULL DEFAULT 0,
  success_rate NUMERIC DEFAULT 0
);

-- Create user_challenges table to track user participation
CREATE TABLE public.user_challenges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'abandoned')),
  enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  current_day INTEGER NOT NULL DEFAULT 1,
  total_completions INTEGER NOT NULL DEFAULT 0,
  -- Progress tracking
  daily_completions JSONB DEFAULT '{}', -- Store daily completion status
  notes TEXT,
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, challenge_id)
);

-- Create challenge_completions table for detailed tracking
CREATE TABLE public.challenge_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_challenge_id UUID NOT NULL REFERENCES public.user_challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completion_method TEXT NOT NULL DEFAULT 'manual', -- 'manual', 'automatic', 'journal'
  source_id UUID, -- Reference to journal entry or habit completion
  notes TEXT,
  mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 10),
  UNIQUE(user_challenge_id, day_number)
);

-- Add Row Level Security (RLS)
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_completions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for challenges (public read access)
CREATE POLICY "Anyone can view active challenges" 
  ON public.challenges 
  FOR SELECT 
  USING (is_active = true);

-- RLS Policies for user_challenges (user-specific access)
CREATE POLICY "Users can view their own challenges" 
  ON public.user_challenges 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own challenges" 
  ON public.user_challenges 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own challenges" 
  ON public.user_challenges 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- RLS Policies for challenge_completions (user-specific access)
CREATE POLICY "Users can view their own completions" 
  ON public.challenge_completions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own completions" 
  ON public.challenge_completions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own completions" 
  ON public.challenge_completions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_challenges_active ON public.challenges(is_active, category);
CREATE INDEX idx_user_challenges_user_status ON public.user_challenges(user_id, status);
CREATE INDEX idx_challenge_completions_user_challenge ON public.challenge_completions(user_challenge_id, day_number);

-- Insert sample journaling challenge
INSERT INTO public.challenges (
  title, 
  description, 
  duration_days, 
  difficulty, 
  challenge_type,
  category,
  what_included,
  benefits,
  daily_prompts,
  tips,
  completion_criteria
) VALUES (
  '7-Day Gratitude Challenge',
  'Practice daily gratitude for one week to build a positive mindset and improve mental well-being',
  7,
  'Beginner',
  'journaling',
  'mindfulness',
  ARRAY[
    'Daily gratitude prompts',
    'Guided reflection questions',
    'Progress tracking',
    'Mood monitoring',
    'Community support'
  ],
  ARRAY[
    'Improved mental well-being',
    'Better sleep quality',
    'Increased positive thinking',
    'Enhanced self-awareness',
    'Stronger resilience'
  ],
  ARRAY[
    'What are three things you''re grateful for today?',
    'Who made a positive impact on your day?',
    'What small moment brought you joy?',
    'What challenge helped you grow?',
    'What aspect of your health are you thankful for?',
    'What opportunity are you excited about?',
    'How did you make someone else''s day better?'
  ],
  ARRAY[
    'Write for at least 5 minutes each day',
    'Be specific about what you''re grateful for',
    'Focus on people, experiences, and personal growth',
    'Don''t worry about perfect grammar - just write',
    'Review your previous entries for patterns'
  ],
  '{"min_words": 50, "requires_journal_entry": true}'::jsonb
);

-- Insert more sample challenges
INSERT INTO public.challenges (title, description, duration_days, difficulty, challenge_type, category, what_included, benefits, completion_criteria) VALUES 
('Mindful Morning Routine', 'Start each day with intentional practices for 14 days', 14, 'Intermediate', 'habit', 'mindfulness', 
 ARRAY['Morning meditation guide', 'Breathing exercises', 'Intention setting', 'Progress tracking'], 
 ARRAY['Better focus', 'Reduced stress', 'More energy', 'Improved mood'], 
 '{"requires_morning_completion": true}'::jsonb),
('Digital Detox Weekend', 'Disconnect to reconnect with yourself over 2 days', 2, 'Advanced', 'lifestyle', 'wellness',
 ARRAY['Digital detox guide', 'Alternative activities', 'Reflection prompts', 'Support community'],
 ARRAY['Better sleep', 'Improved relationships', 'Increased creativity', 'Mental clarity'],
 '{"requires_offline_time": 8}'::jsonb);

-- Update participant counts (this would normally be done via triggers)
UPDATE public.challenges SET participant_count = 
  CASE 
    WHEN title = '7-Day Gratitude Challenge' THEN 1247
    WHEN title = 'Mindful Morning Routine' THEN 892
    WHEN title = 'Digital Detox Weekend' THEN 534
    ELSE 0
  END;
