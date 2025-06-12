
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const useCoachingInteractions = (entryId?: string) => {
  const { user } = useAuth();

  const { data: interactions = [], isLoading } = useQuery({
    queryKey: ['coaching-interactions', user?.id, entryId],
    queryFn: async () => {
      if (!user) return [];
      
      let query = supabase
        .from('coaching_interactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (entryId) {
        query = query.eq('entry_id', entryId);
      }

      const { data, error } = await query.limit(5);

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const getLatestInteraction = () => {
    return interactions[0] || null;
  };

  const getInteractionsByLevel = (level: 1 | 2 | 3) => {
    return interactions.filter(interaction => interaction.response_level === level);
  };

  return {
    interactions,
    isLoading,
    getLatestInteraction,
    getInteractionsByLevel,
  };
};
