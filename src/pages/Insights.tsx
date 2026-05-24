
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
    <ResponsiveLayout title="Insights" subtitle="Your patterns and progress">
      
        <NetworkStatusIndicator />
        
        <div className="mobile-flow">
          {/* Overview Stats */}
          <section className="mb-6">
            <InsightStatsCards
              currentStreak={currentStreak}
              averageWordsPerEntry={averageWordsPerEntry}
              activeHabitsCount={activeHabits.length}
            />
          </section>

          {entries.length === 0 ? (
            <section className="mb-6">
              <InsightEmptyState />
            </section>
          ) : (
            <div className="mobile-flow">
              {/* Main Charts Column */}
              <section className="mb-6">
                <InsightChartsSection
                  moodTrends={moodTrends}
                  personalityInsights={personalityInsights}
                  emotionAnalysis={emotionAnalysis}
                />
              </section>

              {/* Sidebar Column */}
              <section className="mb-6">
                <InsightSidebar
                  totalEntries={totalEntries}
                  totalWords={totalWords}
                  currentStreak={currentStreak}
                />
              </section>
            </div>
          )}
        </div>
      
    </ResponsiveLayout>
  );
};

export default Insights;
