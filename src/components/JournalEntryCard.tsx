
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain } from 'lucide-react';
import { JournalEntry } from '@/hooks/useJournalEntries';
import { MoodDisplay } from '@/components/MoodDisplay';

interface JournalEntryCardProps {
  entry: JournalEntry;
  onAnalyze?: (entry: JournalEntry) => void;
}

export const JournalEntryCard = ({ entry, onAnalyze }: JournalEntryCardProps) => {
  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/70 transition-colors cursor-pointer group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {entry.title && (
              <h3 className="text-lg font-semibold text-white mb-1">{entry.title}</h3>
            )}
            <p className="text-sm text-gray-400">
              {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <MoodDisplay 
              userMood={entry.mood_after}
              aiMood={entry.ai_detected_mood}
              aiEmotions={entry.ai_detected_emotions}
              aiConfidence={entry.ai_confidence_level}
              alignmentScore={entry.mood_alignment_score}
            />
            {onAnalyze && (
              <Button
                size="sm"
                variant="outline"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  onAnalyze(entry);
                }}
              >
                <Brain className="w-4 h-4 mr-1" />
                Analyze
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-300 mb-3 whitespace-pre-wrap line-clamp-3">{entry.content}</p>
        {entry.tags && entry.tags.length > 0 && (
          <div className="flex gap-1 flex-wrap">
            {entry.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
