
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

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
  const moodOptions = [
    { value: 5, emoji: '😄', label: 'Excellent' },
    { value: 4, emoji: '😊', label: 'Good' },
    { value: 3, emoji: '😐', label: 'Neutral' },
    { value: 2, emoji: '😕', label: 'Low' },
    { value: 1, emoji: '😞', label: 'Very Low' },
  ];

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center p-4"
    >
      <Card className="bg-gray-800 border-gray-700 w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-white text-lg">
            How would you rate your mood at this moment?
          </CardTitle>
          <p className="text-gray-400 text-sm">This is optional and helps us understand your emotional journey</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-2">
            {moodOptions.map((option) => (
              <Button
                key={option.value}
                onClick={() => onMoodSelect(option.value)}
                variant="ghost"
                className="h-12 justify-start text-left bg-gray-700/30 hover:bg-gray-700/50 text-white border border-gray-600/50 hover:border-gray-500"
              >
                <span className="text-2xl mr-3">{option.emoji}</span>
                <span>{option.label}</span>
              </Button>
            ))}
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button
              onClick={onSkip}
              variant="outline"
              className="w-full"
            >
              Skip
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
