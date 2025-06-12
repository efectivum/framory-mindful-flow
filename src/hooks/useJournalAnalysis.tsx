
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { JournalEntry } from '@/hooks/useJournalEntries';

export interface AnalysisSummary {
  summary: string;
  strengths: string[];
  keyInsights: string[];
  recommendations: string[];
  emotionBreakdown: Record<string, number>;
}

export const useJournalAnalysis = () => {
  const { user } = useAuth();
  const [isSummaryLoading, setSummaryLoading] = useState(false);
  const [summaryData, setSummaryData] = useState<AnalysisSummary | null>(null);

  const generateSummaryAnalysis = async (entries: JournalEntry[]) => {
    if (!user || entries.length === 0) return;

    setSummaryLoading(true);
    try {
      // Get user preferences for personalized analysis
      const { data: preferences } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      console.log('Generating summary analysis for', entries.length, 'entries');
      
      const { data, error } = await supabase.functions.invoke('analyze-journal-summary', {
        body: { 
          entries,
          userPreferences: preferences 
        }
      });

      if (error) {
        console.error('Error in summary analysis:', error);
        throw error;
      }

      console.log('Summary analysis response:', data);
      setSummaryData(data);
    } catch (error) {
      console.error('Failed to generate summary analysis:', error);
      throw error;
    } finally {
      setSummaryLoading(false);
    }
  };

  return {
    generateSummaryAnalysis,
    isSummaryLoading,
    summaryData,
  };
};
