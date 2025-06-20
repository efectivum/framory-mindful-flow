
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, TrendingUp, Target, X } from 'lucide-react';
import { HabitAnalyticsCharts } from './HabitAnalyticsCharts';
import type { Habit } from '@/hooks/useHabits';

interface HabitProgressModalProps {
  habit: Habit | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const HabitProgressModal: React.FC<HabitProgressModalProps> = ({
  habit,
  open,
  onOpenChange
}) => {
  if (!habit) return null;

  const getFrequencyBadgeColor = (type: string) => {
    switch (type) {
      case 'daily': return 'bg-green-500/20 text-green-300';
      case 'weekly': return 'bg-blue-500/20 text-blue-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900/95 border-gray-700">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-light text-white mb-2">
                {habit.title} Analytics
              </DialogTitle>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <Badge className={getFrequencyBadgeColor(habit.frequency_type)}>
                  {habit.frequency_type}
                </Badge>
                <div className="flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  {habit.target_days} day goal
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  {habit.current_streak} day streak
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {habit.description && (
            <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <p className="text-gray-300 text-sm leading-relaxed">
                {habit.description}
              </p>
            </div>
          )}

          <HabitAnalyticsCharts habit={habit} days={30} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
