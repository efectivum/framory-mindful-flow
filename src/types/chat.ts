
import { HabitSuggestion } from '@/hooks/useCoachHabitSuggestion';

export interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  activityType?: string;
  timestamp: Date;
  isJournalEntry?: boolean;
  attachmentUrl?: string;
  attachmentType?: string;
  habitSuggestion?: HabitSuggestion;
}
