
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import {
  fetchHabitTemplates,
  fetchHabitTemplateWithSteps,
  fetchUserRoutines,
  createUserRoutine,
  completeRoutine,
  fetchTodayRoutineCompletions,
  updateUserRoutine,
  deleteUserRoutine
} from '@/services/routineService';
import type { 
  HabitTemplate, 
  HabitTemplateWithSteps,
  UserHabitRoutine, 
  CreateUserRoutineInput, 
  CompleteRoutineInput 
} from '@/types/routines';

export const useRoutines = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCompleting, setIsCompleting] = useState(false);

  // Fetch habit templates
  const { 
    data: templates = [], 
    isLoading: isLoadingTemplates 
  } = useQuery({
    queryKey: ['habit-templates'],
    queryFn: fetchHabitTemplates,
  });

  // Fetch user routines
  const { 
    data: userRoutines = [], 
    isLoading: isLoadingRoutines 
  } = useQuery({
    queryKey: ['user-routines', user?.id],
    queryFn: () => fetchUserRoutines(user?.id || ''),
    enabled: !!user?.id,
  });

  // Fetch today's completions
  const { 
    data: todayCompletions = [] 
  } = useQuery({
    queryKey: ['routine-completions-today', user?.id],
    queryFn: () => fetchTodayRoutineCompletions(user?.id || ''),
    enabled: !!user?.id,
  });

  // Create routine mutation
  const createRoutineMutation = useMutation({
    mutationFn: (input: CreateUserRoutineInput) => 
      createUserRoutine(user?.id || '', input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-routines'] });
      toast({
        title: "Routine Added",
        description: "Your new routine has been added successfully!",
      });
    },
    onError: (error) => {
      console.error('Error creating routine:', error);
      toast({
        title: "Error",
        description: "Failed to create routine. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Complete routine mutation
  const completeRoutineMutation = useMutation({
    mutationFn: (input: CompleteRoutineInput) => 
      completeRoutine(user?.id || '', input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-routines'] });
      queryClient.invalidateQueries({ queryKey: ['routine-completions-today'] });
      toast({
        title: "Routine Completed! 🎉",
        description: "Great job completing your routine!",
      });
    },
    onError: (error) => {
      console.error('Error completing routine:', error);
      toast({
        title: "Error",
        description: "Failed to complete routine. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update routine mutation
  const updateRoutineMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<UserHabitRoutine> }) =>
      updateUserRoutine(user?.id || '', id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-routines'] });
      toast({
        title: "Routine Updated",
        description: "Your routine has been updated successfully!",
      });
    },
    onError: (error) => {
      console.error('Error updating routine:', error);
      toast({
        title: "Error",
        description: "Failed to update routine. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete routine mutation
  const deleteRoutineMutation = useMutation({
    mutationFn: (routineId: string) => 
      deleteUserRoutine(user?.id || '', routineId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-routines'] });
      toast({
        title: "Routine Deleted",
        description: "Your routine has been removed.",
      });
    },
    onError: (error) => {
      console.error('Error deleting routine:', error);
      toast({
        title: "Error",
        description: "Failed to delete routine. Please try again.",
        variant: "destructive",
      });
    },
  });

  const createFromTemplate = useCallback((templateId: string, customTitle?: string) => {
    createRoutineMutation.mutate({
      template_id: templateId,
      title: customTitle
    });
  }, [createRoutineMutation]);

  const completeUserRoutine = useCallback((input: CompleteRoutineInput) => {
    setIsCompleting(true);
    completeRoutineMutation.mutate(input, {
      onSettled: () => setIsCompleting(false)
    });
  }, [completeRoutineMutation]);

  const updateRoutine = useCallback((id: string, updates: Partial<UserHabitRoutine>) => {
    updateRoutineMutation.mutate({ id, updates });
  }, [updateRoutineMutation]);

  const deleteRoutine = useCallback((routineId: string) => {
    deleteRoutineMutation.mutate(routineId);
  }, [deleteRoutineMutation]);

  return {
    templates,
    userRoutines,
    todayCompletions,
    isLoading: isLoadingTemplates || isLoadingRoutines,
    isCompleting,
    isCreating: createRoutineMutation.isPending,
    isUpdating: updateRoutineMutation.isPending,
    isDeleting: deleteRoutineMutation.isPending,
    createFromTemplate,
    completeUserRoutine,
    updateRoutine,
    deleteRoutine,
  };
};

export const useHabitTemplate = (templateId: string | null) => {
  return useQuery({
    queryKey: ['habit-template', templateId],
    queryFn: () => fetchHabitTemplateWithSteps(templateId!),
    enabled: !!templateId,
  });
};
