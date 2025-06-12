
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface WeeklyInsight {
  id: string;
  user_id: string;
  week_start_date: string;
  week_end_date: string;
  insights: any;
  emotional_summary: string;
  key_patterns: string[];
  recommendations: string[];
  growth_observations: string[];
  entry_count: number;
  average_mood: number;
  created_at: string;
  updated_at: string;
}

export const useWeeklyInsights = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: weeklyInsights = [], isLoading } = useQuery({
    queryKey: ['weekly-insights', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('weekly_insights')
        .select('*')
        .eq('user_id', user.id)
        .order('week_start_date', { ascending: false })
        .limit(8); // Last 8 weeks

      if (error) throw error;
      return data as WeeklyInsight[];
    },
    enabled: !!user,
  });

  const generateWeeklyInsight = useMutation({
    mutationFn: async (entries: any[]) => {
      if (!user) throw new Error('User not authenticated');
      
      // Get user preferences for personalized analysis
      const { data: preferences } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      const { data, error } = await supabase.functions.invoke('analyze-journal-summary', {
        body: { 
          entries, 
          analysisType: 'weekly',
          userPreferences: preferences 
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weekly-insights'] });
      toast({
        title: "Weekly Insight Generated!",
        description: "Your personalized weekly analysis is ready.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to generate weekly insight: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const getLatestInsight = () => {
    return weeklyInsights.length > 0 ? weeklyInsights[0] : null;
  };

  return {
    weeklyInsights,
    isLoading,
    generateWeeklyInsight: generateWeeklyInsight.mutate,
    isGenerating: generateWeeklyInsight.isPending,
    getLatestInsight,
  };
};
