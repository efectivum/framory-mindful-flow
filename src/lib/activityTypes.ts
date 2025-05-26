
export type ActivityType = 'journal' | 'goal' | 'habit' | 'mood' | 'reflection';
export type ActivitySource = 'whatsapp' | 'website' | 'api';

export interface Activity {
  id: string;
  user_id: string;
  type: ActivityType;
  source: ActivitySource;
  title: string;
  content: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  journal: 'Journal Entry',
  goal: 'Goal Update',
  habit: 'Habit Check-in',
  mood: 'Mood Tracking',
  reflection: 'Reflection'
};

export const ACTIVITY_SOURCE_LABELS: Record<ActivitySource, string> = {
  whatsapp: 'WhatsApp',
  website: 'Website',
  api: 'API'
};
