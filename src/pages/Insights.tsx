
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ResponsiveLayout } from '@/components/ResponsiveLayout';
import { MiniCalendar } from '@/components/MiniCalendar';
import { EmotionBubbleChart } from '@/components/EmotionBubbleChart';
import { RecurringTopics } from '@/components/RecurringTopics';
import { InsightsSuggestions } from '@/components/InsightsSuggestions';
import { InsightsAI } from '@/components/InsightsAI';
import { AdvancedInsights } from '@/components/AdvancedInsights';
import { UsageAnalyticsCard } from '@/components/UsageAnalyticsCard';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { useFeatureTracking } from '@/hooks/useFeatureTracking';
import { useSubscription } from '@/hooks/useSubscription';

const Insights = () => {
  const navigate = useNavigate();
  const { entries } = useJournalEntries();
  const { trackFeatureUsage } = useFeatureTracking();
  const { isPremium } = useSubscription();

  // Track insights page view
  React.useEffect(() => {
    trackFeatureUsage('insights_view', 'analytics', {
      metadata: { page: 'insights', entryCount: entries.length }
    });
  }, [trackFeatureUsage, entries.length]);

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
    trackFeatureUsage('emotion_filter', 'navigation', {
      metadata: { emotion, source: 'insights' }
    });
    navigate(`/journal-history?emotion=${encodeURIComponent(emotion)}`);
  };

  const handleAskQuestions = (emotion: string) => {
    trackFeatureUsage('ai_chat', 'interaction', {
      metadata: { emotion, source: 'insights' }
    });
    navigate(`/chat?emotion=${encodeURIComponent(emotion)}`);
  };

  return (
    <ResponsiveLayout 
      title="Insights" 
      subtitle="Discover patterns in your personal growth journey"
    >
      <div className="space-y-8">
        {/* Advanced Analytics - Now with real data */}
        <AdvancedInsights />

        {/* Usage Analytics for Premium Users */}
        {isPremium && <UsageAnalyticsCard />}

        {/* Calendar and Emotion Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MiniCalendar />
          
          {/* Emotional State Bubbles */}
          <EmotionBubbleChart 
            emotions={emotionFrequency}
            onViewEntries={handleViewEntries}
            onAskQuestions={handleAskQuestions}
          />
        </div>

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
