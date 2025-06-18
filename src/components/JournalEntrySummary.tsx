
import { useMemo } from 'react';
import { JournalEntry } from '@/hooks/useJournalEntries';

interface JournalEntrySummaryProps {
  entry: JournalEntry;
  maxLength?: number;
}

export const JournalEntrySummary = ({ entry, maxLength = 140 }: JournalEntrySummaryProps) => {
  const summary = useMemo(() => {
    const content = entry.content.trim();
    
    // If content is short enough, return as is
    if (content.length <= maxLength) {
      return content;
    }

    // Split into sentences and try to get the most meaningful one
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    if (sentences.length === 0) {
      return content.substring(0, maxLength) + '...';
    }

    // For single sentence, truncate elegantly
    if (sentences.length === 1) {
      if (content.length <= maxLength + 20) {
        return content;
      }
      return content.substring(0, maxLength - 3) + '...';
    }

    // Try to find the most emotionally rich sentence
    const emotionalKeywords = [
      'feel', 'felt', 'feeling', 'grateful', 'happy', 'sad', 'excited', 
      'nervous', 'proud', 'worried', 'relieved', 'accomplished', 'peaceful'
    ];
    
    const emotionalSentence = sentences.find(sentence => 
      emotionalKeywords.some(keyword => 
        sentence.toLowerCase().includes(keyword)
      ) && sentence.trim().length <= maxLength
    );

    if (emotionalSentence) {
      return emotionalSentence.trim() + '.';
    }

    // Fallback to first sentence if it fits
    const firstSentence = sentences[0].trim();
    if (firstSentence.length <= maxLength) {
      return firstSentence + '.';
    }

    // Final fallback - intelligent truncation
    return content.substring(0, maxLength - 3) + '...';
  }, [entry.content, maxLength]);

  return (
    <p className="text-gray-300 leading-relaxed text-sm line-clamp-3">
      {summary}
    </p>
  );
};
