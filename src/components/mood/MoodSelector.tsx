import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoodFlower } from './MoodFlower';
import { MoodGradient } from './MoodGradient';
import { MoodScale } from './MoodScale';

interface MoodSelectorProps {
  initialMood?: number;
  onMoodSelect: (mood: number) => void;
  onSkip?: () => void;
  title?: string;
  subtitle?: string;
  showSkip?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const MoodSelector = ({
  initialMood = 4,
  onMoodSelect,
  onSkip,
  title = "How are you feeling?",
  subtitle = "Select your current mood level",
  showSkip = false,
  size = 'md'
}: MoodSelectorProps) => {
  const [selectedMood, setSelectedMood] = useState(initialMood);
  const [isSelecting, setIsSelecting] = useState(false);

  const handleMoodChange = (mood: number) => {
    setSelectedMood(mood);
    setIsSelecting(true);
    
    // Haptic feedback simulation
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  const handleConfirm = () => {
    onMoodSelect(selectedMood);
  };

  const sizeConfig = {
    sm: {
      flower: 80,
      container: 'p-4',
      title: 'text-lg',
      subtitle: 'text-sm'
    },
    md: {
      flower: 120,
      container: 'p-6',
      title: 'text-xl',
      subtitle: 'text-base'
    },
    lg: {
      flower: 160,
      container: 'p-8',
      title: 'text-2xl',
      subtitle: 'text-lg'
    }
  };

  const config = sizeConfig[size];

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* Background gradient */}
      <MoodGradient mood={selectedMood} />
      
      {/* Content */}
      <div className={`relative z-10 ${config.container}`}>
        {/* Header */}
        <div className="text-center mb-6">
          <motion.h3 
            className={`font-semibold text-white mb-2 ${config.title}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {title}
          </motion.h3>
          <motion.p 
            className={`text-white/80 ${config.subtitle}`}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {subtitle}
          </motion.p>
        </div>

        {/* Flower visualization */}
        <div className="flex justify-center mb-8">
          <MoodFlower mood={selectedMood} size={config.flower} />
        </div>

        {/* Mood scale */}
        <div className="mb-6">
          <MoodScale
            selectedMood={selectedMood}
            onMoodChange={handleMoodChange}
            size={size}
          />
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 justify-center">
          {showSkip && onSkip && (
            <motion.button
              onClick={onSkip}
              className="px-6 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full font-medium transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Skip
            </motion.button>
          )}
          
          <motion.button
            onClick={handleConfirm}
            className="px-8 py-2 bg-white text-gray-900 hover:bg-white/90 rounded-full font-medium transition-colors shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Confirm
          </motion.button>
        </div>

        {/* Selecting animation overlay */}
        <AnimatePresence>
          {isSelecting && (
            <motion.div
              className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onAnimationComplete={() => setIsSelecting(false)}
            >
              <motion.div
                className="text-white text-lg font-medium"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.2, opacity: 0 }}
              >
                ✨ Selected!
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};