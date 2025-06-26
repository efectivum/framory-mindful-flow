
export interface NotificationTemplate {
  id: string;
  name: string;
  description: string | null;
  channel: 'push' | 'email' | 'whatsapp';
  type: 'daily_reminder' | 'weekly_insight' | 'habit_checkin' | 'custom';
  subject_template: string | null;
  content_template: string;
  variables: string[];
  is_active: boolean;
  is_system: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateTemplateInput {
  name: string;
  description?: string;
  channel: 'push' | 'email' | 'whatsapp';
  type: 'daily_reminder' | 'weekly_insight' | 'habit_checkin' | 'custom';
  subject_template?: string;
  content_template: string;
  variables: string[];
}

export interface UpdateTemplateInput extends Partial<CreateTemplateInput> {
  is_active?: boolean;
}

export interface TemplateVariables {
  [key: string]: string | number | boolean;
}
