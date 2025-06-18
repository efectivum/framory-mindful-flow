
import { Badge } from '@/components/ui/badge';
import { JournalEntry } from '@/hooks/useJournalEntries';

interface CleanEmotionDisplayProps {
  entry: JournalEntry;
  maxEmotions?: number;
}

export const CleanEmotionDisplay = ({ entry, maxEmotions = 3 }: CleanEmotionDisplayProps) => {
  // Only show emotions if we have AI analysis
  if (!entry.ai_detected_emotions || entry.ai_detected_emotions.length === 0) {
    return null;
  }

  return (
    <div className="flex gap-1.5 flex-wrap">
      {entry.ai_detected_emotions.slice(0, maxEmotions).map((emotion, index) => (
        <Badge 
          key={index} 
          variant="secondary" 
          className="text-xs bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2 py-0.5 rounded-full font-normal"
        >
          {emotion}
        </Badge>
      ))}
      {entry.ai_detected_emotions.length > maxEmotions && (
        <span className="text-xs text-gray-500 px-1">
          +{entry.ai_detected_emotions.length - maxEmotions}
        </span>
      )}
    </div>
  );
};
