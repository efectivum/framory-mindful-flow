
import { supabase } from '@/integrations/supabase/client';
import type { 
  NotificationTemplate, 
  CreateTemplateInput, 
  UpdateTemplateInput 
} from '@/types/notifications';

export const fetchNotificationTemplates = async (): Promise<NotificationTemplate[]> => {
  const { data, error } = await supabase
    .from('notification_templates')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as NotificationTemplate[];
};

export const fetchTemplateById = async (id: string): Promise<NotificationTemplate | null> => {
  const { data, error } = await supabase
    .from('notification_templates')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as NotificationTemplate;
};

export const createNotificationTemplate = async (
  input: CreateTemplateInput
): Promise<NotificationTemplate> => {
  const { data, error } = await supabase
    .from('notification_templates')
    .insert([{
      ...input,
      variables: JSON.stringify(input.variables)
    }])
    .select()
    .single();

  if (error) throw error;
  return data as NotificationTemplate;
};

export const updateNotificationTemplate = async (
  id: string,
  updates: UpdateTemplateInput
): Promise<NotificationTemplate> => {
  const updateData = { ...updates };
  if (updates.variables) {
    updateData.variables = JSON.stringify(updates.variables) as any;
  }

  const { data, error } = await supabase
    .from('notification_templates')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as NotificationTemplate;
};

export const deleteNotificationTemplate = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('notification_templates')
    .delete()
    .eq('id', id)
    .eq('is_system', false); // Prevent deletion of system templates

  if (error) throw error;
};

export const duplicateTemplate = async (
  id: string,
  newName: string
): Promise<NotificationTemplate> => {
  // First fetch the original template
  const original = await fetchTemplateById(id);
  if (!original) throw new Error('Template not found');

  // Create a duplicate with modified name
  const duplicateData: CreateTemplateInput = {
    name: newName,
    description: `Copy of ${original.description || original.name}`,
    channel: original.channel,
    type: original.type,
    subject_template: original.subject_template || undefined,
    content_template: original.content_template,
    variables: Array.isArray(original.variables) ? original.variables : []
  };

  return createNotificationTemplate(duplicateData);
};
