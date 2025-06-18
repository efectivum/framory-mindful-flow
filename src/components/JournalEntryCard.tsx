
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { JournalEntry } from '@/hooks/useJournalEntries';
import { MoodDisplay } from '@/components/MoodDisplay';
import { JournalEntrySummary } from '@/components/JournalEntrySummary';
import { Brain, Clock } from 'lucide-react';

interface JournalEntryCardProps {
  entry: JournalEntry;
}

export const JournalEntryCard = ({ entry }: JournalEntryCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/journal/entry/${entry.id}`);
  };

  const wordCount = entry.content.trim().split(' ').length;
  const hasAIAnalysis = entry.ai_detected_emotions && entry.ai_detected_emotions.length > 0;
  const isAnalysisEligible = wordCount >= 50;
  const showAnalysisStatus = isAnalysisEligible && !hasAIAnalysis;

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
              
              {/* Analysis Status Indicators */}
              {hasAIAnalysis && (
                <div className="flex items-center gap-1">
                  <Brain className="w-3 h-3 text-purple-400" />
                  <span className="text-purple-400">AI Analyzed</span>
                </div>
              )}
              
              {showAnalysisStatus && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span className="text-amber-400">Analysis pending</span>
                </div>
              )}
              
              {!isAnalysisEligible && (
                <div className="flex items-center gap-1">
                  <span className="text-gray-500 text-xs">Too short for analysis</span>
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
        
        {/* Clean Emotion Display - Show only top 5 emotions for card view */}
        {entry.ai_detected_emotions && entry.ai_detected_emotions.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs text-purple-300 font-medium">Emotions</div>
            <div className="flex gap-1 flex-wrap">
              {entry.ai_detected_emotions.slice(0, 5).map((emotion, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="text-xs bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2 py-0.5 rounded-full"
                >
                  {emotion}
                </Badge>
              ))}
              {entry.ai_detected_emotions.length > 5 && (
                <Badge 
                  variant="secondary" 
                  className="text-xs bg-gray-500/10 text-gray-400 border border-gray-500/20 px-2 py-0.5 rounded-full"
                >
                  +{entry.ai_detected_emotions.length - 5} more
                </Badge>
              )}
            </div>
          </div>
        )}
        
        {/* Show regular tags only if no AI emotions and not eligible for analysis */}
        {(!entry.ai_detected_emotions || entry.ai_detected_emotions.length === 0) && 
         !isAnalysisEligible &&
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
