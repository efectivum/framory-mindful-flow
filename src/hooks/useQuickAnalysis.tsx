
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { JournalEntry } from '@/hooks/useJournalEntries';

export interface QuickAnalysis {
  id: string;
  entry_id: string;
  user_id: string;
  quick_takeaways: string[];
  emotional_insights: string[];
  growth_indicators: string[];
  action_suggestions: string[];
  confidence_score: number;
  created_at: string;
}

export const useQuickAnalysis = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const getQuickAnalysis = (entryId: string) => {
    return useQuery({
      queryKey: ['quick-analysis', entryId],
      queryFn: async () => {
        if (!user) return null;
        
        const { data, error } = await supabase
          .from('entry_quick_analysis')
          .select('*')
          .eq('entry_id', entryId)
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
        return data as QuickAnalysis | null;
      },
      enabled: !!user && !!entryId,
    });
  };

  const generateQuickAnalysis = useMutation({
    mutationFn: async (entry: JournalEntry) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase.functions.invoke('analyze-journal-summary', {
        body: { 
          entries: [entry], 
          analysisType: 'quick' 
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (_, entry) => {
      queryClient.invalidateQueries({ queryKey: ['quick-analysis', entry.id] });
    },
  });

  return {
    getQuickAnalysis,
    generateQuickAnalysis: generateQuickAnalysis.mutate,
    isGenerating: generateQuickAnalysis.isPending,
  };
};
