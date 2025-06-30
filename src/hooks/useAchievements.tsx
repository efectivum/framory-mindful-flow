
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

const DB_ACHIEVEMENTS_SHOWN_KEY = 'lumatori_db_achievements_shown';

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

  // Get shown database achievements from localStorage
  const getShownDbAchievements = (): string[] => {
    try {
      const stored = localStorage.getItem(DB_ACHIEVEMENTS_SHOWN_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading shown DB achievements:', error);
      return [];
    }
  };

  // Save shown database achievement to localStorage
  const saveShownDbAchievement = (achievementId: string) => {
    try {
      const shown = getShownDbAchievements();
      if (!shown.includes(achievementId)) {
        shown.push(achievementId);
        localStorage.setItem(DB_ACHIEVEMENTS_SHOWN_KEY, JSON.stringify(shown));
        console.log(`DB Achievement ${achievementId} marked as shown`);
      }
    } catch (error) {
      console.error('Error saving shown DB achievement:', error);
    }
  };

  // Show toast for new achievements (with deduplication)
  React.useEffect(() => {
    const shownDbAchievements = getShownDbAchievements();
    
    const newAchievements = unseenAchievements.filter(achievement => 
      !shownDbAchievements.includes(achievement.id)
    );

    if (newAchievements.length > 0) {
      const latestAchievement = newAchievements[0];
      console.log('Showing DB achievement toast for:', latestAchievement.id);
      
      toast({
        title: `🎉 Achievement Unlocked!`,
        description: `${latestAchievement.icon} ${latestAchievement.title} - ${latestAchievement.description}`,
        duration: 5000,
      });
      
      // Mark as seen in both localStorage and database
      saveShownDbAchievement(latestAchievement.id);
      markAsSeenMutation.mutate(latestAchievement.id);
    }
  }, [unseenAchievements.length, markAsSeenMutation, toast]);

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
