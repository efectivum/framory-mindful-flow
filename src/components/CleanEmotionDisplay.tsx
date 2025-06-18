
import { JournalEntry } from '@/hooks/useJournalEntries';

interface CleanEmotionDisplayProps {
  entry: JournalEntry;
  maxEmotions?: number;
  showPercentages?: boolean;
}

export const CleanEmotionDisplay = ({ 
  entry, 
  maxEmotions = 3, 
  showPercentages = false 
}: CleanEmotionDisplayProps) => {
  // Only show emotions if we have AI analysis
  if (!entry.ai_detected_emotions || entry.ai_detected_emotions.length === 0) {
    return null;
  }

  // If showing percentages (like Mindsera), create emotion bars
  if (showPercentages) {
    // Mock percentages for now - in real app you'd get these from AI analysis
    const emotionsWithPercentages = entry.ai_detected_emotions.slice(0, maxEmotions).map((emotion, index) => ({
      emotion: emotion.toUpperCase(),
      percentage: [60, 25, 15][index] || 10 // Mock data - replace with real percentages
    }));

    return (
      <div className="space-y-2">
        {emotionsWithPercentages.map((item, index) => (
          <div key={index} className="bg-gray-800/60 rounded-full px-4 py-2 flex items-center justify-between">
            <span className="text-white font-medium text-sm">{item.emotion}</span>
            <div className="flex items-center gap-2">
              <span className="text-gray-300 text-sm">{item.percentage}%</span>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Regular badge display for cards
  return (
    <div className="flex gap-1.5 flex-wrap">
      {entry.ai_detected_emotions.slice(0, maxEmotions).map((emotion, index) => (
        <div 
          key={index} 
          className="text-xs bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2 py-0.5 rounded-full font-normal"
        >
          {emotion}
        </div>
      ))}
      {entry.ai_detected_emotions.length > maxEmotions && (
        <span className="text-xs text-gray-500 px-1">
          +{entry.ai_detected_emotions.length - maxEmotions}
        </span>
      )}
    </div>
  );
};
