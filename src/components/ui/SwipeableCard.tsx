
import React, { useState } from 'react';
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SwipeAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  action: () => void;
}

interface SwipeableCardProps {
  children: React.ReactNode;
  leftActions?: SwipeAction[];
  rightActions?: SwipeAction[];
  className?: string;
  threshold?: number;
}

export const SwipeableCard: React.FC<SwipeableCardProps> = ({
  children,
  leftActions = [],
  rightActions = [],
  className,
  threshold = 100
}) => {
  const [isRevealed, setIsRevealed] = useState<'left' | 'right' | null>(null);
  const x = useMotionValue(0);
  const backgroundColor = useTransform(
    x,
    [-threshold, 0, threshold],
    ['rgba(239, 68, 68, 0.1)', 'transparent', 'rgba(34, 197, 94, 0.1)']
  );

  const handleDragEnd = (event: any, info: PanInfo) => {
    const { offset, velocity } = info;
    
    if (Math.abs(offset.x) > threshold || Math.abs(velocity.x) > 500) {
      if (offset.x > 0 && leftActions.length > 0) {
        setIsRevealed('left');
      } else if (offset.x < 0 && rightActions.length > 0) {
        setIsRevealed('right');
      } else {
        x.set(0);
      }
    } else {
      x.set(0);
      setIsRevealed(null);
    }
  };

  const handleActionClick = (action: SwipeAction) => {
    action.action();
    x.set(0);
    setIsRevealed(null);
  };

  const resetCard = () => {
    x.set(0);
    setIsRevealed(null);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* Background Actions */}
      {leftActions.length > 0 && (
        <div className="absolute left-0 top-0 bottom-0 flex items-center justify-start pl-4 z-0">
          {leftActions.map((action, index) => (
            <motion.button
              key={action.id}
              onClick={() => handleActionClick(action)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-white font-medium",
                action.color
              )}
              initial={{ opacity: 0, x: -20 }}
              animate={{ 
                opacity: isRevealed === 'left' ? 1 : 0, 
                x: isRevealed === 'left' ? 0 : -20 
              }}
              transition={{ delay: index * 0.1 }}
            >
              {action.icon}
              {action.label}
            </motion.button>
          ))}
        </div>
      )}

      {rightActions.length > 0 && (
        <div className="absolute right-0 top-0 bottom-0 flex items-center justify-end pr-4 z-0">
          {rightActions.map((action, index) => (
            <motion.button
              key={action.id}
              onClick={() => handleActionClick(action)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-white font-medium",
                action.color
              )}
              initial={{ opacity: 0, x: 20 }}
              animate={{ 
                opacity: isRevealed === 'right' ? 1 : 0, 
                x: isRevealed === 'right' ? 0 : 20 
              }}
              transition={{ delay: index * 0.1 }}
            >
              {action.icon}
              {action.label}
            </motion.button>
          ))}
        </div>
      )}

      {/* Main Card */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -200, right: 200 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        onClick={isRevealed ? resetCard : undefined}
        style={{ x, backgroundColor }}
        className={cn(
          "relative z-10 cursor-grab active:cursor-grabbing",
          className
        )}
        whileTap={{ scale: 0.99 }}
      >
        {children}
      </motion.div>
    </div>
  );
};
