
import React from 'react';
import { Calendar, BookOpen, Target } from 'lucide-react';
import { FlippableCard } from '@/components/ui/FlippableCard';
import { ButtonErrorBoundary } from '@/components/ButtonErrorBoundary';
import { useHabits } from '@/hooks/useHabits';
import { useJournalEntries } from '@/hooks/useJournalEntries';

export const StatsCardsSection: React.FC = () => {
  const { habits } = useHabits();
  const { entries, stats } = useJournalEntries();

  // Debug the streak value before using it
  const currentStreak = stats.currentStreak || 0;
  console.log('Using streak value:', currentStreak);

  const activeHabits = habits.filter(habit => habit.is_active);

  // Create enhanced stat cards with organic design
  const createStatCard = (
    icon: React.ReactNode,
    title: string,
    value: string | number,
    description: string,
    gradient: string
  ) => {
    const front = (
      <div className={`h-full w-full rounded-3xl p-6 flex flex-col justify-between shadow-xl border border-white/10 backdrop-blur-sm app-card-organic`}
           style={{ background: gradient }}>
        <div className="flex items-center justify-between">
          <div className="text-white/80">{icon}</div>
        </div>
        <div>
          <div className="text-3xl font-light text-white mb-2 animate-gentle-pulse">{value}</div>
          <div className="text-white/80 text-sm font-medium">{title}</div>
        </div>
      </div>
    );

    const back = (
      <div className={`h-full w-full rounded-3xl p-6 flex items-center justify-center shadow-xl border border-white/10 backdrop-blur-sm`}
           style={{ background: gradient }}>
        <p className="text-white/90 text-center font-light text-sm leading-relaxed">{description}</p>
      </div>
    );

    return { front, back };
  };

  const streakCard = createStatCard(
    <Calendar className="w-6 h-6" />,
    "Day Streak",
    currentStreak,
    "Keep writing daily to maintain your momentum and build lasting habits.",
    "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
  );

  const entriesCard = createStatCard(
    <BookOpen className="w-6 h-6" />,
    "Total Entries",
    entries.length,
    "Each entry is a step forward in your personal growth journey.",
    "linear-gradient(135deg, #10b981 0%, #059669 100%)"
  );

  const habitsCard = createStatCard(
    <Target className="w-6 h-6" />,
    "Active Habits",
    activeHabits.length,
    "Small consistent actions lead to remarkable transformations over time.",
    "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)"
  );

  return (
    <ButtonErrorBoundary fallbackMessage="Statistics are not available">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
        <FlippableCard
          frontContent={streakCard.front}
          backContent={streakCard.back}
          height="h-36"
          className="card-hover"
          flipOnHover={false}
          flipOnClick={true}
        />
        <FlippableCard
          frontContent={entriesCard.front}
          backContent={entriesCard.back}
          height="h-36"
          className="card-hover"
          flipOnHover={false}
          flipOnClick={true}
        />
        <FlippableCard
          frontContent={habitsCard.front}
          backContent={habitsCard.back}
          height="h-36"
          className="card-hover"
          flipOnHover={false}
          flipOnClick={true}
        />
      </div>
    </ButtonErrorBoundary>
  );
};
