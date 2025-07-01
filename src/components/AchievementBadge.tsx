
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
      return 'bg-gray-600/30 border-gray-500/50';
    }

    switch (milestone.celebrationStyle) {
      case 'fire':
        return 'bg-gradient-to-br from-orange-500 to-red-500';
      case 'stars':
        return 'bg-gradient-to-br from-yellow-400 to-orange-500';
      case 'growth':
        return 'bg-gradient-to-br from-green-400 to-emerald-500';
      case 'rainbow':
        return 'bg-gradient-to-br from-purple-500 to-pink-500';
      default:
        return 'bg-gradient-to-br from-blue-500 to-purple-500';
    }
  };

  const getRarityBorder = () => {
    if (!milestone.achieved) return '';
    
    // Determine rarity based on milestone type and target
    if (milestone.type === 'growth' || (milestone.id && milestone.id.includes('100'))) {
      return 'ring-2 ring-yellow-400 ring-opacity-50';
    }
    if (milestone.id && (milestone.id.includes('50') || milestone.id.includes('30'))) {
      return 'ring-2 ring-purple-400 ring-opacity-50';
    }
    return 'ring-1 ring-white/20';
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              relative w-20 h-20 rounded-2xl flex flex-col items-center justify-center
              transition-all duration-300 cursor-pointer
              ${getGradientStyle()}
              ${getRarityBorder()}
              ${!milestone.achieved ? 'opacity-50 grayscale' : 'shadow-lg hover:shadow-xl'}
            `}
          >
            {/* Badge Icon */}
            <div className="text-2xl mb-1">
              {milestone.achieved ? milestone.icon : '🔒'}
            </div>
            
            {/* Category Badge */}
            <Badge 
              variant="secondary" 
              className="absolute -bottom-2 text-xs px-2 py-0.5 bg-black/50 text-white border-none"
            >
              {milestone.category}
            </Badge>

            {/* Progress Ring for Locked Badges */}
            {!milestone.achieved && showProgress && milestone.progress > 0 && (
              <div className="absolute inset-0 rounded-2xl">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
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
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            )}
          </motion.div>
        </TooltipTrigger>
        
        <TooltipContent side="top" className="max-w-xs">
          <div className="text-center">
            <div className="font-semibold text-white mb-1">{milestone.title}</div>
            <div className="text-gray-300 text-sm mb-2">{milestone.description}</div>
            
            {milestone.achieved ? (
              <div className="text-green-400 text-xs">
                Earned {milestone.achievedAt ? 
                  new Date(milestone.achievedAt).toLocaleDateString() : 
                  'recently'
                }
              </div>
            ) : (
              <div className="space-y-1">
                <div className="text-gray-400 text-xs">
                  Progress: {Math.round(milestone.progress * 100)}%
                </div>
                {milestone.nextTarget && (
                  <div className="text-yellow-400 text-xs">
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
