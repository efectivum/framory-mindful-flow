
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Achievement {
  id: string;
  achievement_type: string;
  achievement_key: string;
  title: string;
  description: string | null;
  earned_at: string;
  is_seen: boolean | null;
  icon: string | null;
  category: string;
}

export const useAchievements = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: achievements = [], isLoading } = useQuery({
    queryKey: ['achievements', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false });

      if (error) throw error;
      return data as Achievement[];
    },
    enabled: !!user?.id
  });

  const markAsSeenMutation = useMutation({
    mutationFn: async (achievementId: string) => {
      const { error } = await supabase
        .from('user_achievements')
        .update({ is_seen: true })
        .eq('id', achievementId)
        .eq('user_id', user?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievements', user?.id] });
    }
  });

  const checkAchievementsMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) return;
      
      const { error } = await supabase.rpc('check_achievements', {
        user_id_param: user.id
      });

      if (error) throw error;
    },
    onSuccess: () => {
      // Refetch achievements to see if any new ones were earned
      queryClient.invalidateQueries({ queryKey: ['achievements', user?.id] });
    }
  });

  const unseenAchievements = achievements.filter(achievement => !achievement.is_seen);
  const recentAchievements = achievements.slice(0, 5);

  // Show toast for new achievements
  React.useEffect(() => {
    if (unseenAchievements.length > 0) {
      const latestAchievement = unseenAchievements[0];
      toast({
        title: `🎉 Achievement Unlocked!`,
        description: `${latestAchievement.icon} ${latestAchievement.title} - ${latestAchievement.description}`,
        duration: 5000,
      });
      
      // Mark as seen after showing toast
      markAsSeenMutation.mutate(latestAchievement.id);
    }
  }, [unseenAchievements.length]);

  return {
    achievements,
    recentAchievements,
    unseenAchievements,
    isLoading,
    markAsSeen: markAsSeenMutation.mutate,
    checkAchievements: checkAchievementsMutation.mutate,
    isCheckingAchievements: checkAchievementsMutation.isPending
  };
};
