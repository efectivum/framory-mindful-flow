
import { useJournalEntries } from "@/hooks/useJournalEntries";
import { useHabits } from "@/hooks/useHabits";

export function useProgressStats() {
  const { stats, entries } = useJournalEntries();
  const { habits } = useHabits();

  // Habit stats
  const activeHabits = habits.filter((h) => h.is_active);
  const completedHabitsToday = activeHabits.filter(
    (h) => h.current_streak && h.current_streak > 0
  );
  const longestHabitStreak = Math.max(...activeHabits.map((h) => h.longest_streak || 0), 0);

  // Mood trend (simple: up if mood improved in last 2 entries)
  let moodTrend: "up" | "down" | "neutral" = "neutral";
  if (entries.length >= 2) {
    const prev = entries[1].mood_after ?? 0;
    const curr = entries[0].mood_after ?? 0;
    if (curr > prev) moodTrend = "up";
    else if (curr < prev) moodTrend = "down";
  }

  return {
    stats,
    entries,
    activeHabits,
    completedHabitsToday,
    longestHabitStreak,
    moodTrend,
  };
}
