
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
    <Card className="bg-card/50 border-border backdrop-blur">
      <CardHeader className="pb-3">
        <div className="mobile-flex mobile-flex-between mobile-flex-start">
          <div className="flex-1">
            <CardTitle className="text-foreground mobile-h3 mb-2">{challenge.title}</CardTitle>
            <div className="mobile-flex mobile-flex-center mobile-gap-sm mb-2">
              <Badge className={getDifficultyColor(challenge.difficulty)}>
                {challenge.difficulty}
              </Badge>
              <Badge variant="outline" className="text-muted-foreground">
                {challenge.category}
              </Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/challenge/${challenge.id}`)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="mobile-flow">
        {/* Progress */}
        <div className="mobile-flow-tight">
          <div className="mobile-flex mobile-flex-between mobile-flex-center mb-2">
            <span className="text-muted-foreground mobile-text-sm">Progress</span>
            <span className="text-muted-foreground mobile-text-sm">
              Day {userChallenge.current_day} of {challenge.duration_days}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Today's Prompt */}
        {todaysPrompt && (
          <div className="mobile-card-content bg-primary/10 border border-primary/20 rounded-lg">
            <div className="mobile-flex mobile-flex-start mobile-gap-sm">
              <BookOpen className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div className="mobile-flow-tight">
                <p className="text-primary mobile-text-sm font-medium">Today's Focus:</p>
                <p className="text-muted-foreground mobile-text-sm">{todaysPrompt}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="mobile-flex mobile-flex-center mobile-gap-md">
          <Button
            onClick={handleCompleteDay}
            disabled={isCompleting || isCompletedToday || userChallenge.current_day > challenge.duration_days}
            variant={isCompletedToday ? "default" : "default"}
            className="flex-1"
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
        <div className="mobile-center mobile-text-sm text-muted-foreground">
          {userChallenge.total_completions} of {challenge.duration_days} days completed
        </div>
      </CardContent>
    </Card>
  );
};
