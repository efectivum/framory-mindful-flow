
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, Star } from 'lucide-react';
import { Milestone } from '@/hooks/useMilestoneDetection';

interface MilestoneProgressProps {
  nextMilestones: Milestone[];
  totalAchieved: number;
  totalMilestones: number;
  overallProgress: number;
}

export const MilestoneProgress: React.FC<MilestoneProgressProps> = ({
  nextMilestones,
  totalAchieved,
  totalMilestones,
  overallProgress
}) => {
  return (
    <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          Milestone Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-300">Overall Achievement</span>
            <span className="text-sm text-gray-400">{totalAchieved}/{totalMilestones}</span>
          </div>
          <Progress 
            value={overallProgress * 100} 
            className="h-2 bg-gray-700"
          />
          <div className="text-center">
            <Badge variant="outline" className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
              {Math.round(overallProgress * 100)}% Complete
            </Badge>
          </div>
        </div>

        {/* Next Milestones */}
        {nextMilestones.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-gray-300">
              <Target className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium">Next Achievements</span>
            </div>
            
            <div className="space-y-3">
              {nextMilestones.map((milestone) => (
                <div key={milestone.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{milestone.icon}</span>
                      <div>
                        <span className="text-sm font-medium text-gray-200">{milestone.title}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="bg-gray-700/50 text-gray-300 text-xs">
                            {milestone.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">
                      {Math.round(milestone.progress * 100)}%
                    </span>
                  </div>
                  
                  <Progress 
                    value={milestone.progress * 100} 
                    className="h-1.5 bg-gray-700"
                  />
                  
                  {milestone.nextTarget && (
                    <div className="text-xs text-gray-400">
                      {milestone.nextTarget - Math.floor(milestone.progress * milestone.nextTarget)} more to go!
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {nextMilestones.length === 0 && totalAchieved > 0 && (
          <div className="text-center py-6">
            <Star className="w-12 h-12 text-yellow-400 mx-auto mb-3 animate-pulse" />
            <p className="text-gray-300 font-medium">All current milestones achieved!</p>
            <p className="text-gray-400 text-sm mt-1">Keep journaling to unlock new achievements</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
