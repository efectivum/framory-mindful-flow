
export interface HabitTemplate {
  id: string;
  title: string;
  description: string | null;
  category: string;
  estimated_duration_minutes: number | null;
  difficulty_level: string;
  is_coach_recommended: boolean;
  coach_context: string | null;
  created_at: string;
  updated_at: string;
}

export interface HabitStep {
  id: string;
  template_id: string;
  step_order: number;
  title: string;
  description: string | null;
  prompt_question: string | null;
  estimated_duration_minutes: number | null;
  is_optional: boolean;
  created_at: string;
}

export interface UserHabitRoutine {
  id: string;
  user_id: string;
  template_id: string;
  title: string;
  is_active: boolean;
  scheduled_time: string | null;
  current_streak: number;
  longest_streak: number;
  created_at: string;
  updated_at: string;
}

export interface RoutineCompletion {
  id: string;
  user_routine_id: string;
  user_id: string;
  completed_at: string;
  total_steps_completed: number;
  notes: string | null;
  mood_rating: number | null;
}

export interface StepCompletion {
  id: string;
  routine_completion_id: string;
  step_id: string;
  user_id: string;
  completed_at: string;
  reflection_response: string | null;
  duration_minutes: number | null;
}

export interface CreateUserRoutineInput {
  template_id: string;
  title?: string;
  scheduled_time?: string;
}

export interface CompleteRoutineInput {
  user_routine_id: string;
  step_completions: {
    step_id: string;
    reflection_response?: string;
    duration_minutes?: number;
  }[];
  notes?: string;
  mood_rating?: number;
}

export interface HabitTemplateWithSteps extends HabitTemplate {
  steps: HabitStep[];
}
