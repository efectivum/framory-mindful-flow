
import React from 'react';
import { BadgeGrid } from '@/components/BadgeGrid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Target, Zap, Brain } from 'lucide-react';
import { useMilestoneDetection } from '@/hooks/useMilestoneDetection';

export const AchievementsSection: React.FC = () => {
  const { milestones, totalAchieved, totalMilestones, overallProgress } = useMilestoneDetection();

  // Group milestones by category
  const milestonesByCategory = milestones.reduce((acc, milestone) => {
    if (!acc[milestone.category]) {
      acc[milestone.category] = [];
    }
    acc[milestone.category].push(milestone);
    return acc;
  }, {} as Record<string, typeof milestones>);

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'writing':
        return <Target className="w-5 h-5" />;
      case 'consistency':
        return <Zap className="w-5 h-5" />;
      case 'habits':
        return <Trophy className="w-5 h-5" />;
      case 'growth':
        return <Brain className="w-5 h-5" />;
      default:
        return <Trophy className="w-5 h-5" />;
    }
  };

  if (totalMilestones === 0) {
    return (
      <Card className="app-card-organic">
        <CardContent className="p-6 text-center">
          <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No Achievements Yet</h3>
          <p className="text-gray-400">Start your journey by writing your first journal entry!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="app-card-organic">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-white">
            <Trophy className="w-6 h-6 text-yellow-400" />
            Achievements
          </CardTitle>
          <div className="text-right">
            <div className="text-lg font-bold text-white">
              {totalAchieved}/{totalMilestones}
            </div>
            <div className="text-sm text-gray-400">Unlocked</div>
          </div>
        </div>
        
        {/* Overall Progress Bar */}
        <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 transition-all duration-1000"
            style={{ width: `${overallProgress * 100}%` }}
          />
        </div>
        <div className="text-center text-sm text-gray-400">
          {Math.round(overallProgress * 100)}% Complete
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-8">
        {Object.entries(milestonesByCategory).map(([category, categoryMilestones]) => (
          <div key={category}>
            <div className="flex items-center gap-2 mb-4">
              {getCategoryIcon(category)}
              <BadgeGrid
                milestones={categoryMilestones}
                title={category}
                showProgress={true}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
