
import React from 'react';
import { motion } from 'framer-motion';
import { getEmotionColor } from '@/utils/emotionUtils';

interface EmotionBubbleGridProps {
  emotions: Record<string, number>;
  onEmotionClick: (emotion: string) => void;
}

export const EmotionBubbleGrid = ({ emotions, onEmotionClick }: EmotionBubbleGridProps) => {
  const maxIntensity = Math.max(...Object.values(emotions));
  const minSize = 60;
  const maxSize = 120;

  const getBubbleSize = (intensity: number) => {
    const normalizedIntensity = intensity / maxIntensity;
    return minSize + (maxSize - minSize) * normalizedIntensity;
  };

  const sortedEmotions = Object.entries(emotions)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);

  return (
    <motion.div
      key="bubbles"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 p-2 sm:p-4"
    >
      {sortedEmotions.map(([emotion, intensity], index) => {
        const size = getBubbleSize(intensity);
        return (
          <motion.div
            key={emotion}
            className="flex justify-center"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              delay: index * 0.1,
              type: "spring",
              stiffness: 200,
              damping: 15
            }}
          >
            <div
              className={`
                relative rounded-full cursor-pointer transition-all duration-300 
                touch-manipulation active:scale-95 
                ${getEmotionColor(emotion)} opacity-80 active:opacity-100
                flex items-center justify-center text-white font-medium
                min-h-[44px] min-w-[44px]
              `}
              style={{ 
                width: `${Math.max(size, 44)}px`, 
                height: `${Math.max(size, 44)}px`,
                fontSize: `${Math.max(11, size / 7)}px`
              }}
              onClick={() => onEmotionClick(emotion)}
              title={`${emotion}: ${intensity.toFixed(1)}/10`}
            >
              <div className="text-center px-1">
                <div className="font-medium capitalize leading-tight">{emotion}</div>
                <div className="text-xs opacity-90 mt-0.5">{intensity.toFixed(1)}</div>
              </div>
            </div>
          </motion.div>
        );
      })}
      <div className="col-span-2 sm:col-span-3 text-center mt-4">
        <p className="text-gray-400 text-sm">
          Tap on emotions to explore detailed insights
        </p>
      </div>
    </motion.div>
  );
};
