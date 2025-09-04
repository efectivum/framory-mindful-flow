
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Target, Heart, Brain, TrendingUp, Clock } from 'lucide-react';

interface ActivitySelectorProps {
  isOpen: boolean;
  onSelect: (activity: string) => void;
  onClose: () => void;
}

const activities = [
  { id: 'journal', label: 'Journal Entry', icon: BookOpen, color: 'blue' },
  { id: 'goal', label: 'Goal Update', icon: Target, color: 'green' },
  { id: 'mood', label: 'Mood Check', icon: Heart, color: 'pink' },
  { id: 'habit', label: 'Habit Track', icon: Clock, color: 'purple' },
  { id: 'reflection', label: 'Reflection', icon: Brain, color: 'teal' },
  { id: 'progress', label: 'Progress Note', icon: TrendingUp, color: 'orange' },
];

const colorClasses = {
  blue: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  green: 'bg-green-500/20 text-green-300 border-green-500/30',
  pink: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  purple: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  teal: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
  orange: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
};

export const ActivitySelector: React.FC<ActivitySelectorProps> = ({
  isOpen,
  onSelect,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40"
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mobile-absolute mobile-bottom-0 mobile-left-0 mb-2 mobile-card mobile-shadow-floating mobile-z-50 min-w-64"
          >
            <div className="mobile-admin-grid-2">
              {activities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <button
                    key={activity.id}
                    onClick={() => onSelect(activity.label)}
                    className={`mobile-button mobile-button-small mobile-flex mobile-flex-center gap-2 ${
                      colorClasses[activity.color as keyof typeof colorClasses]
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{activity.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
