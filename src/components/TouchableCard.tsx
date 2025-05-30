
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
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className={cn(
        "bg-gray-800/50 border border-gray-700 rounded-2xl p-4 backdrop-blur-sm",
        "transition-all duration-200 touch-manipulation",
        "hover:border-gray-600 hover:shadow-lg hover:shadow-blue-500/10",
        "active:shadow-md active:shadow-blue-500/20",
        className
      )}
    >
      {children}
    </motion.div>
  );
};
