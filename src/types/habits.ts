
export interface Habit {
  id: string;
  title: string;
  description: string | null;
  frequency_type: 'daily' | 'weekly' | 'custom';
  frequency_value: number;
  target_days: number;
  current_streak: number;
  longest_streak: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface HabitCompletion {
  id: string;
  habit_id: string;
  completed_at: string;
  notes: string | null;
  mood_rating: number | null;
}

export interface CreateHabitInput {
  title: string;
  description: string | null;
  frequency_type: 'daily' | 'weekly' | 'custom';
  frequency_value: number;
  target_days: number;
  is_active: boolean;
}

export interface UpdateHabitInput {
  title?: string;
  description?: string | null;
  frequency_type?: 'daily' | 'weekly' | 'custom';
  frequency_value?: number;
  target_days?: number;
  is_active?: boolean;
}

export interface CompleteHabitInput {
  habitId: string;
  notes?: string;
  moodRating?: number;
}
