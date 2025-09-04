
import React from 'react';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { useHabits } from '@/hooks/useHabits';
import { useAnalytics } from '@/hooks/useAnalytics';
import { MobilePage, MobileContent, MobileSection } from '@/components/layouts/MobileLayout';
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
    <MobilePage>
      <MobileContent padded>
        <NetworkStatusIndicator />
        
        <div className="mobile-flow">
          {/* Overview Stats */}
          <MobileSection>
            <InsightStatsCards
              currentStreak={currentStreak}
              averageWordsPerEntry={averageWordsPerEntry}
              activeHabitsCount={activeHabits.length}
            />
          </MobileSection>

          {entries.length === 0 ? (
            <MobileSection>
              <InsightEmptyState />
            </MobileSection>
          ) : (
            <div className="mobile-flow">
              {/* Main Charts Column */}
              <MobileSection>
                <InsightChartsSection
                  moodTrends={moodTrends}
                  personalityInsights={personalityInsights}
                  emotionAnalysis={emotionAnalysis}
                />
              </MobileSection>

              {/* Sidebar Column */}
              <MobileSection>
                <InsightSidebar
                  totalEntries={totalEntries}
                  totalWords={totalWords}
                  currentStreak={currentStreak}
                />
              </MobileSection>
            </div>
          )}
        </div>
      </MobileContent>
    </MobilePage>
  );
};

export default Insights;
