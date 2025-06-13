
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

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

const logActivity = async (userId: string, type: string, title: string, content: string, metadata = {}) => {
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

export const useHabits = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: habits = [], isLoading, error } = useQuery({
    queryKey: ['habits', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Habit[];
    },
    enabled: !!user,
  });

  const createHabitMutation = useMutation({
    mutationFn: async (newHabit: Omit<Habit, 'id' | 'created_at' | 'updated_at' | 'current_streak' | 'longest_streak'>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('habits')
        .insert([{ ...newHabit, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      // Log activity
      await logActivity(
        user.id,
        'habit',
        'New Habit Created',
        `Created a new habit: ${newHabit.title}`,
        { habit_id: data.id, frequency_type: newHabit.frequency_type }
      );

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast({
        title: "Success!",
        description: "New habit created successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create habit: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const updateHabitMutation = useMutation({
    mutationFn: async ({ id, updates }: { 
      id: string; 
      updates: Partial<Omit<Habit, 'id' | 'created_at' | 'updated_at' | 'current_streak' | 'longest_streak'>>
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('habits')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      // Log activity
      await logActivity(
        user.id,
        'habit',
        'Habit Updated',
        `Updated habit: ${data.title}`,
        { habit_id: id, changes: updates }
      );

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast({
        title: "Success!",
        description: "Habit updated successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update habit: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const deleteHabitMutation = useMutation({
    mutationFn: async (habitId: string) => {
      if (!user) throw new Error('User not authenticated');

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
        .eq('user_id', user.id);

      if (error) throw error;

      // Log activity
      if (habit) {
        await logActivity(
          user.id,
          'habit',
          'Habit Deleted',
          `Deleted habit: ${habit.title}`,
          { habit_id: habitId }
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast({
        title: "Success!",
        description: "Habit deleted successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete habit: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const completeHabitMutation = useMutation({
    mutationFn: async ({ habitId, notes, moodRating }: { 
      habitId: string; 
      notes?: string; 
      moodRating?: number;
    }) => {
      console.log('completeHabitMutation: Starting completion for habit:', habitId);
      
      if (!user) {
        console.log('completeHabitMutation: No user found');
        throw new Error('User not authenticated');
      }

      // Get current date in user's timezone
      const now = new Date();
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      console.log('completeHabitMutation: User timezone:', userTimezone);
      
      // Create start and end of day in user's timezone
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      
      console.log('completeHabitMutation: Checking for existing completion between:', startOfDay.toISOString(), 'and', endOfDay.toISOString());

      // Check if already completed today with better date handling
      const { data: existingCompletion, error: checkError } = await supabase
        .from('habit_completions')
        .select('id')
        .eq('habit_id', habitId)
        .eq('user_id', user.id)
        .gte('completed_at', startOfDay.toISOString())
        .lte('completed_at', endOfDay.toISOString())
        .maybeSingle();

      if (checkError) {
        console.log('completeHabitMutation: Error checking existing completion:', checkError);
        throw checkError;
      }

      if (existingCompletion) {
        console.log('completeHabitMutation: Habit already completed today');
        throw new Error('Habit already completed today');
      }

      console.log('completeHabitMutation: No existing completion found, proceeding with insert');

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
          user_id: user.id,
          notes,
          mood_rating: moodRating,
          completed_at: now.toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.log('completeHabitMutation: Error inserting completion:', error);
        throw error;
      }

      console.log('completeHabitMutation: Successfully inserted completion:', data);

      // Log activity
      if (habit) {
        const activityContent = notes 
          ? `Completed ${habit.title} with note: ${notes.substring(0, 100)}${notes.length > 100 ? '...' : ''}`
          : `Completed ${habit.title}`;
        
        await logActivity(
          user.id,
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
    },
    onSuccess: (data, variables) => {
      console.log('completeHabitMutation: Success callback called');
      
      // Immediately update the todayCompletions cache
      queryClient.setQueryData(['habit-completions', user?.id, new Date().toDateString()], (oldData: string[] = []) => {
        const newData = [...oldData, variables.habitId];
        console.log('completeHabitMutation: Updated todayCompletions cache:', newData);
        return newData;
      });

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      queryClient.invalidateQueries({ queryKey: ['habit-completions'] });
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      
      toast({
        title: "Great job! 🎉",
        description: "Habit completed successfully!",
      });
    },
    onError: (error) => {
      console.log('completeHabitMutation: Error callback called:', error);
      
      toast({
        title: "Couldn't complete habit",
        description: error.message === 'Habit already completed today' 
          ? "You've already completed this habit today!"
          : `Failed to complete habit: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const { data: todayCompletions = [] } = useQuery({
    queryKey: ['habit-completions', user?.id, new Date().toDateString()],
    queryFn: async () => {
      console.log('todayCompletions query: Starting fetch');
      
      if (!user) {
        console.log('todayCompletions query: No user found');
        return [];
      }
      
      // Get current date in user's timezone
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      
      console.log('todayCompletions query: Fetching completions between:', startOfDay.toISOString(), 'and', endOfDay.toISOString());

      const { data, error } = await supabase
        .from('habit_completions')
        .select('habit_id')
        .eq('user_id', user.id)
        .gte('completed_at', startOfDay.toISOString())
        .lte('completed_at', endOfDay.toISOString());

      if (error) {
        console.log('todayCompletions query: Error:', error);
        throw error;
      }
      
      const completions = data.map(completion => completion.habit_id);
      console.log('todayCompletions query: Found completions:', completions);
      return completions;
    },
    enabled: !!user,
  });

  return {
    habits,
    isLoading,
    error,
    createHabit: createHabitMutation.mutate,
    updateHabit: updateHabitMutation.mutate,
    deleteHabit: deleteHabitMutation.mutate,
    completeHabit: completeHabitMutation.mutate,
    todayCompletions,
    isCreating: createHabitMutation.isPending,
    isUpdating: updateHabitMutation.isPending,
    isDeleting: deleteHabitMutation.isPending,
    isCompleting: completeHabitMutation.isPending,
  };
};
