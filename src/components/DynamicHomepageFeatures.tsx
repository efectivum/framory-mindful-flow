
import React from 'react';
import { MiniCalendar } from './MiniCalendar';
import { EmotionTrends } from './EmotionTrends';
import { RecurringTopics } from './RecurringTopics';
import { SmartSuggestions } from './SmartSuggestions';
import { PersonalityInsight } from './PersonalityInsight';
import { QuickAI } from './QuickAI';
import { useTimeOfDay } from '@/hooks/useTimeOfDay';

export const DynamicHomepageFeatures: React.FC = () => {
  const { mode } = useTimeOfDay();

  return (
    <div className="space-y-6 mt-8">
      <SmartSuggestions />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MiniCalendar />
        <EmotionTrends />
      </div>

      <RecurringTopics />
      
      {mode === 'evening' && <PersonalityInsight />}
      
      <QuickAI />
    </div>
  );
};
