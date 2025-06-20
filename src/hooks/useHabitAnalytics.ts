
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useHabits } from './useHabits';
import { subDays, format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

export interface HabitAnalytics {
  completionRate: number;
  weeklyCompletions: Array<{ date: string; completed: number; total: number }>;
  streakHistory: Array<{ date: string; streak: number }>;
  completionsByDay: Array<{ day: string; completions: number }>;
  monthlyTrend: Array<{ month: string; rate: number }>;
}

export const useHabitAnalytics = (habitId?: string, days: number = 30) => {
  const { user } = useAuth();
  const { habits } = useHabits();

  // Get habit completions for analytics
  const { data: completions = [] } = useQuery({
    queryKey: ['habit-analytics-completions', user?.id, habitId, days],
    queryFn: async () => {
      if (!user) return [];
      
      const startDate = subDays(new Date(), days);
      
      let query = supabase
        .from('habit_completions')
        .select('habit_id, completed_at, habits!inner(title)')
        .eq('user_id', user.id)
        .gte('completed_at', startDate.toISOString())
        .order('completed_at', { ascending: true });

      if (habitId) {
        query = query.eq('habit_id', habitId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Calculate analytics for all habits or specific habit
  const analytics = useMemo(() => {
    if (!completions.length) return null;

    const now = new Date();
    const startDate = subDays(now, days);
    const dateRange = eachDayOfInterval({ start: startDate, end: now });

    // Get relevant habits
    const relevantHabits = habitId 
      ? habits.filter(h => h.id === habitId)
      : habits.filter(h => h.is_active);

    if (!relevantHabits.length) return null;

    // Calculate completion rate
    const totalPossibleCompletions = relevantHabits.length * days;
    const actualCompletions = completions.length;
    const completionRate = totalPossibleCompletions > 0 
      ? (actualCompletions / totalPossibleCompletions) * 100 
      : 0;

    // Weekly completions
    const weeklyCompletions = [];
    for (let i = 0; i < Math.ceil(days / 7); i++) {
      const weekStart = subDays(now, (i + 1) * 7);
      const weekEnd = subDays(now, i * 7);
      
      const weekCompletions = completions.filter(c => {
        const completedAt = new Date(c.completed_at);
        return completedAt >= weekStart && completedAt <= weekEnd;
      });

      weeklyCompletions.unshift({
        date: format(weekStart, 'MMM dd'),
        completed: weekCompletions.length,
        total: relevantHabits.length * 7
      });
    }

    // Daily completion pattern
    const completionsByDay = [
      'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
    ].map(day => {
      const dayCompletions = completions.filter(c => {
        const completedDate = new Date(c.completed_at);
        return format(completedDate, 'EEEE') === day;
      });
      
      return {
        day: day.slice(0, 3),
        completions: dayCompletions.length
      };
    });

    // Streak history (simplified - based on completion density)
    const streakHistory = dateRange.slice(-14).map(date => {
      const dayCompletions = completions.filter(c => {
        const completedDate = new Date(c.completed_at);
        return format(completedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
      });

      return {
        date: format(date, 'MMM dd'),
        streak: dayCompletions.length
      };
    });

    return {
      completionRate,
      weeklyCompletions,
      streakHistory,
      completionsByDay,
      monthlyTrend: [] // Can be expanded later
    };
  }, [completions, habits, habitId, days]);

  return {
    analytics,
    isLoading: !completions,
    completions
  };
};
