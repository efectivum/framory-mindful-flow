
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Calendar, Clock, Target } from 'lucide-react';
import { useHabits } from '@/hooks/useHabits';
import { useJournalEntries } from '@/hooks/useJournalEntries';

export const HabitTrackingOverview: React.FC = () => {
  const { habits } = useHabits();
  const { entries, stats } = useJournalEntries();

  const activeHabits = habits.filter(habit => habit.is_active);
  const longestStreak = Math.max(...activeHabits.map(habit => habit.longest_streak), 0);
  const currentStreak = stats.currentStreak;
  
  // Calculate total journaling time (estimate based on entry count and average reading time)
  const totalJournalingTime = React.useMemo(() => {
    const averageWordsPerEntry = entries.reduce((sum, entry) => 
      sum + entry.content.split(' ').length, 0) / entries.length || 0;
    const averageTimePerEntry = Math.max(averageWordsPerEntry / 200 * 60, 5); // ~200 words per minute, min 5 minutes
    return Math.round(entries.length * averageTimePerEntry);
  }, [entries]);

  const completionRate = React.useMemo(() => {
    if (activeHabits.length === 0) return 0;
    const totalTargetDays = activeHabits.reduce((sum, habit) => sum + habit.target_days, 0);
    const totalCurrentStreak = activeHabits.reduce((sum, habit) => sum + habit.current_streak, 0);
    return Math.round((totalCurrentStreak / totalTargetDays) * 100);
  }, [activeHabits]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Habit Tracking Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-600/10 border-gray-700/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Journaling Time</CardTitle>
            <Clock className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{Math.floor(totalJournalingTime / 60)}h {totalJournalingTime % 60}m</div>
            <p className="text-xs text-gray-400">Across {entries.length} entries</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 border-gray-700/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Current Streak</CardTitle>
            <Target className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{currentStreak} days</div>
            <p className="text-xs text-gray-400">Keep it going!</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-violet-600/10 border-gray-700/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Longest Streak</CardTitle>
            <Calendar className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{longestStreak} days</div>
            <p className="text-xs text-gray-400">Personal best</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-red-600/10 border-gray-700/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Completion Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{completionRate}%</div>
            <p className="text-xs text-gray-400">Overall progress</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
