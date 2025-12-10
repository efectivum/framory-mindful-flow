
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
      <Card className="card-serene">
        <CardContent className="p-6 text-center">
          <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Achievements Yet</h3>
          <p className="text-muted-foreground">Start your journey by writing your first journal entry!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-serene">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Trophy className="w-6 h-6 text-warning" />
            Achievements
          </CardTitle>
          <div className="text-right">
            <div className="text-lg font-bold text-foreground">
              {totalAchieved}/{totalMilestones}
            </div>
            <div className="text-sm text-muted-foreground">Unlocked</div>
          </div>
        </div>
        
        {/* Overall Progress Bar */}
        <div className="w-full h-3 bg-muted rounded-full overflow-hidden mt-4">
          <div 
            className="h-full bg-primary transition-all duration-1000 rounded-full"
            style={{ width: `${overallProgress * 100}%` }}
          />
        </div>
        <div className="text-center text-sm text-muted-foreground mt-2">
          {Math.round(overallProgress * 100)}% Complete
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-8">
        {Object.entries(milestonesByCategory).map(([category, categoryMilestones]) => (
          <div key={category}>
            <div className="flex items-center gap-2 mb-4 text-muted-foreground">
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
