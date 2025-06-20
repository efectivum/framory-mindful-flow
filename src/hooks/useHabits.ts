
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import * as habitService from '@/services/habitService';
import type { Habit, CreateHabitInput, UpdateHabitInput, CompleteHabitInput } from '@/types/habits';

export const useHabits = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: habits = [], isLoading, error } = useQuery({
    queryKey: ['habits', user?.id],
    queryFn: () => habitService.fetchHabits(user?.id || ''),
    enabled: !!user,
  });

  const createHabitMutation = useMutation({
    mutationFn: async (newHabit: CreateHabitInput) => {
      if (!user) throw new Error('User not authenticated');
      return habitService.createHabit(user.id, newHabit);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast({
        title: "Success!",
        description: "New habit created successfully!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to create habit: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const updateHabitMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: UpdateHabitInput }) => {
      if (!user) throw new Error('User not authenticated');
      return habitService.updateHabit(user.id, id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast({
        title: "Success!",
        description: "Habit updated successfully!",
      });
    },
    onError: (error: Error) => {
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
      return habitService.deleteHabit(user.id, habitId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast({
        title: "Success!",
        description: "Habit deleted successfully!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to delete habit: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const completeHabitMutation = useMutation({
    mutationFn: async (input: CompleteHabitInput) => {
      console.log('completeHabitMutation: Starting completion for habit:', input.habitId);
      
      if (!user) {
        console.log('completeHabitMutation: No user found');
        throw new Error('User not authenticated');
      }

      return habitService.completeHabit(user.id, input);
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
    onError: (error: Error) => {
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
    queryFn: () => habitService.fetchTodayCompletions(user?.id || ''),
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

// Export types for backwards compatibility
export type { Habit, CreateHabitInput, UpdateHabitInput, CompleteHabitInput } from '@/types/habits';
