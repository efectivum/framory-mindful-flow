
import { useMutation } from '@tanstack/react-query';
import { useMoodAnalysis } from '@/hooks/useMoodAnalysis';
import { useQuickAnalysis } from '@/hooks/useQuickAnalysis';
import { supabase } from '@/integrations/supabase/client';
import { JournalEntry } from '@/hooks/useJournalEntries';

export const useJournalEntryAnalysis = () => {
  const { analyzeMood, calculateMoodAlignment } = useMoodAnalysis();
  const { generateQuickAnalysis } = useQuickAnalysis();

  const analyzeAndUpdateEntry = useMutation({
    mutationFn: async (entry: JournalEntry) => {
      try {
        // Analyze mood
        const moodAnalysis = await analyzeMood(entry.content);
        
        if (moodAnalysis) {
          // Calculate mood alignment
          const alignmentScore = entry.mood_after 
            ? calculateMoodAlignment(entry.mood_after, moodAnalysis.mood)
            : null;

          // Update entry with AI analysis
          const { error: updateError } = await supabase
            .from('journal_entries')
            .update({
              ai_detected_mood: moodAnalysis.mood,
              ai_sentiment_score: moodAnalysis.sentiment,
              ai_detected_emotions: moodAnalysis.emotions,
              ai_confidence_level: moodAnalysis.confidence,
              mood_alignment_score: alignmentScore
            })
            .eq('id', entry.id);

          if (updateError) throw updateError;

          // Generate quick analysis for insights
          await generateQuickAnalysis(entry);
        }

        return moodAnalysis;
      } catch (error) {
        console.error('Failed to analyze entry:', error);
        throw error;
      }
    },
  });

  return {
    analyzeEntry: analyzeAndUpdateEntry.mutate,
    isAnalyzing: analyzeAndUpdateEntry.isPending,
  };
};
