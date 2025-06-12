
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Heart, Target, Play, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CoachingResponseProps {
  level: 1 | 2 | 3;
  content: string;
  type: string;
  action?: string;
  actionLabel?: string;
  patternDetected?: string;
  onActionClick?: () => void;
  onEngagement?: (engaged: boolean) => void;
}

export const CoachingResponse = ({
  level,
  content,
  type,
  action,
  actionLabel,
  patternDetected,
  onActionClick,
  onEngagement
}: CoachingResponseProps) => {
  const [hasEngaged, setHasEngaged] = useState(false);

  const handleActionClick = () => {
    setHasEngaged(true);
    onActionClick?.();
    onEngagement?.(true);
  };

  const handleDismiss = () => {
    setHasEngaged(true);
    onEngagement?.(false);
  };

  // Level 1: Minimal acknowledgment
  if (level === 1) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center justify-center py-2"
      >
        {content === '✓' ? (
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <Check className="w-4 h-4 text-white" />
          </div>
        ) : (
          <span className="text-gray-400 text-sm italic">{content}</span>
        )}
      </motion.div>
    );
  }

  // Level 2: Pattern insights
  if (level === 2) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="my-4"
      >
        <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Brain className="w-4 h-4 text-blue-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs bg-blue-500/20 text-blue-300">
                    Pattern Detected
                  </Badge>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{content}</p>
                {!hasEngaged && (
                  <div className="flex gap-2 mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDismiss}
                      className="text-xs"
                    >
                      Thanks
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Level 3: Critical interventions
  if (level === 3) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="my-4"
      >
        <Card className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-500/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Target className="w-4 h-4 text-red-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="destructive" className="text-xs">
                    Coaching Intervention
                  </Badge>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-3">{content}</p>
                {!hasEngaged && action && actionLabel && (
                  <div className="flex gap-2">
                    <Button
                      onClick={handleActionClick}
                      className="bg-red-500 hover:bg-red-600 text-white text-sm"
                      size="sm"
                    >
                      <Play className="w-3 h-3 mr-1" />
                      {actionLabel}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDismiss}
                      className="text-xs"
                    >
                      Maybe later
                    </Button>
                  </div>
                )}
                {hasEngaged && (
                  <div className="flex items-center gap-2 text-green-400 text-sm">
                    <Check className="w-4 h-4" />
                    <span>Great job taking action!</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return null;
};
