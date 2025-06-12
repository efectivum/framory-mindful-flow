import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { JournalEntry } from '@/hooks/useJournalEntries';

export interface CoachingInteraction {
  id: string;
  user_id: string;
  entry_id?: string;
  response_level: 1 | 2 | 3;
  response_type: string;
  response_content: string;
  pattern_detected?: string;
  confidence_score?: number;
  user_engaged: boolean;
  created_at: string;
}

export interface UserPattern {
  id: string;
  user_id: string;
  pattern_type: string;
  pattern_key: string;
  pattern_value: Record<string, any>;
  occurrence_count: number;
  confidence_level: number;
  last_detected_at: string;
  created_at: string;
}

export interface CoachingState {
  id: string;
  user_id: string;
  last_level_2_response?: string;
  last_level_3_response?: string;
  level_2_count_this_week: number;
  level_3_count_this_week: number;
  week_start_date: string;
  updated_at: string;
}

export interface CoachingResponse {
  type: string;
  content: string;
  action?: string;
  actionLabel?: string;
  pattern_detected?: string;
}

export const useCoachingLogic = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch user patterns
  const { data: patterns = [] } = useQuery({
    queryKey: ['user-patterns', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_patterns')
        .select('*')
        .eq('user_id', user.id)
        .order('confidence_level', { ascending: false });

      if (error) throw error;
      return data as UserPattern[];
    },
    enabled: !!user,
  });

  // Fetch coaching state
  const { data: coachingState } = useQuery({
    queryKey: ['coaching-state', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('coaching_state')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data as CoachingState | null;
    },
    enabled: !!user,
  });

  // Fetch recent interactions
  const { data: recentInteractions = [] } = useQuery({
    queryKey: ['coaching-interactions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('coaching_interactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as CoachingInteraction[];
    },
    enabled: !!user,
  });

  // Create coaching interaction
  const createInteractionMutation = useMutation({
    mutationFn: async (interaction: Omit<CoachingInteraction, 'id' | 'created_at' | 'user_id'>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('coaching_interactions')
        .insert([{ ...interaction, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coaching-interactions'] });
    },
  });

  // Update pattern
  const updatePatternMutation = useMutation({
    mutationFn: async ({ pattern_type, pattern_key, pattern_value }: {
      pattern_type: string;
      pattern_key: string;
      pattern_value: Record<string, any>;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_patterns')
        .upsert([{
          user_id: user.id,
          pattern_type,
          pattern_key,
          pattern_value,
          occurrence_count: 1,
          confidence_level: 0.1,
        }], {
          onConflict: 'user_id,pattern_type,pattern_key',
          ignoreDuplicates: false
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-patterns'] });
    },
  });

  // Determine coaching response level
  const determineResponseLevel = (entry: JournalEntry, entries: JournalEntry[]): 1 | 2 | 3 => {
    const now = new Date();
    const daysSinceLastLevel2 = coachingState?.last_level_2_response 
      ? (now.getTime() - new Date(coachingState.last_level_2_response).getTime()) / (1000 * 60 * 60 * 24)
      : 7;
    const daysSinceLastLevel3 = coachingState?.last_level_3_response 
      ? (now.getTime() - new Date(coachingState.last_level_3_response).getTime()) / (1000 * 60 * 60 * 24)
      : 14;

    // Check for Level 3 triggers (5% - critical moments)
    if (daysSinceLastLevel3 >= 2 && (coachingState?.level_3_count_this_week || 0) < 2) {
      // Detect crisis keywords
      const crisisKeywords = ['overwhelmed', 'paralyzed', 'can\'t cope', 'breaking down', 'helpless'];
      const hasCrisisKeyword = crisisKeywords.some(keyword => 
        entry.content.toLowerCase().includes(keyword)
      );

      // Detect prolonged negative pattern
      const recentNegativeEntries = entries.slice(0, 5).filter(e => 
        e.mood_after && e.mood_after <= 2
      );

      if (hasCrisisKeyword || recentNegativeEntries.length >= 4) {
        return 3;
      }
    }

    // Check for Level 2 triggers (15% - pattern detection)
    if (daysSinceLastLevel2 >= 1 && (coachingState?.level_2_count_this_week || 0) < 3) {
      // Check if we have detected patterns worth sharing
      const strongPatterns = patterns.filter(p => p.confidence_level > 0.6);
      if (strongPatterns.length > 0) {
        return 2;
      }

      // Check for mood-sleep correlation
      const recentWithSleep = entries.slice(0, 7).filter(e => 
        e.mood_after && e.created_at
      );
      if (recentWithSleep.length >= 3) {
        return 2;
      }
    }

    // Default to Level 1 (80% - acknowledgment)
    return 1;
  };

  // Generate coaching response
  const generateCoachingResponse = (level: 1 | 2 | 3, entry: JournalEntry, entries: JournalEntry[]): CoachingResponse => {
    switch (level) {
      case 1:
        return generateLevel1Response(entry);
      case 2:
        return generateLevel2Response(entry, entries, patterns);
      case 3:
        return generateLevel3Response(entry, entries);
      default:
        return generateLevel1Response(entry);
    }
  };

  return {
    patterns,
    coachingState,
    recentInteractions,
    createInteraction: createInteractionMutation.mutate,
    updatePattern: updatePatternMutation.mutate,
    determineResponseLevel,
    generateCoachingResponse,
  };
};

// Level 1: Simple acknowledgments
const generateLevel1Response = (entry: JournalEntry): CoachingResponse => {
  const responses = [
    { type: 'acknowledgment', content: 'Noted.' },
    { type: 'acknowledgment', content: 'Got it.' },
    { type: 'acknowledgment', content: 'Understood.' },
    { type: 'acknowledgment', content: 'Thanks for sharing.' },
    { type: 'minimal', content: '✓' },
  ];

  // Choose based on mood if available
  if (entry.mood_after) {
    if (entry.mood_after >= 4) {
      return { type: 'positive_acknowledgment', content: 'Good to hear.' };
    } else if (entry.mood_after <= 2) {
      return { type: 'empathetic_acknowledgment', content: 'Understood. Rest is part of the process.' };
    }
  }

  return responses[Math.floor(Math.random() * responses.length)];
};

// Level 2: Pattern insights
const generateLevel2Response = (entry: JournalEntry, entries: JournalEntry[], patterns: UserPattern[]): CoachingResponse => {
  // Check for emotion frequency patterns
  const emotionWords = ['frustrated', 'angry', 'sad', 'happy', 'excited', 'anxious'];
  for (const emotion of emotionWords) {
    if (entry.content.toLowerCase().includes(emotion)) {
      const count = entries.filter(e => 
        e.content.toLowerCase().includes(emotion)
      ).length;
      
      if (count >= 3) {
        const timePattern = analyzeTimePattern(entries.filter(e => 
          e.content.toLowerCase().includes(emotion)
        ));
        
        return {
          type: 'emotion_pattern',
          content: `I've noticed the word "${emotion}" has appeared ${count} times in your recent entries${timePattern ? `, often ${timePattern}` : ''}. Just an observation.`,
          pattern_detected: `emotion_${emotion}_frequency`
        };
      }
    }
  }

  // Check for mood-sleep correlation
  const goodSleepEntries = entries.filter(e => 
    e.mood_after && e.mood_after >= 4
  ).slice(0, 5);
  
  if (goodSleepEntries.length >= 3) {
    return {
      type: 'mood_correlation',
      content: `That's great. I've noticed this is the ${goodSleepEntries.length}th time recently you've felt positive. There might be a pattern worth exploring.`,
      pattern_detected: 'positive_mood_pattern'
    };
  }

  return generateLevel1Response(entry);
};

// Level 3: Direct recommendations
const generateLevel3Response = (entry: JournalEntry, entries: JournalEntry[]): CoachingResponse => {
  const crisisKeywords = ['overwhelmed', 'paralyzed', 'can\'t cope'];
  const hasCrisisKeyword = crisisKeywords.some(keyword => 
    entry.content.toLowerCase().includes(keyword)
  );

  if (hasCrisisKeyword) {
    return {
      type: 'crisis_intervention',
      content: 'High-stress detected. This is a critical signal. Let\'s interrupt the pattern.',
      action: 'system_reset',
      actionLabel: 'Perform a 3-minute System Reset'
    };
  }

  // Check for motivation issues
  if (entry.content.toLowerCase().includes('unmotivated') || entry.content.toLowerCase().includes('can\'t get started')) {
    return {
      type: 'motivation_boost',
      content: 'The data shows that for you, "unmotivated" is often a sign of decision fatigue. Let\'s ignore the big list and focus on one small action.',
      action: 'small_task',
      actionLabel: 'Complete 1 small task'
    };
  }

  // Check for habit streak breaks
  const recentLowMood = entries.slice(0, 3).filter(e => e.mood_after && e.mood_after <= 2);
  if (recentLowMood.length >= 2) {
    return {
      type: 'habit_recovery',
      content: 'I see a connection. Your mood has dipped recently. This is a crucial moment. Let\'s not break the chain.',
      action: 'habit_reset',
      actionLabel: 'Start a 1-minute reset activity'
    };
  }

  return generateLevel1Response(entry);
};

// Helper function to analyze time patterns
const analyzeTimePattern = (entries: JournalEntry[]): string | null => {
  const days = entries.map(e => new Date(e.created_at).getDay());
  const hours = entries.map(e => new Date(e.created_at).getHours());

  // Check for day of week pattern
  const dayCount = days.reduce((acc, day) => {
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const maxDay = Object.entries(dayCount).reduce((max, [day, count]) => 
    count > max.count ? { day: parseInt(day), count } : max, 
    { day: -1, count: 0 }
  );

  if (maxDay.count >= Math.ceil(entries.length * 0.6)) {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return `on ${dayNames[maxDay.day]}s`;
  }

  // Check for time of day pattern
  const timeOfDay = hours.map(hour => {
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  });

  const timeCount = timeOfDay.reduce((acc, time) => {
    acc[time] = (acc[time] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const maxTime = Object.entries(timeCount).reduce((max, [time, count]) => 
    count > max.count ? { time, count } : max, 
    { time: '', count: 0 }
  );

  if (maxTime.count >= Math.ceil(entries.length * 0.6)) {
    return `in the ${maxTime.time}`;
  }

  return null;
};
