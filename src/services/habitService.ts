
import { supabase } from '@/integrations/supabase/client';
import type { Habit, CreateHabitInput, UpdateHabitInput, CompleteHabitInput } from '@/types/habits';

export const logActivity = async (userId: string, type: string, title: string, content: string, metadata = {}) => {
  await supabase
    .from('user_activities')
    .insert([{
      user_id: userId,
      type,
      source: 'website',
      title,
      content,
      metadata
    }]);
};

export const fetchHabits = async (userId: string): Promise<Habit[]> => {
  if (!userId) return [];
  
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Habit[];
};

export const createHabit = async (userId: string, newHabit: CreateHabitInput): Promise<Habit> => {
  const { data, error } = await supabase
    .from('habits')
    .insert([{ ...newHabit, user_id: userId }])
    .select()
    .single();

  if (error) throw error;

  // Log activity
  await logActivity(
    userId,
    'habit',
    'New Habit Created',
    `Created a new habit: ${newHabit.title}`,
    { habit_id: data.id, frequency_type: newHabit.frequency_type }
  );

  return data;
};

export const updateHabit = async (userId: string, habitId: string, updates: UpdateHabitInput): Promise<Habit> => {
  const { data, error } = await supabase
    .from('habits')
    .update(updates)
    .eq('id', habitId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;

  // Log activity
  await logActivity(
    userId,
    'habit',
    'Habit Updated',
    `Updated habit: ${data.title}`,
    { habit_id: habitId, changes: updates }
  );

  return data;
};

export const deleteHabit = async (userId: string, habitId: string): Promise<void> => {
  // Get habit title for logging
  const { data: habit } = await supabase
    .from('habits')
    .select('title')
    .eq('id', habitId)
    .single();

  const { error } = await supabase
    .from('habits')
    .update({ is_active: false })
    .eq('id', habitId)
    .eq('user_id', userId);

  if (error) throw error;

  // Log activity
  if (habit) {
    await logActivity(
      userId,
      'habit',
      'Habit Deleted',
      `Deleted habit: ${habit.title}`,
      { habit_id: habitId }
    );
  }
};

export const completeHabit = async (userId: string, { habitId, notes, moodRating }: CompleteHabitInput) => {
  console.log('completeHabit service: Starting completion for habit:', habitId);
  
  // Get current date in user's timezone
  const now = new Date();
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  console.log('completeHabit service: User timezone:', userTimezone);
  
  // Create start and end of day in user's timezone
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  
  console.log('completeHabit service: Checking for existing completion between:', startOfDay.toISOString(), 'and', endOfDay.toISOString());

  // Check if already completed today with better date handling
  const { data: existingCompletion, error: checkError } = await supabase
    .from('habit_completions')
    .select('id')
    .eq('habit_id', habitId)
    .eq('user_id', userId)
    .gte('completed_at', startOfDay.toISOString())
    .lte('completed_at', endOfDay.toISOString())
    .maybeSingle();

  if (checkError) {
    console.log('completeHabit service: Error checking existing completion:', checkError);
    throw checkError;
  }

  if (existingCompletion) {
    console.log('completeHabit service: Habit already completed today');
    throw new Error('Habit already completed today');
  }

  console.log('completeHabit service: No existing completion found, proceeding with insert');

  // Get habit title for logging
  const { data: habit } = await supabase
    .from('habits')
    .select('title')
    .eq('id', habitId)
    .single();

  // Insert the completion
  const { data, error } = await supabase
    .from('habit_completions')
    .insert([{
      habit_id: habitId,
      user_id: userId,
      notes,
      mood_rating: moodRating,
      completed_at: now.toISOString()
    }])
    .select()
    .single();

  if (error) {
    console.log('completeHabit service: Error inserting completion:', error);
    throw error;
  }

  console.log('completeHabit service: Successfully inserted completion:', data);

  // Log activity
  if (habit) {
    const activityContent = notes 
      ? `Completed ${habit.title} with note: ${notes.substring(0, 100)}${notes.length > 100 ? '...' : ''}`
      : `Completed ${habit.title}`;
    
    await logActivity(
      userId,
      'habit',
      'Habit Completed',
      activityContent,
      { 
        habit_id: habitId, 
        mood_rating: moodRating, 
        has_notes: !!notes 
      }
    );
  }

  return data;
};

export const fetchTodayCompletions = async (userId: string): Promise<string[]> => {
  console.log('fetchTodayCompletions service: Starting fetch');
  
  if (!userId) {
    console.log('fetchTodayCompletions service: No user found');
    return [];
  }
  
  // Get current date in user's timezone
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  
  console.log('fetchTodayCompletions service: Fetching completions between:', startOfDay.toISOString(), 'and', endOfDay.toISOString());

  const { data, error } = await supabase
    .from('habit_completions')
    .select('habit_id')
    .eq('user_id', userId)
    .gte('completed_at', startOfDay.toISOString())
    .lte('completed_at', endOfDay.toISOString());

  if (error) {
    console.log('fetchTodayCompletions service: Error:', error);
    throw error;
  }
  
  const completions = data.map(completion => completion.habit_id);
  console.log('fetchTodayCompletions service: Found completions:', completions);
  return completions;
};
