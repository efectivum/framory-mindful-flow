
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  duration_days: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  challenge_type: string;
  category: string;
  what_included: string[];
  benefits: string[];
  daily_prompts?: string[];
  tips?: string[];
  completion_criteria: any;
  participant_count: number;
  success_rate?: number;
  is_active: boolean;
  created_at: string;
}

export interface UserChallenge {
  id: string;
  user_id: string;
  challenge_id: string;
  status: 'active' | 'completed' | 'paused' | 'abandoned';
  enrolled_at: string;
  completed_at?: string;
  current_day: number;
  total_completions: number;
  daily_completions: any;
  notes?: string;
  challenge: Challenge;
}

export const useChallenges = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch all available challenges
  const { data: challenges = [], isLoading: isLoadingChallenges } = useQuery({
    queryKey: ['challenges'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Challenge[];
    },
  });

  // Fetch user's enrolled challenges
  const { data: userChallenges = [], isLoading: isLoadingUserChallenges } = useQuery({
    queryKey: ['user-challenges', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('user_challenges')
        .select(`
          *,
          challenge:challenges(*)
        `)
        .eq('user_id', user.id)
        .order('enrolled_at', { ascending: false });

      if (error) throw error;
      return data as UserChallenge[];
    },
    enabled: !!user?.id,
  });

  // Enroll in a challenge
  const enrollInChallenge = useMutation({
    mutationFn: async (challengeId: string) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_challenges')
        .insert({
          user_id: user.id,
          challenge_id: challengeId,
          status: 'active',
          current_day: 1,
          total_completions: 0,
          daily_completions: {},
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-challenges'] });
      toast.success('Successfully enrolled in challenge!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to enroll in challenge');
    },
  });

  // Complete a challenge day
  const completeDay = useMutation({
    mutationFn: async ({ 
      userChallengeId, 
      challengeId, 
      dayNumber, 
      completionMethod = 'manual',
      sourceId,
      notes,
      moodRating 
    }: {
      userChallengeId: string;
      challengeId: string;
      dayNumber: number;
      completionMethod?: string;
      sourceId?: string;
      notes?: string;
      moodRating?: number;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');

      // Insert completion record
      const { error: completionError } = await supabase
        .from('challenge_completions')
        .insert({
          user_challenge_id: userChallengeId,
          user_id: user.id,
          challenge_id: challengeId,
          day_number: dayNumber,
          completion_method: completionMethod,
          source_id: sourceId,
          notes,
          mood_rating: moodRating,
        });

      if (completionError) throw completionError;

      // Update user challenge progress
      const { error: updateError } = await supabase
        .from('user_challenges')
        .update({
          current_day: dayNumber + 1,
          total_completions: dayNumber,
          daily_completions: {
            [dayNumber]: {
              completed_at: new Date().toISOString(),
              method: completionMethod,
              source_id: sourceId,
            }
          },
        })
        .eq('id', userChallengeId);

      if (updateError) throw updateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-challenges'] });
      toast.success('Day completed! Great job! 🎉');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to complete day');
    },
  });

  // Get challenge by ID
  const getChallengeById = (id: string) => {
    return challenges.find(challenge => challenge.id === id);
  };

  // Check if user is enrolled in a challenge
  const isEnrolledInChallenge = (challengeId: string) => {
    return userChallenges.some(uc => uc.challenge_id === challengeId && uc.status === 'active');
  };

  // Get user's active challenges
  const activeChallenges = userChallenges.filter(uc => uc.status === 'active');

  return {
    challenges,
    userChallenges,
    activeChallenges,
    isLoadingChallenges,
    isLoadingUserChallenges,
    enrollInChallenge: enrollInChallenge.mutate,
    isEnrolling: enrollInChallenge.isPending,
    completeDay: completeDay.mutate,
    isCompletingDay: completeDay.isPending,
    getChallengeById,
    isEnrolledInChallenge,
  };
};
