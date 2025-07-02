
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, Target } from 'lucide-react';
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
  // Don't render if no milestone data
  if (totalMilestones === 0) {
    return null;
  }

  // Ensure overallProgress is valid
  const safeOverallProgress = Math.max(0, Math.min(1, overallProgress || 0)) * 100;

  return (
    <Card className="app-card-organic mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Trophy className="w-5 h-5 text-yellow-400" />
          Your Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Overall Progress */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-300">Overall Achievement</span>
              <span className="text-sm text-gray-300">
                {totalAchieved}/{totalMilestones}
              </span>
            </div>
            <Progress 
              value={safeOverallProgress} 
              className="h-2"
            />
            <div className="text-center text-xs text-gray-400 mt-1">
              {Math.round(safeOverallProgress)}% Complete
            </div>
          </div>

          {/* Next Milestones */}
          {nextMilestones.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Next Achievements
              </h4>
              <div className="space-y-3">
                {nextMilestones.map((milestone) => {
                  const safeProgress = Math.max(0, Math.min(1, milestone.progress || 0)) * 100;
                  
                  return (
                    <div key={milestone.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{milestone.icon}</span>
                          <div>
                            <div className="text-sm font-medium text-white">
                              {milestone.title}
                            </div>
                            <div className="text-xs text-gray-400">
                              {milestone.description}
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-400">
                          {Math.round(safeProgress)}%
                        </div>
                      </div>
                      <Progress 
                        value={safeProgress} 
                        className="h-1.5"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
