
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
        
        // Step 1: Analyze mood with retry logic
        let moodAnalysis = null;
        let retryCount = 0;
        const maxRetries = 3;
        
        while (retryCount < maxRetries && !moodAnalysis) {
          try {
            moodAnalysis = await analyzeMood(entry.content);
            if (moodAnalysis) break;
          } catch (error) {
            console.error(`Mood analysis attempt ${retryCount + 1} failed:`, error);
            retryCount++;
            if (retryCount < maxRetries) {
              // Wait before retry (exponential backoff)
              await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
            }
          }
        }

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

          // Step 2: Generate quick analysis with retry logic
          retryCount = 0;
          while (retryCount < maxRetries) {
            try {
              await generateQuickAnalysis(entry);
              console.log(`Quick analysis complete for entry ${entry.id}`);
              break;
            } catch (quickAnalysisError) {
              console.error(`Quick analysis attempt ${retryCount + 1} failed:`, quickAnalysisError);
              retryCount++;
              if (retryCount < maxRetries) {
                // Wait before retry
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
              } else {
                console.error('Quick analysis failed after all retries, but mood analysis succeeded');
                // Don't throw here - mood analysis succeeded
              }
            }
          }
        } else {
          console.error('Mood analysis failed after all retries');
          throw new Error('Failed to analyze mood after multiple attempts');
        }

        return moodAnalysis;
      } catch (error) {
        console.error('Failed to analyze entry:', error);
        throw error;
      }
    },
    retry: 2, // Allow mutation-level retries
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    analyzeEntry: analyzeAndUpdateEntry.mutate,
    isAnalyzing: analyzeAndUpdateEntry.isPending,
    analysisError: analyzeAndUpdateEntry.error,
  };
};
