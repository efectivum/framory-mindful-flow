
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

export interface JournalEntryAnalysis {
  insights: string[];
  emotionalThemes: string[];
  cognitivePatterns: string[];
  suggestions: string[];
  emotionalComplexity: number;
  selfAwareness: number;
  growthIndicators: string[];
  concerns: string[];
}

export const useJournalAnalysis = () => {
  const { user } = useAuth();
  const [isSummaryLoading, setSummaryLoading] = useState(false);
  const [summaryData, setSummaryData] = useState<AnalysisSummary | null>(null);
  const [isEntryLoading, setEntryLoading] = useState(false);
  const [entryData, setEntryData] = useState<JournalEntryAnalysis | null>(null);

  const generateSummaryAnalysis = async (entries: JournalEntry[]) => {
    if (!user || entries.length === 0) return;

    setSummaryLoading(true);
    try {
      // Get user preferences and patterns for personalized analysis
      const [preferencesResult, patternsResult] = await Promise.all([
        supabase.from('user_preferences').select('*').eq('user_id', user.id).single(),
        supabase.from('user_patterns').select('*').eq('user_id', user.id).order('confidence_level', { ascending: false }).limit(10)
      ]);

      console.log('Generating personalized summary analysis for', entries.length, 'entries');
      
      const { data, error } = await supabase.functions.invoke('analyze-journal-summary', {
        body: { 
          entries,
          userPreferences: preferencesResult.data,
          userPatterns: patternsResult.data
        }
      });

      if (error) {
        console.error('Error in summary analysis:', error);
        throw error;
      }

      console.log('Personalized summary analysis response:', data);
      setSummaryData(data);
    } catch (error) {
      console.error('Failed to generate summary analysis:', error);
      throw error;
    } finally {
      setSummaryLoading(false);
    }
  };

  const generateEntryAnalysis = async (entry: JournalEntry) => {
    if (!user) return;

    setEntryLoading(true);
    try {
      // Get user preferences and patterns for personalized analysis
      const [preferencesResult, patternsResult] = await Promise.all([
        supabase.from('user_preferences').select('*').eq('user_id', user.id).single(),
        supabase.from('user_patterns').select('*').eq('user_id', user.id).order('confidence_level', { ascending: false }).limit(10)
      ]);

      console.log('Generating personalized entry analysis for entry:', entry.id);
      
      const { data, error } = await supabase.functions.invoke('analyze-journal-summary', {
        body: { 
          entries: [entry],
          analysisType: 'individual',
          userPreferences: preferencesResult.data,
          userPatterns: patternsResult.data
        }
      });

      if (error) {
        console.error('Error in entry analysis:', error);
        throw error;
      }

      console.log('Personalized entry analysis response:', data);
      setEntryData(data);
    } catch (error) {
      console.error('Failed to generate entry analysis:', error);
      throw error;
    } finally {
      setEntryLoading(false);
    }
  };

  return {
    generateSummaryAnalysis,
    isSummaryLoading,
    summaryData,
    generateEntryAnalysis,
    isEntryLoading,
    entryData,
  };
};
