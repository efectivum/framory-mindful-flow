
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
        return <Target className="mobile-w-5 mobile-h-5" />;
      case 'consistency':
        return <Zap className="mobile-w-5 mobile-h-5" />;
      case 'habits':
        return <Trophy className="mobile-w-5 mobile-h-5" />;
      case 'growth':
        return <Brain className="mobile-w-5 mobile-h-5" />;
      default:
        return <Trophy className="mobile-w-5 mobile-h-5" />;
    }
  };

  if (totalMilestones === 0) {
    return (
      <Card className="app-card-organic">
        <CardContent className="mobile-p-6 mobile-text-center">
          <Trophy className="mobile-w-12 mobile-h-12 mobile-text-gray-400 mobile-mx-auto mobile-mb-4" />
          <h3 className="mobile-text-lg mobile-font-semibold mobile-text-white mobile-mb-2">No Achievements Yet</h3>
          <p className="mobile-text-gray-400">Start your journey by writing your first journal entry!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="app-card-organic">
      <CardHeader>
        <div className="mobile-flex mobile-flex-center mobile-flex-between">
          <CardTitle className="mobile-flex mobile-flex-center mobile-gap-2 mobile-text-white">
            <Trophy className="mobile-w-6 mobile-h-6 mobile-text-yellow-400" />
            Achievements
          </CardTitle>
          <div className="mobile-text-right">
            <div className="mobile-text-lg mobile-font-bold mobile-text-white">
              {totalAchieved}/{totalMilestones}
            </div>
            <div className="mobile-text-sm mobile-text-gray-400">Unlocked</div>
          </div>
        </div>
        
        {/* Overall Progress Bar */}
        <div className="mobile-w-full mobile-h-3 mobile-bg-gray-700 mobile-rounded-full mobile-overflow-hidden">
          <div 
            className="mobile-h-full mobile-bg-gradient-primary mobile-transition-all duration-1000"
            style={{ width: `${overallProgress * 100}%` }}
          />
        </div>
        <div className="mobile-text-center mobile-text-sm mobile-text-gray-400">
          {Math.round(overallProgress * 100)}% Complete
        </div>
      </CardHeader>
      
      <CardContent className="mobile-p-6 mobile-space-y-8">
        {Object.entries(milestonesByCategory).map(([category, categoryMilestones]) => (
          <div key={category}>
            <div className="mobile-flex mobile-flex-center mobile-gap-2 mobile-mb-4">
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
