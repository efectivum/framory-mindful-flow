
import { JournalEntry } from '@/hooks/useJournalEntries';
import { EnhancedMoodDisplay } from './mood/EnhancedMoodDisplay';

interface CleanMoodDisplayProps {
  entry: JournalEntry;
  showFlower?: boolean;
}

export const CleanMoodDisplay = ({ entry, showFlower = false }: CleanMoodDisplayProps) => {
  // Show user mood if available, otherwise AI mood, otherwise nothing
  const displayMood = entry.mood_after || entry.ai_detected_mood;

  if (!displayMood) return null;

  return (
    <div className="opacity-70 group-hover:opacity-100 transition-opacity">
      <EnhancedMoodDisplay
        userMood={entry.mood_after}
        aiMood={entry.ai_detected_mood}
        aiEmotions={entry.ai_detected_emotions}
        aiConfidence={entry.ai_confidence_level}
        alignmentScore={entry.mood_alignment_score}
        showLabels={false}
        showFlower={showFlower}
        size="sm"
      />
    </div>
  );
};
