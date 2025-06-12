
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { JournalEntry } from '@/hooks/useJournalEntries';
import { MoodDisplay } from '@/components/MoodDisplay';
import { QuickInsights } from '@/components/QuickInsights';

interface JournalEntryCardProps {
  entry: JournalEntry;
}

export const JournalEntryCard = ({ entry }: JournalEntryCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/journal/entry/${entry.id}`);
  };

  return (
    <Card 
      className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/70 transition-colors cursor-pointer group"
      onClick={handleClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {entry.title && (
              <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-blue-300 transition-colors">
                {entry.title}
              </h3>
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
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-300 whitespace-pre-wrap line-clamp-3">{entry.content}</p>
        
        {/* Quick AI Insights */}
        <div onClick={(e) => e.stopPropagation()}>
          <QuickInsights entry={entry} />
        </div>
        
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
