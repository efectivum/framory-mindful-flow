
import { supabase } from '@/integrations/supabase/client';

interface MoodAnalysis {
  mood: number;
  sentiment: number;
  emotions: string[];
  confidence: number;
}

export const useMoodAnalysis = () => {
  const analyzeMood = async (content: string): Promise<MoodAnalysis | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('analyze-mood', {
        body: { content }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to analyze mood:', error);
      return null;
    }
  };

  const calculateMoodAlignment = (userMood?: number, aiMood?: number): number => {
    if (!userMood || !aiMood) return 0;
    
    // Calculate alignment as 1 - (difference / max_possible_difference)
    const difference = Math.abs(userMood - aiMood);
    const maxDifference = 4; // Max difference between 1 and 5
    return Math.max(0, 1 - (difference / maxDifference));
  };

  return {
    analyzeMood,
    calculateMoodAlignment,
  };
};
