
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
  flipOnHover = false, // Changed default to false for better mobile experience
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
    // Only enable hover on non-touch devices
    if (flipOnHover && controlledFlipped === undefined && !('ontouchstart' in window)) {
      setInternalFlipped(true);
    }
  };

  const handleMouseLeave = () => {
    // Only enable hover on non-touch devices
    if (flipOnHover && controlledFlipped === undefined && !('ontouchstart' in window)) {
      setInternalFlipped(false);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    // Prevent default to avoid unwanted behaviors
    if (flipOnClick) {
      e.preventDefault();
    }
  };

  return (
    <div 
      className={cn("relative cursor-pointer", height, className)}
      style={{ 
        perspective: '1000px',
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation',
        width: '100%',
        maxWidth: '100%'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleFlip}
      onTouchStart={handleTouchStart}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleFlip();
        }
      }}
      aria-label="Flip card to see more information"
    >
      <motion.div
        className="relative w-full h-full"
        style={{ 
          transformStyle: 'preserve-3d',
          width: '100%',
          maxWidth: '100%'
        }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(0deg)',
            WebkitBackfaceVisibility: 'hidden',
            width: '100%',
            maxWidth: '100%'
          }}
        >
          {frontContent}
        </div>
        
        {/* Back */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            WebkitBackfaceVisibility: 'hidden',
            width: '100%',
            maxWidth: '100%'
          }}
        >
          {backContent}
        </div>
      </motion.div>
    </div>
  );
};
