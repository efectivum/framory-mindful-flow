
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle, ArrowRight, BookOpen } from 'lucide-react';
import { UserChallenge } from '@/hooks/useChallenges';
import { useNavigate } from 'react-router-dom';

interface ChallengeCardProps {
  userChallenge: UserChallenge;
  onCompleteDay: (userChallengeId: string, challengeId: string, dayNumber: number) => void;
  isCompleting: boolean;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({
  userChallenge,
  onCompleteDay,
  isCompleting
}) => {
  const navigate = useNavigate();
  const { challenge } = userChallenge;
  
  const progressPercentage = (userChallenge.current_day / challenge.duration_days) * 100;
  const isCompletedToday = userChallenge.daily_completions?.[userChallenge.current_day];
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500/20 text-green-300';
      case 'Intermediate': return 'bg-yellow-500/20 text-yellow-300';
      case 'Advanced': return 'bg-red-500/20 text-red-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const handleCompleteDay = () => {
    if (!isCompletedToday && userChallenge.current_day <= challenge.duration_days) {
      onCompleteDay(userChallenge.id, challenge.id, userChallenge.current_day);
    }
  };

  const getTodaysPrompt = () => {
    if (challenge.daily_prompts && challenge.daily_prompts.length > 0) {
      const promptIndex = (userChallenge.current_day - 1) % challenge.daily_prompts.length;
      return challenge.daily_prompts[promptIndex];
    }
    return null;
  };

  const todaysPrompt = getTodaysPrompt();

  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-white text-lg mb-2">{challenge.title}</CardTitle>
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getDifficultyColor(challenge.difficulty)}>
                {challenge.difficulty}
              </Badge>
              <Badge variant="outline" className="text-gray-300">
                {challenge.category}
              </Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/challenge/${challenge.id}`)}
            className="text-gray-400 hover:text-white"
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300 text-sm">Progress</span>
            <span className="text-gray-300 text-sm">
              Day {userChallenge.current_day} of {challenge.duration_days}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Today's Prompt */}
        {todaysPrompt && (
          <div className="p-3 bg-blue-600/10 border border-blue-600/20 rounded-lg">
            <div className="flex items-start gap-2">
              <BookOpen className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-blue-300 text-sm font-medium mb-1">Today's Focus:</p>
                <p className="text-gray-300 text-sm">{todaysPrompt}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <Button
            onClick={handleCompleteDay}
            disabled={isCompleting || isCompletedToday || userChallenge.current_day > challenge.duration_days}
            className={`flex-1 ${
              isCompletedToday 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isCompleting ? (
              'Completing...'
            ) : isCompletedToday ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Completed Today
              </>
            ) : userChallenge.current_day > challenge.duration_days ? (
              'Challenge Complete!'
            ) : (
              <>
                <Calendar className="w-4 h-4 mr-2" />
                Complete Day {userChallenge.current_day}
              </>
            )}
          </Button>
        </div>

        {/* Completion Stats */}
        <div className="text-center text-sm text-gray-400">
          {userChallenge.total_completions} of {challenge.duration_days} days completed
        </div>
      </CardContent>
    </Card>
  );
};
