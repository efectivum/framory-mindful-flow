
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { JournalEntry } from '@/hooks/useJournalEntries';

export interface JournalSummaryAnalysis {
  emotionBreakdown: Record<string, number>;
  keyInsights: string[];
  summary: string;
  recommendations: string[];
  overallTrend: 'improving' | 'stable' | 'declining' | 'mixed';
  riskFactors: string[];
  strengths: string[];
}

export interface JournalEntryAnalysis {
  emotionalThemes: string[];
  cognitivePatterns: string[];
  insights: string[];
  suggestions: string[];
  emotionalComplexity: number;
  selfAwareness: number;
  growthIndicators: string[];
  concerns: string[];
}

export const useJournalAnalysis = () => {
  const { toast } = useToast();

  const generateSummaryAnalysis = useMutation({
    mutationFn: async (entries: JournalEntry[]): Promise<JournalSummaryAnalysis> => {
      const { data, error } = await supabase.functions.invoke('analyze-journal-summary', {
        body: { entries, analysisType: 'summary' }
      });

      if (error) throw error;
      return data;
    },
    onError: (error) => {
      toast({
        title: "Analysis Error",
        description: `Failed to generate summary: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const generateEntryAnalysis = useMutation({
    mutationFn: async (entry: JournalEntry): Promise<JournalEntryAnalysis> => {
      const { data, error } = await supabase.functions.invoke('analyze-journal-summary', {
        body: { entries: [entry], analysisType: 'entry' }
      });

      if (error) throw error;
      return data;
    },
    onError: (error) => {
      toast({
        title: "Analysis Error",
        description: `Failed to analyze entry: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  return {
    generateSummaryAnalysis: generateSummaryAnalysis.mutate,
    generateEntryAnalysis: generateEntryAnalysis.mutate,
    isSummaryLoading: generateSummaryAnalysis.isPending,
    isEntryLoading: generateEntryAnalysis.isPending,
    summaryData: generateSummaryAnalysis.data,
    entryData: generateEntryAnalysis.data,
  };
};
