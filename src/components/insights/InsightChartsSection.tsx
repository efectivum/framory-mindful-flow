
import React from 'react';
import { MoodTrendChart } from '@/components/MoodTrendChart';
import { PersonalityRadarChart } from '@/components/PersonalityRadarChart';
import { EmotionBubbleChart } from '@/components/EmotionBubbleChart';
import { PremiumGate } from '@/components/PremiumGate';
import { MoodTrend, PersonalityInsights, EmotionAnalysis } from '@/hooks/useAnalytics';

interface InsightChartsSectionProps {
  moodTrends: MoodTrend[];
  personalityInsights: PersonalityInsights | null;
  emotionAnalysis: EmotionAnalysis[];
}

export const InsightChartsSection: React.FC<InsightChartsSectionProps> = ({
  moodTrends,
  personalityInsights,
  emotionAnalysis
}) => {
  // Transform emotion analysis data for the bubble chart
  const emotionData = emotionAnalysis.reduce((acc, { emotion, frequency }) => {
    acc[emotion] = frequency;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="xl:col-span-2 space-y-6">
      <MoodTrendChart data={moodTrends} timeRange={30} />

      {Object.keys(emotionData).length > 0 && (
        <EmotionBubbleChart 
          emotions={emotionData}
        />
      )}

      <PremiumGate 
        feature="Advanced Analytics" 
        description="Get deeper insights into your emotional patterns and growth trends."
        showPreview={true}
      >
        <PersonalityRadarChart insights={personalityInsights} />
      </PremiumGate>
    </div>
  );
};
