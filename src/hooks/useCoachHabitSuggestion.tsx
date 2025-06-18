
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
    // Extract habit details from coach response using pattern matching
    const lines = coachResponse.toLowerCase();
    
    // Common patterns for extracting habit information
    if (lines.includes('deep breathing')) {
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

    if (lines.includes('journaling') || lines.includes('writing')) {
      return {
        title: 'Daily Journaling',
        description: 'Write down thoughts, reflections, and insights to support personal growth.',
        frequency_type: 'daily',
        target_days: 30,
        conversationContext: coachResponse
      };
    }

    if (lines.includes('exercise') || lines.includes('workout')) {
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

    // Generic habit creation for other suggestions
    if (lines.includes('habit') && (lines.includes('create') || lines.includes('set up'))) {
      return {
        title: 'Personal Growth Practice',
        description: 'A practice recommended by your coach to support your personal development.',
        frequency_type: 'daily',
        target_days: 30,
        conversationContext: coachResponse
      };
    }

    return null;
  };

  return {
    createHabitFromSuggestion,
    parseHabitFromCoachResponse,
    isCreating
  };
};
