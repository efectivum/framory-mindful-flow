import React from 'react';
import { Brain } from 'lucide-react';
import { RecurringTopics } from '@/components/RecurringTopics';
import { MiniCalendar } from '@/components/MiniCalendar';

interface InsightSidebarProps {
  totalEntries: number;
  totalWords: number;
  currentStreak: number;
}

export const InsightSidebar: React.FC<InsightSidebarProps> = ({
  totalEntries,
  totalWords,
  currentStreak
}) => {
  return (
    <div className="space-y-6">
      <div className="card-serene overflow-hidden">
        <MiniCalendar />
      </div>

      <RecurringTopics />

      <div className="card-serene p-6">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-primary" />
          <h3 className="text-foreground font-medium">Growth Summary</h3>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-muted/40 border border-border rounded-2xl">
              <div className="text-2xl font-light text-foreground mb-1">{totalEntries}</div>
              <div className="text-muted-foreground text-sm">Total Entries</div>
            </div>
            <div className="text-center p-4 bg-muted/40 border border-border rounded-2xl">
              <div className="text-2xl font-light text-foreground mb-1">{totalWords.toLocaleString()}</div>
              <div className="text-muted-foreground text-sm">Words Written</div>
            </div>
          </div>
          <div className="text-center text-muted-foreground text-sm">
            You've been on this journey for <span className="font-medium text-primary">{Math.max(1, currentStreak)}</span> days
          </div>
        </div>
      </div>
    </div>
  );
};
