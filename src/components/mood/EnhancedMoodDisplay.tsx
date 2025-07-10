import { MoodFlower } from './MoodFlower';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface EnhancedMoodDisplayProps {
  userMood?: number;
  aiMood?: number;
  aiEmotions?: string[];
  aiConfidence?: number;
  alignmentScore?: number;
  showLabels?: boolean;
  showFlower?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const EnhancedMoodDisplay = ({ 
  userMood, 
  aiMood, 
  aiEmotions, 
  aiConfidence, 
  alignmentScore,
  showLabels = true,
  showFlower = false,
  size = 'md'
}: EnhancedMoodDisplayProps) => {
  // Convert 5-point scale to 7-point scale for flower display
  const convertTo7Point = (mood: number) => {
    return Math.round(((mood - 1) / 4) * 6) + 1;
  };

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
    if (!score) return 'text-muted-foreground';
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

  const sizeConfig = {
    sm: { flower: 40, text: 'text-sm', emoji: 'text-base' },
    md: { flower: 60, text: 'text-base', emoji: 'text-lg' },
    lg: { flower: 80, text: 'text-lg', emoji: 'text-xl' }
  };

  const config = sizeConfig[size];

  return (
    <div className="flex items-center gap-3">
      {/* User Mood */}
      {userMood && (
        <div className="text-center">
          {showFlower ? (
            <MoodFlower mood={convertTo7Point(userMood)} size={config.flower} />
          ) : (
            <div className={config.emoji}>{getMoodEmoji(userMood)}</div>
          )}
          {showLabels && (
            <div className={`text-xs text-muted-foreground ${config.text}`}>
              Your mood
            </div>
          )}
        </div>
      )}

      {/* AI Mood */}
      {aiMood && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-center cursor-help">
                {showFlower ? (
                  <div className="opacity-75">
                    <MoodFlower mood={convertTo7Point(aiMood)} size={config.flower} />
                  </div>
                ) : (
                  <div className={`opacity-75 ${config.emoji}`}>
                    {getMoodEmoji(aiMood)}
                  </div>
                )}
                {showLabels && (
                  <div className={`text-xs text-muted-foreground ${config.text}`}>
                    AI detected
                  </div>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="space-y-1">
                <p>AI detected mood: {aiMood}/5</p>
                {aiConfidence && (
                  <p>Confidence: {Math.round(aiConfidence * 100)}%</p>
                )}
                {aiEmotions && aiEmotions.length > 0 && (
                  <p>Emotions: {aiEmotions.slice(0, 3).join(', ')}{aiEmotions.length > 3 ? '...' : ''}</p>
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
                <div className={`font-medium ${config.text}`}>
                  {Math.round(alignmentScore * 100)}%
                </div>
                {showLabels && (
                  <div className={`text-xs ${config.text}`}>
                    Alignment
                  </div>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{getAlignmentText(alignmentScore)}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};