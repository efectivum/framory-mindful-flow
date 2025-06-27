
import React from 'react';
import { Calendar, Brain, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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
    gradient: string,
    details: string
  ) => {
    const front = (
      <div className={`h-full w-full rounded-3xl p-6 flex flex-col justify-between shadow-xl border border-white/10 backdrop-blur-sm transition-all duration-300`}
           style={{ background: gradient }}>
        <div className="flex items-center justify-between">
          <div className="text-white/80">{icon}</div>
          <Badge variant="outline" className="text-white/80 border-white/20">
            Insight
          </Badge>
        </div>
        <div>
          <div className="text-3xl font-light text-white mb-2">{value}</div>
          <div className="text-white/80 text-sm font-medium">{title}</div>
          <div className="text-white/60 text-xs mt-1">{description}</div>
        </div>
      </div>
    );

    const back = (
      <div className={`h-full w-full rounded-3xl p-6 flex items-center justify-center shadow-xl border border-white/10 backdrop-blur-sm`}
           style={{ background: gradient }}>
        <div className="text-center space-y-3">
          <div className="text-white/80 text-lg font-medium">{title}</div>
          <p className="text-white/90 text-sm leading-relaxed">{details}</p>
        </div>
      </div>
    );

    return { front, back };
  };

  const streakCard = createInsightCard(
    <Calendar className="w-6 h-6" />,
    "Writing Streak",
    `${currentStreak} days`,
    "Consistency builds momentum",
    "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    "Your writing streak shows your commitment to self-reflection. Each day you write, you're building a stronger connection with yourself."
  );

  const wordsCard = createInsightCard(
    <Brain className="w-6 h-6" />,
    "Average Words",
    averageWordsPerEntry,
    "Per journal entry",
    "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    "The depth of your entries reflects your willingness to explore your thoughts. Longer entries often lead to deeper insights."
  );

  const habitsCard = createInsightCard(
    <Target className="w-6 h-6" />,
    "Active Habits",
    activeHabitsCount,
    "Building consistency",
    "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
    "Your habits are the foundation of personal growth. Each habit represents a commitment to becoming your best self."
  );

  return (
    <ButtonErrorBoundary fallbackMessage="Overview statistics are not available">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
        <FlippableCard
          frontContent={streakCard.front}
          backContent={streakCard.back}
          height="h-44"
          className="transition-all duration-300 hover:scale-105"
          flipOnHover={false}
          flipOnClick={true}
        />
        <FlippableCard
          frontContent={wordsCard.front}
          backContent={wordsCard.back}
          height="h-44"
          className="transition-all duration-300 hover:scale-105"
          flipOnHover={false}
          flipOnClick={true}
        />
        <FlippableCard
          frontContent={habitsCard.front}
          backContent={habitsCard.back}
          height="h-44"
          className="transition-all duration-300 hover:scale-105"
          flipOnHover={false}
          flipOnClick={true}
        />
      </div>
    </ButtonErrorBoundary>
  );
};
