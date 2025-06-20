
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface HabitSuggestion {
  title: string;
  description: string;
  frequency_type: 'daily' | 'weekly';
  target_days: number;
  conversationContext?: string;
}

export const useCoachHabitSuggestion = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);

  const createHabitFromSuggestion = async (suggestion: HabitSuggestion) => {
    if (!user) return null;

    setIsCreating(true);
    try {
      const { data, error } = await supabase
        .from('habits')
        .insert([{
          user_id: user.id,
          title: suggestion.title,
          description: suggestion.description,
          frequency_type: suggestion.frequency_type,
          target_days: suggestion.target_days,
          current_streak: 0,
          longest_streak: 0,
          is_active: true
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Habit Created Successfully!",
        description: `"${suggestion.title}" has been added to your habits. Start tracking today!`,
      });

      return data;
    } catch (error) {
      console.error('Failed to create habit from coach suggestion:', error);
      toast({
        title: "Failed to Create Habit",
        description: "There was an error creating the habit. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  const parseHabitFromCoachResponse = (coachResponse: string): HabitSuggestion | null => {
    // Only suggest habits when coach explicitly offers to create one
    const lines = coachResponse.toLowerCase();
    
    // Look for explicit habit creation offers from the coach
    const explicitOffers = [
      'let me create a habit for',
      'i can help you set up a habit',
      'would you like me to create a habit',
      'i can set up a daily practice',
      'let me help you create a habit',
      'i recommend creating a habit for this',
      'this sounds like a perfect daily habit',
      'let me create a daily practice'
    ];

    const hasExplicitOffer = explicitOffers.some(offer => lines.includes(offer));
    
    if (!hasExplicitOffer) {
      return null;
    }

    // Extract specific habit details based on context
    if (lines.includes('deep breathing') || lines.includes('breathing practice')) {
      return {
        title: 'Daily Deep Breathing',
        description: 'Practice deep breathing exercises: breathe in for 4 counts, hold for 4, exhale for 6. Repeat 5 times.',
        frequency_type: 'daily',
        target_days: 30,
        conversationContext: coachResponse
      };
    }
    
    if (lines.includes('morning routine')) {
      return {
        title: 'Morning Routine',
        description: 'Start each day with intention and positive energy through a structured morning routine.',
        frequency_type: 'daily',
        target_days: 21,
        conversationContext: coachResponse
      };
    }

    if (lines.includes('journaling') || lines.includes('writing practice')) {
      return {
        title: 'Daily Journaling',
        description: 'Write down thoughts, reflections, and insights to support personal growth.',
        frequency_type: 'daily',
        target_days: 30,
        conversationContext: coachResponse
      };
    }

    if (lines.includes('exercise') || lines.includes('workout') || lines.includes('physical activity')) {
      return {
        title: 'Daily Exercise',
        description: 'Stay active and maintain physical health through regular exercise.',
        frequency_type: 'daily',
        target_days: 30,
        conversationContext: coachResponse
      };
    }

    if (lines.includes('meditation') || lines.includes('mindfulness')) {
      return {
        title: 'Mindfulness Practice',
        description: 'Practice mindfulness and meditation to cultivate awareness and inner peace.',
        frequency_type: 'daily',
        target_days: 21,
        conversationContext: coachResponse
      };
    }

    if (lines.includes('reading') || lines.includes('learning')) {
      return {
        title: 'Daily Learning',
        description: 'Dedicate time each day to reading or learning something new.',
        frequency_type: 'daily',
        target_days: 30,
        conversationContext: coachResponse
      };
    }

    if (lines.includes('gratitude')) {
      return {
        title: 'Gratitude Practice',
        description: 'Take time each day to reflect on things you are grateful for.',
        frequency_type: 'daily',
        target_days: 21,
        conversationContext: coachResponse
      };
    }

    // Generic habit creation only if coach explicitly offers it
    return {
      title: 'Personal Growth Practice',
      description: 'A practice recommended by your coach to support your personal development.',
      frequency_type: 'daily',
      target_days: 30,
      conversationContext: coachResponse
    };
  };

  return {
    createHabitFromSuggestion,
    parseHabitFromCoachResponse,
    isCreating
  };
};
