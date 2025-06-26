
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { CreateTemplateInput } from '@/types/notifications';

interface NotificationTemplateFormProps {
  formData: CreateTemplateInput;
  onChange: (updates: Partial<CreateTemplateInput>) => void;
}

export const NotificationTemplateForm: React.FC<NotificationTemplateFormProps> = ({
  formData,
  onChange
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Template Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="e.g., Daily Reminder"
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={formData.description || ''}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Brief description of this template"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Channel</Label>
          <Select
            value={formData.channel}
            onValueChange={(value: 'push' | 'email' | 'whatsapp') =>
              onChange({ channel: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="push">Push Notification</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="whatsapp">WhatsApp</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value: 'daily_reminder' | 'weekly_insight' | 'habit_checkin' | 'custom') =>
              onChange({ type: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily_reminder">Daily Reminder</SelectItem>
              <SelectItem value="weekly_insight">Weekly Insight</SelectItem>
              <SelectItem value="habit_checkin">Habit Check-in</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {formData.channel === 'email' && (
        <div>
          <Label htmlFor="subject">Subject Template</Label>
          <Input
            id="subject"
            value={formData.subject_template || ''}
            onChange={(e) => onChange({ subject_template: e.target.value })}
            placeholder="e.g., Your weekly insights are ready, {{user_name}}!"
          />
        </div>
      )}

      <div>
        <Label htmlFor="content">Content Template</Label>
        <Textarea
          id="content"
          value={formData.content_template}
          onChange={(e) => onChange({ content_template: e.target.value })}
          placeholder="Use {{variable_name}} for dynamic content"
          rows={6}
        />
        <p className="text-sm text-gray-500 mt-1">
          Use double curly braces for variables: {`{{user_name}}, {{streak_count}}, etc.`}
        </p>
      </div>
    </div>
  );
};
