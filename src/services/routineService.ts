
import { supabase } from '@/integrations/supabase/client';
import type { 
  HabitTemplate, 
  HabitStep, 
  UserHabitRoutine, 
  RoutineCompletion,
  StepCompletion,
  CreateUserRoutineInput, 
  CompleteRoutineInput,
  HabitTemplateWithSteps
} from '@/types/routines';

export const fetchHabitTemplates = async (): Promise<HabitTemplate[]> => {
  const { data, error } = await supabase
    .from('habit_templates')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as HabitTemplate[];
};

export const fetchHabitTemplateWithSteps = async (templateId: string): Promise<HabitTemplateWithSteps | null> => {
  const { data: template, error: templateError } = await supabase
    .from('habit_templates')
    .select('*')
    .eq('id', templateId)
    .single();

  if (templateError) throw templateError;

  const { data: steps, error: stepsError } = await supabase
    .from('habit_steps')
    .select('*')
    .eq('template_id', templateId)
    .order('step_order', { ascending: true });

  if (stepsError) throw stepsError;

  return {
    ...template,
    steps: steps as HabitStep[]
  } as HabitTemplateWithSteps;
};

export const fetchUserRoutines = async (userId: string): Promise<UserHabitRoutine[]> => {
  if (!userId) return [];
  
  const { data, error } = await supabase
    .from('user_habit_routines')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as UserHabitRoutine[];
};

export const createUserRoutine = async (
  userId: string, 
  input: CreateUserRoutineInput
): Promise<UserHabitRoutine> => {
  // Get template details for default title
  const { data: template } = await supabase
    .from('habit_templates')
    .select('title')
    .eq('id', input.template_id)
    .single();

  const { data, error } = await supabase
    .from('user_habit_routines')
    .insert([{
      user_id: userId,
      template_id: input.template_id,
      title: input.title || template?.title || 'My Routine',
      scheduled_time: input.scheduled_time
    }])
    .select()
    .single();

  if (error) throw error;
  return data as UserHabitRoutine;
};

export const completeRoutine = async (
  userId: string, 
  input: CompleteRoutineInput
): Promise<RoutineCompletion> => {
  // Create routine completion
  const { data: completion, error: completionError } = await supabase
    .from('routine_completions')
    .insert([{
      user_routine_id: input.user_routine_id,
      user_id: userId,
      total_steps_completed: input.step_completions.length,
      notes: input.notes,
      mood_rating: input.mood_rating
    }])
    .select()
    .single();

  if (completionError) throw completionError;

  // Create step completions
  if (input.step_completions.length > 0) {
    const stepCompletions = input.step_completions.map(step => ({
      routine_completion_id: completion.id,
      step_id: step.step_id,
      user_id: userId,
      reflection_response: step.reflection_response,
      duration_minutes: step.duration_minutes
    }));

    const { error: stepError } = await supabase
      .from('step_completions')
      .insert(stepCompletions);

    if (stepError) throw stepError;
  }

  return completion as RoutineCompletion;
};

export const fetchTodayRoutineCompletions = async (userId: string): Promise<string[]> => {
  if (!userId) return [];
  
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  
  const { data, error } = await supabase
    .from('routine_completions')
    .select('user_routine_id')
    .eq('user_id', userId)
    .gte('completed_at', startOfDay.toISOString())
    .lte('completed_at', endOfDay.toISOString());

  if (error) throw error;
  
  return data.map(completion => completion.user_routine_id);
};

export const updateUserRoutine = async (
  userId: string,
  routineId: string,
  updates: Partial<UserHabitRoutine>
): Promise<UserHabitRoutine> => {
  const { data, error } = await supabase
    .from('user_habit_routines')
    .update(updates)
    .eq('id', routineId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data as UserHabitRoutine;
};

export const deleteUserRoutine = async (userId: string, routineId: string): Promise<void> => {
  const { error } = await supabase
    .from('user_habit_routines')
    .update({ is_active: false })
    .eq('id', routineId)
    .eq('user_id', userId);

  if (error) throw error;
};
