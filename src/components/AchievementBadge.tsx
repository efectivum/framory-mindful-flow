
import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { Milestone } from '@/hooks/useMilestoneDetection';

interface AchievementBadgeProps {
  milestone: Milestone;
  showProgress?: boolean;
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({ 
  milestone, 
  showProgress = false 
}) => {
  const getGradientStyle = () => {
    if (!milestone.achieved) {
      return 'mobile-bg-secondary border-muted';
    }

    switch (milestone.celebrationStyle) {
      case 'fire':
        return 'mobile-bg-gradient-error';
      case 'stars':
        return 'mobile-bg-gradient-warning';
      case 'growth':
        return 'mobile-bg-gradient-success';
      case 'rainbow':
        return 'mobile-bg-gradient-accent';
      default:
        return 'mobile-bg-gradient-primary';
    }
  };

  const getRarityBorder = () => {
    if (!milestone.achieved) return '';
    
    // Determine rarity based on milestone type and target
    if (milestone.type === 'growth' || (milestone.id && milestone.id.includes('100'))) {
      return 'mobile-ring-2 mobile-ring-warning mobile-ring-opacity-50';
    }
    if (milestone.id && (milestone.id.includes('50') || milestone.id.includes('30'))) {
      return 'mobile-ring-2 mobile-ring-primary mobile-ring-opacity-50';
    }
    return 'mobile-ring-1';
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              mobile-relative mobile-w-20 mobile-h-20 mobile-rounded-lg mobile-flex mobile-flex-col mobile-flex-center
              transition-all duration-300 cursor-pointer
              ${getGradientStyle()}
              ${getRarityBorder()}
              ${!milestone.achieved ? 'opacity-50 grayscale' : 'mobile-shadow-floating'}
            `}
          >
            {/* Badge Icon */}
            <div className="mobile-text-2xl mobile-mb-1">
              {milestone.achieved ? milestone.icon : '🔒'}
            </div>
            
            {/* Category Badge */}
            <Badge 
              variant="secondary" 
              className="mobile-badge mobile-absolute -bottom-2 mobile-bg-primary mobile-text-primary border-none"
            >
              {milestone.category}
            </Badge>

            {/* Progress Ring for Locked Badges */}
            {!milestone.achieved && showProgress && milestone.progress > 0 && (
              <div className="mobile-absolute mobile-inset-0 mobile-rounded-lg">
                <svg className="mobile-w-full mobile-h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="2"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="rgba(255,255,255,0.8)"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray={`${milestone.progress * 283} 283`}
                    className="transition-all duration-500"
                  />
                </svg>
              </div>
            )}

            {/* New Badge Indicator */}
            {milestone.achieved && milestone.achievedAt && 
             new Date().getTime() - milestone.achievedAt.getTime() < 24 * 60 * 60 * 1000 && (
              <div className="mobile-absolute -top-1 -right-1 mobile-w-3 mobile-h-3 mobile-bg-error mobile-rounded-full animate-pulse" />
            )}
          </motion.div>
        </TooltipTrigger>
        
        <TooltipContent side="top" className="max-w-xs">
          <div className="mobile-text-center">
            <div className="font-semibold mobile-text-primary mobile-mb-1">{milestone.title}</div>
            <div className="mobile-text-secondary mobile-text-body mobile-mb-2">{milestone.description}</div>
            
            {milestone.achieved ? (
              <div className="mobile-text-success mobile-text-xs">
                Earned {milestone.achievedAt ? 
                  new Date(milestone.achievedAt).toLocaleDateString() : 
                  'recently'
                }
              </div>
            ) : (
              <div className="mobile-space-y-1">
                <div className="mobile-text-secondary mobile-text-xs">
                  Progress: {Math.round(milestone.progress * 100)}%
                </div>
                {milestone.nextTarget && (
                  <div className="mobile-text-yellow-400 mobile-text-xs">
                    {milestone.nextTarget - Math.floor(milestone.progress * milestone.nextTarget)} more to go!
                  </div>
                )}
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
