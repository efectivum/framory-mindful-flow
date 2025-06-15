
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface UserPattern {
  id: string;
  user_id: string;
  pattern_key: string;
  pattern_type: string;
  pattern_value: any;
  occurrence_count: number;
  confidence_level: number;
  last_detected_at: string;
}

export const useUserPatterns = () => {
  const { user } = useAuth();

  const { data: patterns = [], isLoading } = useQuery({
    queryKey: ['user-patterns', user?.id],
    queryFn: async (): Promise<UserPattern[]> => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_patterns')
        .select('*')
        .eq('user_id', user.id)
        .order('last_detected_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching user patterns:', error);
        throw error;
      }
      return data as UserPattern[];
    },
    enabled: !!user,
  });

  const recurringTopics = patterns.filter(p => p.pattern_type === 'topic');

  return {
    patterns,
    recurringTopics,
    isLoading,
  };
};
