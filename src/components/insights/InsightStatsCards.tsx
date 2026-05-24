import React from 'react';
import { Calendar, Brain, Target } from 'lucide-react';
import { FlippableCard } from '@/components/ui/FlippableCard';
import { ButtonErrorBoundary } from '@/components/ButtonErrorBoundary';

interface InsightStatsCardsProps {
  currentStreak: number;
  averageWordsPerEntry: number;
  activeHabitsCount: number;
}

export const InsightStatsCards: React.FC<InsightStatsCardsProps> = ({
  currentStreak,
  averageWordsPerEntry,
  activeHabitsCount
}) => {
  const createInsightCard = (
    icon: React.ReactNode,
    title: string,
    value: string | number,
    description: string,
    details: string
  ) => {
    const front = (
      <div className="h-full w-full card-serene p-6 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="icon-container text-primary">{icon}</div>
        </div>
        <div>
          <div className="text-3xl font-light text-foreground mb-1">{value}</div>
          <div className="text-foreground text-sm font-medium">{title}</div>
          <div className="text-muted-foreground text-xs mt-1">{description}</div>
        </div>
      </div>
    );

    const back = (
      <div className="h-full w-full card-serene p-6 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="text-foreground text-lg font-medium">{title}</div>
          <p className="text-muted-foreground text-sm leading-relaxed">{details}</p>
        </div>
      </div>
    );

    return { front, back };
  };

  const streakCard = createInsightCard(
    <Calendar className="w-5 h-5" />,
    "Writing Streak",
    `${currentStreak} days`,
    "Consistency builds momentum",
    "Your writing streak shows your commitment to self-reflection. Each day you write, you're building a stronger connection with yourself."
  );

  const wordsCard = createInsightCard(
    <Brain className="w-5 h-5" />,
    "Average Words",
    averageWordsPerEntry,
    "Per journal entry",
    "The depth of your entries reflects your willingness to explore your thoughts. Longer entries often lead to deeper insights."
  );

  const habitsCard = createInsightCard(
    <Target className="w-5 h-5" />,
    "Active Habits",
    activeHabitsCount,
    "Building consistency",
    "Your habits are the foundation of personal growth. Each habit represents a commitment to becoming your best self."
  );

  return (
    <ButtonErrorBoundary fallbackMessage="Overview statistics are not available">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
        <FlippableCard
          frontContent={streakCard.front}
          backContent={streakCard.back}
          height="h-44"
          flipOnHover={false}
          flipOnClick={true}
        />
        <FlippableCard
          frontContent={wordsCard.front}
          backContent={wordsCard.back}
          height="h-44"
          flipOnHover={false}
          flipOnClick={true}
        />
        <FlippableCard
          frontContent={habitsCard.front}
          backContent={habitsCard.back}
          height="h-44"
          flipOnHover={false}
          flipOnClick={true}
        />
      </div>
    </ButtonErrorBoundary>
  );
};
