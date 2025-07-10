
import React from 'react';
import { motion } from 'framer-motion';
import { MoodSelector } from './mood/MoodSelector';

interface MoodCaptureStepProps {
  onMoodSelect: (mood?: number) => void;
  onSkip: () => void;
  isVisible: boolean;
}

export const MoodCaptureStep: React.FC<MoodCaptureStepProps> = ({
  onMoodSelect,
  onSkip,
  isVisible
}) => {
  if (!isVisible) return null;

  // Convert 7-point scale to 5-point scale for backward compatibility
  const handleMoodSelect = (mood: number) => {
    // Map 7-point scale (1-7) to 5-point scale (1-5)
    const mappedMood = Math.round(((mood - 1) / 6) * 4) + 1;
    onMoodSelect(mappedMood);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center p-4"
    >
      <div className="w-full max-w-md">
        <MoodSelector
          initialMood={4}
          onMoodSelect={handleMoodSelect}
          onSkip={onSkip}
          title="How are you feeling right now?"
          subtitle="This helps us understand your emotional journey"
          showSkip={true}
          size="md"
        />
      </div>
    </motion.div>
  );
};
