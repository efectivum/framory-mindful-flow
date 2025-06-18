
import { useMemo } from 'react';
import { JournalEntry } from '@/hooks/useJournalEntries';

interface JournalEntrySummaryProps {
  entry: JournalEntry;
  maxLength?: number;
}

export const JournalEntrySummary = ({ entry, maxLength = 120 }: JournalEntrySummaryProps) => {
  const summary = useMemo(() => {
    const content = entry.content;
    
    // If content is short enough, return as is
    if (content.length <= maxLength) {
      return content;
    }

    // Try to create an intelligent summary
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    if (sentences.length === 0) {
      return content.substring(0, maxLength) + '...';
    }

    // For single sentence, truncate intelligently
    if (sentences.length === 1) {
      const words = content.split(' ');
      if (words.length <= 15) {
        return content;
      }
      return words.slice(0, 15).join(' ') + '...';
    }

    // For multiple sentences, try to get key insights
    let summary = '';
    
    // Prioritize sentences with emotional keywords
    const emotionalKeywords = [
      'feel', 'felt', 'feeling', 'grateful', 'happy', 'sad', 'angry', 
      'excited', 'nervous', 'proud', 'worried', 'relieved', 'frustrated',
      'accomplished', 'overwhelmed', 'peaceful', 'anxious', 'content'
    ];
    
    const emotionalSentences = sentences.filter(sentence => 
      emotionalKeywords.some(keyword => 
        sentence.toLowerCase().includes(keyword)
      )
    );

    if (emotionalSentences.length > 0) {
      summary = emotionalSentences[0].trim();
      if (summary.length <= maxLength) {
        return summary + '.';
      }
    }

    // Fallback to first sentence
    summary = sentences[0].trim();
    if (summary.length <= maxLength) {
      return summary + '.';
    }

    // Final fallback - intelligent word truncation
    const words = summary.split(' ');
    const truncatedWords = [];
    let currentLength = 0;
    
    for (const word of words) {
      if (currentLength + word.length + 1 <= maxLength - 3) {
        truncatedWords.push(word);
        currentLength += word.length + 1;
      } else {
        break;
      }
    }
    
    return truncatedWords.join(' ') + '...';
  }, [entry.content, maxLength]);

  return (
    <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
      {summary}
    </p>
  );
};
