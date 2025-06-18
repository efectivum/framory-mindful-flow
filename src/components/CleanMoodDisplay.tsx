
import { JournalEntry } from '@/hooks/useJournalEntries';

interface CleanMoodDisplayProps {
  entry: JournalEntry;
}

export const CleanMoodDisplay = ({ entry }: CleanMoodDisplayProps) => {
  const getMoodEmoji = (mood: number) => {
    const moodMap = {
      1: '😞',
      2: '😕',
      3: '😐',
      4: '😊',
      5: '😄',
    };
    return moodMap[mood as keyof typeof moodMap] || '';
  };

  // Show user mood if available, otherwise AI mood, otherwise nothing
  const displayMood = entry.mood_after || entry.ai_detected_mood;

  if (!displayMood) return null;

  return (
    <div className="text-lg opacity-70 group-hover:opacity-100 transition-opacity">
      {getMoodEmoji(displayMood)}
    </div>
  );
};
