
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface MoodDisplayProps {
  userMood?: number;
  aiMood?: number;
  aiEmotions?: string[];
  aiConfidence?: number;
  alignmentScore?: number;
  showLabels?: boolean;
}

export const MoodDisplay = ({ 
  userMood, 
  aiMood, 
  aiEmotions, 
  aiConfidence, 
  alignmentScore,
  showLabels = true 
}: MoodDisplayProps) => {
  const getMoodEmoji = (mood: number) => {
    const moodMap = {
      1: '😞',
      2: '😕',
      3: '😐',
      4: '😊',
      5: '😄',
    };
    return moodMap[mood as keyof typeof moodMap] || '';
  };

  const getAlignmentColor = (score?: number) => {
    if (!score) return 'text-gray-400';
    if (score >= 0.8) return 'text-green-500';
    if (score >= 0.6) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getAlignmentText = (score?: number) => {
    if (!score) return 'No data';
    if (score >= 0.8) return 'High alignment';
    if (score >= 0.6) return 'Moderate alignment';
    return 'Low alignment';
  };

  return (
    <div className="flex items-center gap-4">
      {/* User Mood */}
      {userMood && (
        <div className="text-center">
          <div className="text-lg">{getMoodEmoji(userMood)}</div>
          {showLabels && <div className="text-xs text-gray-400">Your mood</div>}
        </div>
      )}

      {/* AI Mood */}
      {aiMood && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-center cursor-help">
                <div className="text-lg opacity-75">{getMoodEmoji(aiMood)}</div>
                {showLabels && <div className="text-xs text-gray-400">AI detected</div>}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="space-y-1">
                <p>AI detected mood: {aiMood}/5</p>
                {aiConfidence && (
                  <p>Confidence: {Math.round(aiConfidence * 100)}%</p>
                )}
                {aiEmotions && aiEmotions.length > 0 && (
                  <p>Emotions: {aiEmotions.join(', ')}</p>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* Alignment Score */}
      {alignmentScore !== undefined && userMood && aiMood && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={`text-center cursor-help ${getAlignmentColor(alignmentScore)}`}>
                <div className="text-sm font-medium">
                  {Math.round(alignmentScore * 100)}%
                </div>
                {showLabels && <div className="text-xs">Alignment</div>}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{getAlignmentText(alignmentScore)}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* AI Emotions */}
      {aiEmotions && aiEmotions.length > 0 && (
        <div className="flex gap-1 flex-wrap">
          {aiEmotions.slice(0, 2).map((emotion, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {emotion}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
