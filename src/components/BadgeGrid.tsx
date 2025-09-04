
import React from 'react';
import { AchievementBadge } from '@/components/AchievementBadge';
import { Milestone } from '@/hooks/useMilestoneDetection';

interface BadgeGridProps {
  milestones: Milestone[];
  title: string;
  showProgress?: boolean;
}

export const BadgeGrid: React.FC<BadgeGridProps> = ({ 
  milestones, 
  title, 
  showProgress = true 
}) => {
  if (milestones.length === 0) return null;

  // Sort milestones: achieved first, then by progress
  const sortedMilestones = [...milestones].sort((a, b) => {
    if (a.achieved && !b.achieved) return -1;
    if (!a.achieved && b.achieved) return 1;
    if (!a.achieved && !b.achieved) return b.progress - a.progress;
    return 0;
  });

  const achievedCount = milestones.filter(m => m.achieved).length;
  const totalCount = milestones.length;

  return (
    <div className="mobile-flow">
      {/* Category Header */}
      <div className="mobile-flex mobile-flex-between mobile-flex-center">
        <h3 className="mobile-h3 text-foreground">{title}</h3>
        <div className="mobile-flex mobile-flex-center mobile-gap-sm">
          <span className="mobile-text-sm text-muted-foreground">
            {achievedCount}/{totalCount}
          </span>
          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-accent to-primary transition-all duration-500"
              style={{ width: `${(achievedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Badge Grid */}
      <div className="mobile-badge-grid">
        {sortedMilestones.map((milestone) => (
          <AchievementBadge
            key={milestone.id}
            milestone={milestone}
            showProgress={showProgress}
          />
        ))}
      </div>
    </div>
  );
};
