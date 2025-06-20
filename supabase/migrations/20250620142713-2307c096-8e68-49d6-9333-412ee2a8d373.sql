
-- Create coaching effectiveness tracking tables
CREATE TABLE public.coaching_effectiveness (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  interaction_id UUID REFERENCES public.coaching_interactions(id),
  intervention_type TEXT NOT NULL,
  success_metric TEXT NOT NULL,
  baseline_value NUMERIC,
  follow_up_value NUMERIC,
  improvement_percentage NUMERIC,
  time_to_improvement INTERVAL,
  user_satisfaction_rating INTEGER CHECK (user_satisfaction_rating BETWEEN 1 AND 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  measured_at TIMESTAMP WITH TIME ZONE
);

-- Create coaching learning profiles
CREATE TABLE public.coaching_learning_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  effective_intervention_types JSONB DEFAULT '[]'::jsonb,
  preferred_communication_styles JSONB DEFAULT '{}'::jsonb,
  response_patterns JSONB DEFAULT '{}'::jsonb,
  optimal_timing_preferences JSONB DEFAULT '{}'::jsonb,
  protocol_success_rates JSONB DEFAULT '{}'::jsonb,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  learning_confidence NUMERIC DEFAULT 0.1,
  total_interactions INTEGER DEFAULT 0,
  successful_interventions INTEGER DEFAULT 0
);

-- Create scientific protocols table
CREATE TABLE public.scientific_protocols (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  protocol_name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'sleep', 'stress', 'focus', 'habit_formation', 'exercise'
  source TEXT NOT NULL, -- 'huberman_lab', 'atomic_habits', 'cbt', 'custom'
  description TEXT NOT NULL,
  implementation_steps JSONB NOT NULL,
  target_conditions JSONB NOT NULL, -- when to suggest this protocol
  expected_timeline TEXT,
  success_metrics JSONB NOT NULL,
  contraindications JSONB DEFAULT '[]'::jsonb,
  evidence_level TEXT DEFAULT 'peer_reviewed',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);

-- Create coaching protocol applications table
CREATE TABLE public.coaching_protocol_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  protocol_id UUID REFERENCES public.scientific_protocols(id) NOT NULL,
  interaction_id UUID REFERENCES public.coaching_interactions(id),
  applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_feedback_rating INTEGER CHECK (user_feedback_rating BETWEEN 1 AND 5),
  adherence_percentage NUMERIC,
  outcome_measured BOOLEAN DEFAULT false,
  outcome_value NUMERIC,
  notes TEXT
);

-- Create adaptive coaching rules table
CREATE TABLE public.adaptive_coaching_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rule_name TEXT NOT NULL,
  condition_criteria JSONB NOT NULL, -- conditions that trigger this rule
  coaching_adjustments JSONB NOT NULL, -- what adjustments to make
  success_threshold NUMERIC DEFAULT 0.7,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  priority_level INTEGER DEFAULT 1
);

-- Add RLS policies
ALTER TABLE public.coaching_effectiveness ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coaching_learning_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scientific_protocols ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coaching_protocol_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adaptive_coaching_rules ENABLE ROW LEVEL SECURITY;

-- Coaching effectiveness policies
CREATE POLICY "Users can view their own coaching effectiveness" 
  ON public.coaching_effectiveness 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own coaching effectiveness records" 
  ON public.coaching_effectiveness 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own coaching effectiveness records" 
  ON public.coaching_effectiveness 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Coaching learning profiles policies
CREATE POLICY "Users can view their own learning profile" 
  ON public.coaching_learning_profiles 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own learning profile" 
  ON public.coaching_learning_profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own learning profile" 
  ON public.coaching_learning_profiles 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Scientific protocols policies (read-only for users)
CREATE POLICY "Users can view active scientific protocols" 
  ON public.scientific_protocols 
  FOR SELECT 
  USING (is_active = true);

-- Protocol applications policies
CREATE POLICY "Users can view their own protocol applications" 
  ON public.coaching_protocol_applications 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own protocol applications" 
  ON public.coaching_protocol_applications 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own protocol applications" 
  ON public.coaching_protocol_applications 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Adaptive coaching rules policies (read-only for users)
CREATE POLICY "Users can view active adaptive coaching rules" 
  ON public.adaptive_coaching_rules 
  FOR SELECT 
  USING (is_active = true);

-- Add updated_at trigger for learning profiles
CREATE TRIGGER update_coaching_learning_profiles_updated_at
  BEFORE UPDATE ON public.coaching_learning_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_coaching_effectiveness_user_id ON public.coaching_effectiveness(user_id);
CREATE INDEX idx_coaching_effectiveness_interaction_id ON public.coaching_effectiveness(interaction_id);
CREATE INDEX idx_coaching_learning_profiles_user_id ON public.coaching_learning_profiles(user_id);
CREATE INDEX idx_scientific_protocols_category ON public.scientific_protocols(category);
CREATE INDEX idx_scientific_protocols_source ON public.scientific_protocols(source);
CREATE INDEX idx_coaching_protocol_applications_user_id ON public.coaching_protocol_applications(user_id);
CREATE INDEX idx_coaching_protocol_applications_protocol_id ON public.coaching_protocol_applications(protocol_id);
CREATE INDEX idx_adaptive_coaching_rules_active ON public.adaptive_coaching_rules(is_active);

-- Insert initial scientific protocols
INSERT INTO public.scientific_protocols (protocol_name, category, source, description, implementation_steps, target_conditions, success_metrics, expected_timeline) VALUES
('Huberman Sleep Protocol', 'sleep', 'huberman_lab', 'Science-based sleep optimization protocol', 
 '["Get sunlight within 1 hour of waking", "Avoid caffeine 8-12 hours before bed", "Keep room cool (65-68°F)", "Use blackout curtains", "No screens 1 hour before bed"]'::jsonb,
 '{"conditions": ["poor_sleep", "sleep_anxiety", "irregular_schedule"], "mood_indicators": ["fatigue", "low_energy"]}'::jsonb,
 '["sleep_quality_rating", "time_to_fall_asleep", "wake_up_energy_level"]'::jsonb,
 '2-4 weeks'),

('Atomic Habits Tiny Changes', 'habit_formation', 'atomic_habits', 'Start with 2-minute version of desired habit', 
 '["Identify desired habit", "Reduce to 2-minute version", "Stack with existing habit", "Track completion", "Celebrate small wins"]'::jsonb,
 '{"conditions": ["habit_formation_difficulty", "procrastination", "overwhelm"], "patterns": ["failed_previous_attempts"]}'::jsonb,
 '["consistency_percentage", "habit_stack_success", "motivation_level"]'::jsonb,
 '21-66 days'),

('Box Breathing for Stress', 'stress', 'huberman_lab', 'Physiological sigh for immediate stress relief', 
 '["Inhale for 4 counts", "Hold for 4 counts", "Exhale for 4 counts", "Hold empty for 4 counts", "Repeat 4-8 cycles"]'::jsonb,
 '{"conditions": ["acute_stress", "anxiety", "overwhelm"], "emotions": ["stressed", "anxious", "panicked"]}'::jsonb,
 '["stress_level_before_after", "heart_rate_variability", "subjective_calm_rating"]'::jsonb,
 'Immediate (2-5 minutes)'),

('Huberman Focus Protocol', 'focus', 'huberman_lab', 'Enhance focus through deliberate attention training', 
 '["Remove distractions", "Set 90-minute focus block", "Take 17-minute break", "Practice visual focus exercises", "Track attention span"]'::jsonb,
 '{"conditions": ["poor_concentration", "distraction", "productivity_issues"], "patterns": ["short_attention_span"]}'::jsonb,
 '["focus_duration", "task_completion_rate", "distraction_frequency"]'::jsonb,
 '2-3 weeks'),

('CBT Thought Record', 'stress', 'cbt', 'Cognitive restructuring for negative thought patterns', 
 '["Identify triggering situation", "Notice automatic thoughts", "Recognize emotions", "Examine evidence", "Develop balanced perspective"]'::jsonb,
 '{"conditions": ["negative_thinking", "cognitive_distortions", "depression", "anxiety"], "emotions": ["hopeless", "worthless", "catastrophic"]}'::jsonb,
 '["thought_pattern_awareness", "emotional_regulation", "cognitive_flexibility"]'::jsonb,
 '4-6 weeks');

-- Insert initial adaptive coaching rules
INSERT INTO public.adaptive_coaching_rules (rule_name, condition_criteria, coaching_adjustments, priority_level) VALUES
('High Stress Response', 
 '{"stress_indicators": ["overwhelmed", "anxious", "burned_out"], "intervention_history": "low_success_rate"}'::jsonb,
 '{"tone": "extra_gentle", "suggestion_frequency": "reduced", "focus": "stress_management", "protocol_preference": "breathing_techniques"}'::jsonb,
 1),

('Motivation Deficit Pattern', 
 '{"patterns": ["low_motivation", "procrastination"], "habit_completion": "below_50_percent"}'::jsonb,
 '{"approach": "micro_habits", "celebration_frequency": "increased", "goal_size": "minimal", "accountability": "enhanced"}'::jsonb,
 2),

('High Achiever Profile', 
 '{"habit_completion": "above_80_percent", "goal_achievement": "consistent", "feedback_preference": "direct"}'::jsonb,
 '{"challenge_level": "increased", "goal_scope": "expanded", "feedback_style": "achievement_focused", "protocol_complexity": "advanced"}'::jsonb,
 2);
