
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Trophy } from 'lucide-react';
import { Achievement } from '@/hooks/useAchievements';

interface AchievementNotificationProps {
  achievement: Achievement;
  onDismiss: () => void;
}

export const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  achievement,
  onDismiss
}) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -100, scale: 0.3 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -100, scale: 0.3 }}
        transition={{ type: "spring", duration: 0.6 }}
        className="fixed top-4 right-4 z-50 max-w-sm"
      >
        <Card className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 border-yellow-200 dark:border-yellow-800">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                {achievement.icon ? (
                  <span className="text-xl">{achievement.icon}</span>
                ) : (
                  <Trophy className="w-6 h-6 text-white" />
                )}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-yellow-900 dark:text-yellow-100">
                    🎉 Achievement Unlocked!
                  </h4>
                  <h5 className="font-medium text-yellow-800 dark:text-yellow-200">
                    {achievement.title}
                  </h5>
                  {achievement.description && (
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                      {achievement.description}
                    </p>
                  )}
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDismiss}
                  className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-200"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};
