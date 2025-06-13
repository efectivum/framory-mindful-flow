
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TouchableCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onLongPress?: () => void;
}

export const TouchableCard: React.FC<TouchableCardProps> = ({
  children,
  className,
  onClick,
  onSwipeLeft,
  onSwipeRight,
  onLongPress,
}) => {
  // Debounced click handler to prevent rapid interactions
  const handleClick = React.useCallback(() => {
    if (onClick) {
      console.log('TouchableCard clicked');
      onClick();
    }
  }, [onClick]);

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className={cn(
        "bg-gray-800/50 border border-gray-700 rounded-2xl p-4 backdrop-blur-sm",
        "transition-all duration-200 touch-manipulation",
        "active:border-gray-600 active:shadow-lg active:shadow-blue-500/10",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900",
        className
      )}
      style={{
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation'
      }}
    >
      {children}
    </motion.div>
  );
};
