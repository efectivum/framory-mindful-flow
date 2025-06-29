
import { useMemo } from 'react';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { useHabits } from '@/hooks/useHabits';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { format, getHours, differenceInDays, startOfWeek, endOfWeek, isWithinInterval, subDays } from 'date-fns';

export interface UserBehaviorInsights {
  // Writing patterns
  preferredWritingTime: 'morning' | 'midday' | 'evening' | 'night' | 'varied';
  averageEntryLength: number;
  writingConsistency: 'daily' | 'regular' | 'sporadic' | 'new';
  
  // Mood patterns
  moodTrend: 'improving' | 'declining' | 'stable' | 'varied';
  emotionalComplexity: 'simple' | 'moderate' | 'complex';
  moodVolatility: 'stable' | 'moderate' | 'volatile';
  
  // Habit patterns
  habitCompletionTiming: 'morning' | 'evening' | 'varied' | 'none';
  habitConsistency: number; // 0-1 score
  
  // Growth indicators
  reflectionDepth: 'surface' | 'moderate' | 'deep';
  growthMindsetIndicators: number; // 0-1 score
  selfAwarenessLevel: 'developing' | 'moderate' | 'high';
  
  // Engagement patterns
  streakMotivation: boolean;
  respondsToPrompts: boolean;
  dataRichness: 'minimal' | 'moderate' | 'rich';
}

const GROWTH_KEYWORDS = [
  'learn', 'grow', 'improve', 'better', 'progress', 'develop', 'understand',
  'realize', 'discover', 'insight', 'awareness', 'mindful', 'reflect'
];

const SELF_AWARENESS_KEYWORDS = [
  'feel', 'emotion', 'realize', 'notice', 'aware', 'understand', 'recognize',
  'acknowledge', 'accept', 'pattern', 'trigger', 'response', 'behavior'
];

export const useUserBehaviors = () => {
  const { entries, stats } = useJournalEntries();
  const { habits, todayCompletions } = useHabits();
  const { user } = useAuth();

  // Get habit completions for behavioral analysis
  const { data: habitCompletions = [] } = useQuery({
    queryKey: ['habit-completions-behavior', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const thirtyDaysAgo = subDays(new Date(), 30);
      
      const { data, error } = await supabase
        .from('habit_completions')
        .select('habit_id, completed_at')
        .eq('user_id', user.id)
        .gte('completed_at', thirtyDaysAgo.toISOString())
        .order('completed_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const behaviorInsights: UserBehaviorInsights = useMemo(() => {
    // Early return for insufficient data
    if (entries.length < 3) {
      return {
        preferredWritingTime: 'varied',
        averageEntryLength: 0,
        writingConsistency: 'new',
        moodTrend: 'stable',
        emotionalComplexity: 'simple',
        moodVolatility: 'stable',
        habitCompletionTiming: 'none',
        habitConsistency: 0,
        reflectionDepth: 'surface',
        growthMindsetIndicators: 0,
        selfAwarenessLevel: 'developing',
        streakMotivation: false,
        respondsToPrompts: false,
        dataRichness: 'minimal'
      };
    }

    // Analyze writing time preferences
    const writingTimes = entries.map(entry => {
      const hour = getHours(new Date(entry.created_at));
      if (hour >= 5 && hour < 11) return 'morning';
      if (hour >= 11 && hour < 16) return 'midday';
      if (hour >= 16 && hour < 21) return 'evening';
      return 'night';
    });

    const timeFrequency = writingTimes.reduce((acc, time) => {
      acc[time] = (acc[time] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const dominantTime = Object.entries(timeFrequency)
      .sort(([,a], [,b]) => b - a)[0];
    
    const preferredWritingTime = dominantTime && dominantTime[1] > entries.length * 0.6 
      ? dominantTime[0] as 'morning' | 'midday' | 'evening' | 'night'
      : 'varied';

    // Calculate average entry length
    const totalWords = entries.reduce((sum, entry) => 
      sum + entry.content.trim().split(/\s+/).length, 0
    );
    const averageEntryLength = Math.round(totalWords / entries.length);

    // Determine writing consistency
    let writingConsistency: 'daily' | 'regular' | 'sporadic' | 'new';
    if (stats.currentStreak >= 7) {
      writingConsistency = 'daily';
    } else if (entries.length >= 10 && stats.currentStreak >= 3) {
      writingConsistency = 'regular';
    } else if (entries.length >= 5) {
      writingConsistency = 'sporadic';
    } else {
      writingConsistency = 'new';
    }

    // Analyze mood patterns
    const moodEntries = entries.filter(e => e.mood_after || e.ai_detected_mood);
    let moodTrend: 'improving' | 'declining' | 'stable' | 'varied' = 'stable';
    let moodVolatility: 'stable' | 'moderate' | 'volatile' = 'stable';

    if (moodEntries.length >= 5) {
      const recentMoods = moodEntries.slice(0, 5).map(e => e.mood_after || e.ai_detected_mood || 3);
      const olderMoods = moodEntries.slice(5, 10).map(e => e.mood_after || e.ai_detected_mood || 3);
      
      if (olderMoods.length >= 3) {
        const recentAvg = recentMoods.reduce((a, b) => a + b, 0) / recentMoods.length;
        const olderAvg = olderMoods.reduce((a, b) => a + b, 0) / olderMoods.length;
        
        if (recentAvg - olderAvg > 0.5) moodTrend = 'improving';
        else if (olderAvg - recentAvg > 0.5) moodTrend = 'declining';
        else moodTrend = 'stable';
      }

      // Calculate mood volatility
      const moodVariance = recentMoods.reduce((acc, mood) => {
        const avg = recentMoods.reduce((a, b) => a + b, 0) / recentMoods.length;
        return acc + Math.pow(mood - avg, 2);
      }, 0) / recentMoods.length;

      if (moodVariance > 1.5) moodVolatility = 'volatile';
      else if (moodVariance > 0.8) moodVolatility = 'moderate';
      else moodVolatility = 'stable';
    }

    // Analyze emotional complexity
    const emotionCounts = entries.reduce((acc, entry) => {
      if (entry.ai_detected_emotions) {
        return acc + entry.ai_detected_emotions.length;
      }
      return acc;
    }, 0);
    
    const avgEmotionsPerEntry = emotionCounts / entries.length;
    let emotionalComplexity: 'simple' | 'moderate' | 'complex';
    if (avgEmotionsPerEntry > 3) emotionalComplexity = 'complex';
    else if (avgEmotionsPerEntry > 1.5) emotionalComplexity = 'moderate';
    else emotionalComplexity = 'simple';

    // Analyze habit patterns
    let habitCompletionTiming: 'morning' | 'evening' | 'varied' | 'none' = 'none';
    let habitConsistency = 0;

    if (habitCompletions.length > 0) {
      const completionTimes = habitCompletions.map(completion => {
        const hour = getHours(new Date(completion.completed_at));
        return hour < 12 ? 'morning' : 'evening';
      });

      const morningCompletions = completionTimes.filter(t => t === 'morning').length;
      const eveningCompletions = completionTimes.filter(t => t === 'evening').length;
      
      if (morningCompletions > eveningCompletions * 1.5) {
        habitCompletionTiming = 'morning';
      } else if (eveningCompletions > morningCompletions * 1.5) {
        habitCompletionTiming = 'evening';
      } else {
        habitCompletionTiming = 'varied';
      }

      // Calculate habit consistency (completions per active habit per week)
      const activeHabits = habits.filter(h => h.is_active);
      if (activeHabits.length > 0) {
        const weeklyCompletions = habitCompletions.filter(c => 
          isWithinInterval(new Date(c.completed_at), {
            start: startOfWeek(new Date()),
            end: endOfWeek(new Date())
          })
        );
        habitConsistency = Math.min(1, weeklyCompletions.length / (activeHabits.length * 7));
      }
    }

    // Analyze reflection depth and growth mindset
    const allContent = entries.map(e => e.content.toLowerCase()).join(' ');
    const wordCount = allContent.split(/\s+/).length;
    
    const growthKeywordCount = GROWTH_KEYWORDS.reduce((count, keyword) => {
      return count + (allContent.match(new RegExp(keyword, 'g')) || []).length;
    }, 0);

    const selfAwarenessKeywordCount = SELF_AWARENESS_KEYWORDS.reduce((count, keyword) => {
      return count + (allContent.match(new RegExp(keyword, 'g')) || []).length;
    }, 0);

    const growthMindsetIndicators = Math.min(1, growthKeywordCount / (wordCount / 100));
    const selfAwarenessScore = selfAwarenessKeywordCount / (wordCount / 100);

    let reflectionDepth: 'surface' | 'moderate' | 'deep';
    if (averageEntryLength > 200 && selfAwarenessScore > 2) reflectionDepth = 'deep';
    else if (averageEntryLength > 100 && selfAwarenessScore > 1) reflectionDepth = 'moderate';
    else reflectionDepth = 'surface';

    let selfAwarenessLevel: 'developing' | 'moderate' | 'high';
    if (selfAwarenessScore > 3) selfAwarenessLevel = 'high';
    else if (selfAwarenessScore > 1.5) selfAwarenessLevel = 'moderate';
    else selfAwarenessLevel = 'developing';

    // Determine engagement patterns
    const streakMotivation = stats.currentStreak >= 5 || stats.currentStreak > entries.length * 0.3;
    const respondsToPrompts = averageEntryLength > 50 && writingConsistency !== 'sporadic';

    let dataRichness: 'minimal' | 'moderate' | 'rich';
    if (entries.length >= 20 && averageEntryLength > 150) dataRichness = 'rich';
    else if (entries.length >= 10 && averageEntryLength > 75) dataRichness = 'moderate';
    else dataRichness = 'minimal';

    return {
      preferredWritingTime,
      averageEntryLength,
      writingConsistency,
      moodTrend,
      emotionalComplexity,
      moodVolatility,
      habitCompletionTiming,
      habitConsistency,
      reflectionDepth,
      growthMindsetIndicators,
      selfAwarenessLevel,
      streakMotivation,
      respondsToPrompts,
      dataRichness
    };
  }, [entries, stats, habits, habitCompletions]);

  // Helper functions to get specific insights
  const getOptimalPromptTime = () => {
    if (behaviorInsights.preferredWritingTime === 'varied') {
      return 'flexible'; // User likes variety
    }
    return behaviorInsights.preferredWritingTime;
  };

  const getMotivationStyle = () => {
    if (behaviorInsights.streakMotivation) return 'streak-focused';
    if (behaviorInsights.growthMindsetIndicators > 0.5) return 'growth-focused';
    if (behaviorInsights.selfAwarenessLevel === 'high') return 'insight-focused';
    return 'encouragement-focused';
  };

  const getRecommendedEntryLength = () => {
    const avg = behaviorInsights.averageEntryLength;
    if (avg < 50) return 'short'; // Encourage brief but consistent
    if (avg < 150) return 'medium'; // Current sweet spot
    return 'flexible'; // They like to write longer pieces
  };

  const shouldShowAdvancedFeatures = () => {
    return behaviorInsights.dataRichness === 'rich' && 
           behaviorInsights.reflectionDepth !== 'surface';
  };

  return {
    insights: behaviorInsights,
    getOptimalPromptTime,
    getMotivationStyle,
    getRecommendedEntryLength,
    shouldShowAdvancedFeatures,
  };
};
