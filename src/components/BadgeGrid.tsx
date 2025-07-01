
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
    <div className="space-y-4">
      {/* Category Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">
            {achievedCount}/{totalCount}
          </span>
          <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
              style={{ width: `${(achievedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Badge Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4">
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
