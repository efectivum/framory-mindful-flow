
import React from 'react';
import { Calendar, BookOpen, Target } from 'lucide-react';
import { FlippableCard } from '@/components/ui/FlippableCard';
import { ButtonErrorBoundary } from '@/components/ButtonErrorBoundary';
import { useHabits } from '@/hooks/useHabits';
import { useJournalEntries } from '@/hooks/useJournalEntries';

export const StatsCardsSection: React.FC = () => {
  const { habits } = useHabits();
  const { entries, stats } = useJournalEntries();

  // Ensure currentStreak is a valid number
  const currentStreak = typeof stats?.currentStreak === 'number' ? stats.currentStreak : 0;
  const activeHabits = habits?.filter(habit => habit.is_active) || [];
  const totalEntries = entries?.length || 0;

  // Create enhanced stat cards with organic design
  const createStatCard = (
    icon: React.ReactNode,
    title: string,
    value: string | number,
    description: string,
    gradient: string
  ) => {
    const front = (
      <div className={`h-full w-full rounded-3xl p-4 md:p-6 flex flex-col justify-between shadow-xl border border-white/10 backdrop-blur-sm app-card-organic`}
           style={{ background: gradient }}>
        <div className="flex items-center justify-between">
          <div className="text-white/80">{icon}</div>
        </div>
        <div>
          <div className="text-2xl md:text-3xl font-light text-white mb-2 animate-gentle-pulse">{value}</div>
          <div className="text-white/80 text-xs md:text-sm font-medium">{title}</div>
        </div>
      </div>
    );

    const back = (
      <div className={`h-full w-full rounded-3xl p-4 md:p-6 flex items-center justify-center shadow-xl border border-white/10 backdrop-blur-sm`}
           style={{ background: gradient }}>
        <p className="text-white/90 text-center font-light text-xs md:text-sm leading-relaxed">{description}</p>
      </div>
    );

    return { front, back };
  };

  const streakCard = createStatCard(
    <Calendar className="w-5 h-5 md:w-6 md:h-6" />,
    "Day Streak",
    currentStreak,
    "Keep writing daily to maintain your momentum and build lasting habits.",
    "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
  );

  const entriesCard = createStatCard(
    <BookOpen className="w-5 h-5 md:w-6 md:h-6" />,
    "Total Entries",
    totalEntries,
    "Each entry is a step forward in your personal growth journey.",
    "linear-gradient(135deg, #10b981 0%, #059669 100%)"
  );

  const habitsCard = createStatCard(
    <Target className="w-5 h-5 md:w-6 md:h-6" />,
    "Active Habits",
    activeHabits.length,
    "Small consistent actions lead to remarkable transformations over time.",
    "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)"
  );

  return (
    <ButtonErrorBoundary fallbackMessage="Statistics are not available">
      <div className="w-full max-w-full overflow-hidden px-4 md:px-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 animate-fade-in w-full">
          <div className="w-full max-w-full">
            <FlippableCard
              frontContent={streakCard.front}
              backContent={streakCard.back}
              height="h-32 md:h-36"
              className="card-hover w-full"
              flipOnHover={false}
              flipOnClick={true}
            />
          </div>
          <div className="w-full max-w-full">
            <FlippableCard
              frontContent={entriesCard.front}
              backContent={entriesCard.back}
              height="h-32 md:h-36"
              className="card-hover w-full"
              flipOnHover={false}
              flipOnClick={true}
            />
          </div>
          <div className="w-full max-w-full">
            <FlippableCard
              frontContent={habitsCard.front}
              backContent={habitsCard.back}
              height="h-32 md:h-36"
              className="card-hover w-full"
              flipOnHover={false}
              flipOnClick={true}
            />
          </div>
        </div>
      </div>
    </ButtonErrorBoundary>
  );
};
