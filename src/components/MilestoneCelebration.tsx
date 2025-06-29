
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Trophy, Star, Flame, Sparkles, Rainbow } from 'lucide-react';
import { Milestone } from '@/hooks/useMilestoneDetection';

interface MilestoneCelebrationProps {
  milestone: Milestone;
  onDismiss: () => void;
  autoHide?: boolean;
  duration?: number;
}

export const MilestoneCelebration: React.FC<MilestoneCelebrationProps> = ({
  milestone,
  onDismiss,
  autoHide = true,
  duration = 5000
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoHide) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onDismiss, 300);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoHide, duration, onDismiss]);

  const getCelebrationIcon = () => {
    switch (milestone.celebrationStyle) {
      case 'fire':
        return <Flame className="w-8 h-8 text-orange-400" />;
      case 'stars':
        return <Star className="w-8 h-8 text-yellow-400" />;
      case 'growth':
        return <Sparkles className="w-8 h-8 text-green-400" />;
      case 'rainbow':
        return <Rainbow className="w-8 h-8 text-purple-400" />;
      default:
        return <Trophy className="w-8 h-8 text-yellow-400" />;
    }
  };

  const getCelebrationGradient = () => {
    switch (milestone.celebrationStyle) {
      case 'fire':
        return 'from-orange-500 via-red-500 to-pink-500';
      case 'stars':
        return 'from-yellow-400 via-yellow-500 to-orange-500';
      case 'growth':
        return 'from-green-400 via-emerald-500 to-teal-500';
      case 'rainbow':
        return 'from-purple-500 via-pink-500 to-red-500';
      default:
        return 'from-blue-500 via-purple-500 to-pink-500';
    }
  };

  const confettiPieces = Array.from({ length: 20 }, (_, i) => i);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.3, y: -100 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.3, y: -100 }}
        transition={{ type: "spring", duration: 0.6 }}
        className="fixed top-4 right-4 z-50 max-w-sm"
      >
        <Card className={`bg-gradient-to-br ${getCelebrationGradient()} border-white/20 shadow-2xl relative overflow-hidden`}>
          {/* Confetti Animation */}
          {milestone.celebrationStyle === 'confetti' && (
            <div className="absolute inset-0 pointer-events-none">
              {confettiPieces.map((i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white rounded-full opacity-80"
                  initial={{
                    x: Math.random() * 300,
                    y: -10,
                    rotate: 0,
                    scale: Math.random() * 0.5 + 0.5
                  }}
                  animate={{
                    y: 400,
                    rotate: 360,
                    opacity: 0
                  }}
                  transition={{
                    duration: Math.random() * 2 + 2,
                    delay: Math.random() * 0.5,
                    ease: "easeOut"
                  }}
                />
              ))}
            </div>
          )}

          {/* Sparkle Effects */}
          {(milestone.celebrationStyle === 'stars' || milestone.celebrationStyle === 'growth') && (
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 8 }, (_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                    rotate: [0, 180, 360]
                  }}
                  transition={{
                    duration: 2,
                    delay: Math.random() * 1,
                    repeat: Infinity,
                    repeatDelay: Math.random() * 2
                  }}
                >
                  <Star className="w-3 h-3 text-white/60" />
                </motion.div>
              ))}
            </div>
          )}

          <CardContent className="p-6 relative">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: milestone.celebrationStyle === 'fire' ? [0, 5, -5, 0] : 0
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  className="text-4xl"
                >
                  {milestone.icon}
                </motion.div>
                <div>
                  <Badge variant="outline" className="text-white/90 border-white/30 mb-2">
                    {milestone.category}
                  </Badge>
                  <div className="flex items-center gap-2">
                    {getCelebrationIcon()}
                    <span className="text-sm text-white/80 font-medium">Milestone Achieved!</span>
                  </div>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsVisible(false);
                  setTimeout(onDismiss, 300);
                }}
                className="text-white/80 hover:text-white hover:bg-white/10 rounded-full"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-3">
              <h3 className="text-white font-bold text-xl">{milestone.title}</h3>
              <p className="text-white/90 text-sm leading-relaxed">
                {milestone.description}
              </p>
              
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-center pt-4"
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">🎉</div>
                  <div className="text-white/80 text-xs font-medium">
                    Keep up the amazing work!
                  </div>
                </div>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};
