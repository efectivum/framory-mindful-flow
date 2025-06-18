import { useMemo } from 'react';
import { JournalEntry } from '@/hooks/useJournalEntries';

interface JournalEntrySummaryProps {
  entry: JournalEntry;
  maxLength?: number;
}

export const JournalEntrySummary = ({ entry, maxLength = 140 }: JournalEntrySummaryProps) => {
  const keyPoints = useMemo(() => {
    const content = entry.content.trim();
    
    // If content is too short, don't try to extract points
    if (content.length < 100) {
      return [];
    }

    // Extract key sentences that represent main thoughts
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const keyPoints: string[] = [];

    // Look for sentences with emotional weight or important thoughts
    const importantPatterns = [
      /\b(feel|felt|feeling|think|believe|realize|understand|notice|discover|learn)\b/i,
      /\b(today|yesterday|this morning|tonight|right now)\b/i,
      /\b(because|since|due to|caused by|resulted in)\b/i,
      /\b(need to|want to|hope to|plan to|going to)\b/i,
      /\b(important|significant|meaningful|impactful)\b/i
    ];

    // Score sentences based on emotional and temporal relevance
    const scoredSentences = sentences.map(sentence => {
      let score = 0;
      const lowerSentence = sentence.toLowerCase();
      
      // Boost sentences with emotional indicators
      importantPatterns.forEach(pattern => {
        if (pattern.test(sentence)) score += 2;
      });
      
      // Boost sentences with first person perspective
      if (/\b(I|my|me|myself)\b/i.test(sentence)) score += 1;
      
      // Boost sentences that aren't too short or too long
      if (sentence.length > 30 && sentence.length < 120) score += 1;
      
      // Penalize very mundane sentences
      if (/\b(the|and|but|or|so|then)\b/i.test(sentence.trim().split(' ')[0])) score -= 1;
      
      return { sentence: sentence.trim(), score };
    }).filter(item => item.score > 0);

    // Sort by score and take top 2-3 points
    scoredSentences
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .forEach(item => {
        let point = item.sentence;
        
        // Clean up the point
        point = point.replace(/^(and|but|so|then|also|however)\s+/i, '');
        point = point.charAt(0).toUpperCase() + point.slice(1);
        
        // Ensure it ends with proper punctuation
        if (!/[.!?]$/.test(point)) {
          point += '.';
        }
        
        // Keep it concise
        if (point.length > 80) {
          point = point.substring(0, 77) + '...';
        }
        
        keyPoints.push(point);
      });

    return keyPoints;
  }, [entry.content]);

  // If we have extracted key points, show them as bullets
  if (keyPoints.length > 0) {
    return (
      <div className="space-y-1.5">
        {keyPoints.map((point, index) => (
          <div key={index} className="flex items-start gap-2 text-gray-300 text-sm">
            <span className="text-blue-400 text-xs mt-1 flex-shrink-0">•</span>
            <span className="leading-relaxed">{point}</span>
          </div>
        ))}
      </div>
    );
  }

  // Fallback to simple preview for very short entries
  const preview = entry.content.length > maxLength 
    ? entry.content.substring(0, maxLength - 3) + '...'
    : entry.content;

  return (
    <p className="text-gray-300 leading-relaxed text-sm line-clamp-3">
      {preview}
    </p>
  );
};
