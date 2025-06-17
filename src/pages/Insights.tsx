import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ResponsiveLayout } from '@/components/ResponsiveLayout';
import { HabitTrackingOverview } from '@/components/HabitTrackingOverview';
import { MiniCalendar } from '@/components/MiniCalendar';
import { EmotionBubbleChart } from '@/components/EmotionBubbleChart';
import { PersonalityInsight } from '@/components/PersonalityInsight';
import { RecurringTopics } from '@/components/RecurringTopics';
import { InsightsSuggestions } from '@/components/InsightsSuggestions';
import { InsightsAI } from '@/components/InsightsAI';
import { EmotionDetailModal } from '@/components/EmotionDetailModal';
import { useJournalEntries } from '@/hooks/useJournalEntries';

const Insights = () => {
  const navigate = useNavigate();
  const { entries } = useJournalEntries();

  // Process emotions from journal entries for bubble chart
  const emotionFrequency = React.useMemo(() => {
    const emotions: Record<string, number> = {};
    
    entries.forEach(entry => {
      if (entry.ai_detected_emotions) {
        entry.ai_detected_emotions.forEach(emotion => {
          emotions[emotion] = (emotions[emotion] || 0) + 1;
        });
      }
    });

    // Normalize to 0-10 scale for bubble sizing
    const maxCount = Math.max(...Object.values(emotions));
    const normalized: Record<string, number> = {};
    
    Object.entries(emotions).forEach(([emotion, count]) => {
      normalized[emotion] = maxCount > 0 ? (count / maxCount) * 10 : 0;
    });

    return normalized;
  }, [entries]);

  const handleViewEntries = (emotion: string) => {
    navigate(`/journal-history?emotion=${encodeURIComponent(emotion)}`);
  };

  const handleAskQuestions = (emotion: string) => {
    navigate(`/chat?emotion=${encodeURIComponent(emotion)}`);
  };

  return (
    <ResponsiveLayout 
      title="Insights" 
      subtitle="Discover patterns in your personal growth journey"
    >
      <div className="space-y-8">
        {/* Habit Tracking Overview */}
        <HabitTrackingOverview />

        {/* Calendar View */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MiniCalendar />
          
          {/* Emotional State Bubbles */}
          <EmotionBubbleChart 
            emotions={emotionFrequency}
            onViewEntries={handleViewEntries}
            onAskQuestions={handleAskQuestions}
          />
        </div>

        {/* Personality Overview */}
        <PersonalityInsight />

        {/* Recurring Topics */}
        <RecurringTopics />

        {/* Next Steps Suggestions */}
        <InsightsSuggestions />

        {/* Ask AI */}
        <InsightsAI />
      </div>
    </ResponsiveLayout>
  );
};

export default Insights;
