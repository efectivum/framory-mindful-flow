
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FlippableCardProps {
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
  className?: string;
  height?: string;
  isFlipped?: boolean;
  onFlip?: (flipped: boolean) => void;
  flipOnHover?: boolean;
  flipOnClick?: boolean;
}

export const FlippableCard: React.FC<FlippableCardProps> = ({
  frontContent,
  backContent,
  className,
  height = "h-[290px]",
  isFlipped: controlledFlipped,
  onFlip,
  flipOnHover = true,
  flipOnClick = true
}) => {
  const [internalFlipped, setInternalFlipped] = useState(false);
  
  const isFlipped = controlledFlipped !== undefined ? controlledFlipped : internalFlipped;
  
  const handleFlip = () => {
    if (flipOnClick) {
      const newFlipped = !isFlipped;
      if (controlledFlipped === undefined) {
        setInternalFlipped(newFlipped);
      }
      onFlip?.(newFlipped);
    }
  };

  const handleMouseEnter = () => {
    if (flipOnHover && controlledFlipped === undefined) {
      setInternalFlipped(true);
    }
  };

  const handleMouseLeave = () => {
    if (flipOnHover && controlledFlipped === undefined) {
      setInternalFlipped(false);
    }
  };

  return (
    <div 
      className={cn("relative w-full", height, className)}
      style={{ perspective: '1000px' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleFlip}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(0deg)'
          }}
        >
          {frontContent}
        </div>
        
        {/* Back */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          {backContent}
        </div>
      </motion.div>
    </div>
  );
};
