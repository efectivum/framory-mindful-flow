
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
        const wordCount = entry.content.trim().split(' ').length;
        
        // Skip analysis for very short content (under 50 words)
        if (wordCount < 50) {
          console.log(`Skipping analysis for short entry (${wordCount} words)`);
          return null;
        }

        console.log(`Starting analysis for entry ${entry.id} (${wordCount} words)`);
        
        // Analyze mood first
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

          if (updateError) {
            console.error('Failed to update entry with mood analysis:', updateError);
            throw updateError;
          }

          console.log(`Mood analysis complete for entry ${entry.id}`);

          // Generate quick analysis for insights (only for entries with 50+ words)
          try {
            await generateQuickAnalysis(entry);
            console.log(`Quick analysis complete for entry ${entry.id}`);
          } catch (quickAnalysisError) {
            console.error('Quick analysis failed but mood analysis succeeded:', quickAnalysisError);
            // Don't throw here - mood analysis succeeded
          }
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
