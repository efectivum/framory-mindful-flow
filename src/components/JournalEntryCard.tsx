
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { JournalEntry } from '@/hooks/useJournalEntries';
import { MoodDisplay } from '@/components/MoodDisplay';
import { JournalEntrySummary } from '@/components/JournalEntrySummary';
import { Brain } from 'lucide-react';

interface JournalEntryCardProps {
  entry: JournalEntry;
}

export const JournalEntryCard = ({ entry }: JournalEntryCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/journal/entry/${entry.id}`);
  };

  const hasAIAnalysis = entry.ai_detected_emotions && entry.ai_detected_emotions.length > 0;

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
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>{formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}</span>
              {hasAIAnalysis && (
                <div className="flex items-center gap-1">
                  <Brain className="w-3 h-3 text-purple-400" />
                  <span className="text-purple-400">AI Analyzed</span>
                </div>
              )}
            </div>
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
        <JournalEntrySummary entry={entry} />
        
        {/* Show AI detected emotions prominently */}
        {entry.ai_detected_emotions && entry.ai_detected_emotions.length > 0 && (
          <div className="flex gap-1 flex-wrap">
            {entry.ai_detected_emotions.slice(0, 4).map((emotion, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs bg-purple-500/20 text-purple-300 border-purple-500/30"
              >
                {emotion}
              </Badge>
            ))}
          </div>
        )}
        
        {/* Show regular tags if no AI emotions */}
        {(!entry.ai_detected_emotions || entry.ai_detected_emotions.length === 0) && 
         entry.tags && entry.tags.length > 0 && (
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
