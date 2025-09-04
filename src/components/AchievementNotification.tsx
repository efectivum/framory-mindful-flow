
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
        className="mobile-fixed mobile-top-4 mobile-right-4 mobile-z-50 mobile-max-w-sm"
      >
        <Card className="mobile-p-4 mobile-bg-yellow-50 dark:mobile-bg-yellow-950 mobile-border-yellow-200 dark:mobile-border-yellow-800">
          <div className="mobile-flex mobile-flex-start mobile-gap-3">
            <div className="mobile-flex-shrink-0">
              <div className="mobile-w-12 mobile-h-12 mobile-bg-gradient-warning mobile-rounded-full mobile-flex mobile-flex-center">
                {achievement.icon ? (
                  <span className="mobile-text-xl">{achievement.icon}</span>
                ) : (
                  <Trophy className="mobile-w-6 mobile-h-6 mobile-text-white" />
                )}
              </div>
            </div>
            
            <div className="mobile-flex-1 mobile-min-w-0">
              <div className="mobile-flex mobile-flex-start mobile-flex-between">
                <div>
                  <h4 className="mobile-font-semibold mobile-text-yellow-900 dark:mobile-text-yellow-100">
                    🎉 Achievement Unlocked!
                  </h4>
                  <h5 className="mobile-font-medium mobile-text-yellow-800 dark:mobile-text-yellow-200">
                    {achievement.title}
                  </h5>
                  {achievement.description && (
                    <p className="mobile-text-sm mobile-text-yellow-700 dark:mobile-text-yellow-300 mobile-mt-1">
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
                  <X className="mobile-w-4 mobile-h-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};
