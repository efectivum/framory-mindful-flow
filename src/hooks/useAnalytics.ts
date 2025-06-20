
import { useMemo } from 'react';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { useHabits } from '@/hooks/useHabits';
import { subDays, format, startOfWeek, endOfWeek, eachDayOfInterval, isWithinInterval } from 'date-fns';

export interface MoodTrend {
  date: string;
  mood: number;
  count: number;
}

export interface EmotionAnalysis {
  emotion: string;
  frequency: number;
  trend: 'up' | 'down' | 'stable';
  correlation: number;
}

export interface GoalProgress {
  habitId: string;
  title: string;
  completionRate: number;
  streak: number;
  weeklyProgress: number[];
  monthlyTrend: 'improving' | 'declining' | 'stable';
}

export interface PersonalityInsights {
  emotionalStability: number;
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  writingComplexity: number;
  selfReflectionLevel: number;
}

export const useAnalytics = (timeRange: 30 | 90 | 365 = 30) => {
  const { entries, stats } = useJournalEntries();
  const { habits, todayCompletions } = useHabits();

  const moodTrends = useMemo(() => {
    const endDate = new Date();
    const startDate = subDays(endDate, timeRange);
    const dateRange = eachDayOfInterval({ start: startDate, end: endDate });

    return dateRange.map(date => {
      const dayEntries = entries.filter(entry => {
        const entryDate = new Date(entry.created_at);
        return format(entryDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
      });

      const avgMood = dayEntries.length > 0 
        ? dayEntries.reduce((sum, entry) => {
            const mood = entry.mood_after || entry.ai_detected_mood || entry.mood_before;
            return sum + (mood || 3);
          }, 0) / dayEntries.length
        : 0;

      return {
        date: format(date, 'MMM dd'),
        mood: Number(avgMood.toFixed(1)),
        count: dayEntries.length
      };
    });
  }, [entries, timeRange]);

  const emotionAnalysis = useMemo(() => {
    const emotionFreq: Record<string, number[]> = {};
    const recentCutoff = subDays(new Date(), Math.floor(timeRange / 2));

    entries.forEach(entry => {
      const entryDate = new Date(entry.created_at);
      const isRecent = entryDate >= recentCutoff;
      
      if (entry.ai_detected_emotions) {
        entry.ai_detected_emotions.forEach(emotion => {
          if (!emotionFreq[emotion]) {
            emotionFreq[emotion] = [0, 0]; // [older, recent]
          }
          emotionFreq[emotion][isRecent ? 1 : 0]++;
        });
      }
    });

    return Object.entries(emotionFreq)
      .map(([emotion, [older, recent]]) => {
        const total = older + recent;
        const trend = recent > older ? 'up' : recent < older ? 'down' : 'stable';
        const correlation = total > 5 ? (recent / Math.max(older, 1)) : 1;

        return {
          emotion,
          frequency: total,
          trend: trend as 'up' | 'down' | 'stable',
          correlation: Number(correlation.toFixed(2))
        };
      })
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 8);
  }, [entries, timeRange]);

  const goalProgress = useMemo(() => {
    return habits.map(habit => {
      const weeklyData = Array.from({ length: 7 }, (_, i) => {
        const date = subDays(new Date(), 6 - i);
        // This would need completion data - simplified for now
        return Math.random() > 0.3 ? 1 : 0;
      });

      const completionRate = (habit.current_streak / habit.target_days) * 100;
      const recentRate = weeklyData.reduce((sum, val) => sum + val, 0) / 7 * 100;
      const monthlyTrend = recentRate > completionRate * 1.1 ? 'improving' : 
                          recentRate < completionRate * 0.9 ? 'declining' : 'stable';

      return {
        habitId: habit.id,
        title: habit.title,
        completionRate: Math.min(completionRate, 100),
        streak: habit.current_streak,
        weeklyProgress: weeklyData,
        monthlyTrend: monthlyTrend as 'improving' | 'declining' | 'stable'
      };
    });
  }, [habits]);

  const personalityInsights = useMemo(() => {
    if (entries.length < 5) {
      return null;
    }

    const totalWords = entries.reduce((sum, entry) => sum + entry.content.split(' ').length, 0);
    const avgWordsPerEntry = totalWords / entries.length;
    const emotionalRange = entries.filter(e => e.ai_detected_emotions?.length).length / entries.length;
    const selfReflection = entries.filter(e => 
      e.content.toLowerCase().includes('i feel') || 
      e.content.toLowerCase().includes('i think') ||
      e.content.toLowerCase().includes('i realize')
    ).length / entries.length;

    return {
      emotionalStability: Math.min(90, 60 + (stats.averageMood || 3) * 10),
      openness: Math.min(95, 50 + emotionalRange * 45),
      conscientiousness: Math.min(90, 40 + (stats.currentStreak / 30) * 50),
      extraversion: Math.min(85, 30 + (entries.filter(e => 
        e.content.toLowerCase().includes('social') || 
        e.content.toLowerCase().includes('friend')
      ).length / entries.length) * 55),
      agreeableness: Math.min(88, 55 + emotionalRange * 33),
      writingComplexity: Math.min(95, Math.max(20, (avgWordsPerEntry / 200) * 80)),
      selfReflectionLevel: Math.min(92, selfReflection * 92)
    };
  }, [entries, stats]);

  const weeklyInsights = useMemo(() => {
    const thisWeek = entries.filter(entry => {
      const entryDate = new Date(entry.created_at);
      const weekStart = startOfWeek(new Date());
      const weekEnd = endOfWeek(new Date());
      return isWithinInterval(entryDate, { start: weekStart, end: weekEnd });
    });

    const lastWeek = entries.filter(entry => {
      const entryDate = new Date(entry.created_at);
      const weekStart = startOfWeek(subDays(new Date(), 7));
      const weekEnd = endOfWeek(subDays(new Date(), 7));
      return isWithinInterval(entryDate, { start: weekStart, end: weekEnd });
    });

    return {
      entriesThisWeek: thisWeek.length,
      entriesLastWeek: lastWeek.length,
      moodImprovement: thisWeek.length > 0 && lastWeek.length > 0 ? 
        (thisWeek.reduce((sum, e) => sum + (e.mood_after || 3), 0) / thisWeek.length) -
        (lastWeek.reduce((sum, e) => sum + (e.mood_after || 3), 0) / lastWeek.length) : 0,
      topEmotionsThisWeek: thisWeek.flatMap(e => e.ai_detected_emotions || [])
        .reduce((acc, emotion) => {
          acc[emotion] = (acc[emotion] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
    };
  }, [entries]);

  return {
    moodTrends,
    emotionAnalysis,
    goalProgress,
    personalityInsights,
    weeklyInsights,
    totalEntries: entries.length,
    totalHabits: habits.length,
    currentStreak: stats.currentStreak
  };
};
