
import React from 'react';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { useHabits } from '@/hooks/useHabits';
import { useAnalytics } from '@/hooks/useAnalytics';
import { ResponsiveLayout } from '@/components/ResponsiveLayout';
import { NetworkStatusIndicator } from '@/components/NetworkStatusIndicator';
import { InsightStatsCards } from '@/components/insights/InsightStatsCards';
import { InsightChartsSection } from '@/components/insights/InsightChartsSection';
import { InsightSidebar } from '@/components/insights/InsightSidebar';
import { InsightEmptyState } from '@/components/insights/InsightEmptyState';

const Insights = () => {
  const { entries, stats } = useJournalEntries();
  const { habits } = useHabits();
  const { 
    moodTrends, 
    personalityInsights,
    emotionAnalysis,
    totalEntries, 
    currentStreak 
  } = useAnalytics(30);

  const activeHabits = habits.filter(habit => habit.is_active);
  const totalWords = entries.reduce((sum, entry) => sum + (entry.content?.split(' ').length || 0), 0);
  const averageWordsPerEntry = entries.length > 0 ? Math.round(totalWords / entries.length) : 0;

  return (
    <ResponsiveLayout title="Insights" subtitle="Discover patterns in your journey">
      <NetworkStatusIndicator />
      
      <div className="space-y-8">
        {/* Overview Stats */}
        <InsightStatsCards
          currentStreak={currentStreak}
          averageWordsPerEntry={averageWordsPerEntry}
          activeHabitsCount={activeHabits.length}
        />

        {entries.length === 0 ? (
          <InsightEmptyState />
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Main Charts Column */}
            <InsightChartsSection
              moodTrends={moodTrends}
              personalityInsights={personalityInsights}
              emotionAnalysis={emotionAnalysis}
            />

            {/* Sidebar Column */}
            <InsightSidebar
              totalEntries={totalEntries}
              totalWords={totalWords}
              currentStreak={currentStreak}
            />
          </div>
        )}
      </div>
    </ResponsiveLayout>
  );
};

export default Insights;
