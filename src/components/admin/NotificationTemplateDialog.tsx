
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Plus, X } from 'lucide-react';
import { TemplateEngine } from '@/utils/templateEngine';
import type { NotificationTemplate, CreateTemplateInput } from '@/types/notifications';

interface NotificationTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template?: NotificationTemplate | null;
  onSave: (input: CreateTemplateInput) => void;
  isLoading?: boolean;
}

export const NotificationTemplateDialog: React.FC<NotificationTemplateDialogProps> = ({
  open,
  onOpenChange,
  template,
  onSave,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<CreateTemplateInput>({
    name: '',
    description: '',
    channel: 'push',
    type: 'custom',
    content_template: '',
    variables: []
  });
  const [showPreview, setShowPreview] = useState(false);
  const [newVariable, setNewVariable] = useState('');

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name,
        description: template.description || '',
        channel: template.channel,
        type: template.type,
        subject_template: template.subject_template || '',
        content_template: template.content_template,
        variables: Array.isArray(template.variables) ? template.variables : []
      });
    } else {
      setFormData({
        name: '',
        description: '',
        channel: 'push',
        type: 'custom',
        content_template: '',
        variables: []
      });
    }
  }, [template]);

  const handleSave = () => {
    // Auto-extract variables from content template
    const extractedVariables = TemplateEngine.extractVariables(formData.content_template);
    const allVariables = [...new Set([...formData.variables, ...extractedVariables])];
    
    onSave({
      ...formData,
      variables: allVariables
    });
  };

  const addVariable = () => {
    if (newVariable && !formData.variables.includes(newVariable)) {
      setFormData(prev => ({
        ...prev,
        variables: [...prev.variables, newVariable]
      }));
      setNewVariable('');
    }
  };

  const removeVariable = (variable: string) => {
    setFormData(prev => ({
      ...prev,
      variables: prev.variables.filter(v => v !== variable)
    }));
  };

  const previewContent = TemplateEngine.preview(formData.content_template);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {template ? 'Edit Template' : 'Create Notification Template'}
          </DialogTitle>
          <DialogDescription>
            Create or edit notification templates with dynamic variables.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Template Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Daily Reminder"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of this template"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Channel</Label>
                <Select
                  value={formData.channel}
                  onValueChange={(value: 'push' | 'email' | 'whatsapp') =>
                    setFormData(prev => ({ ...prev, channel: value }))
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
                    setFormData(prev => ({ ...prev, type: value }))
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
                  onChange={(e) => setFormData(prev => ({ ...prev, subject_template: e.target.value }))}
                  placeholder="e.g., Your weekly insights are ready, {{user_name}}!"
                />
              </div>
            )}

            <div>
              <Label htmlFor="content">Content Template</Label>
              <Textarea
                id="content"
                value={formData.content_template}
                onChange={(e) => setFormData(prev => ({ ...prev, content_template: e.target.value }))}
                placeholder="Use {{variable_name}} for dynamic content"
                rows={6}
              />
              <p className="text-sm text-gray-500 mt-1">
                Use double curly braces for variables: {`{{user_name}}, {{streak_count}}, etc.`}
              </p>
            </div>

            <div>
              <Label>Template Variables</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newVariable}
                  onChange={(e) => setNewVariable(e.target.value)}
                  placeholder="Add variable name"
                  onKeyPress={(e) => e.key === 'Enter' && addVariable()}
                />
                <Button type="button" onClick={addVariable} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.variables.map((variable) => (
                  <Badge key={variable} variant="secondary" className="flex items-center gap-1">
                    {variable}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => removeVariable(variable)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Preview</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
              >
                <Eye className="w-4 h-4 mr-2" />
                {showPreview ? 'Hide' : 'Show'} Preview
              </Button>
            </div>

            {showPreview && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Preview with Sample Data</CardTitle>
                </CardHeader>
                <CardContent>
                  {formData.channel === 'email' && formData.subject_template && (
                    <div className="mb-4">
                      <Label className="text-xs text-gray-500">Subject:</Label>
                      <p className="font-medium">
                        {TemplateEngine.preview(formData.subject_template)}
                      </p>
                    </div>
                  )}
                  <div>
                    <Label className="text-xs text-gray-500">Content:</Label>
                    <div className="mt-2 p-3 bg-gray-50 rounded border whitespace-pre-wrap text-sm">
                      {previewContent}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Available Variables</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-1">
                  <p><code>user_name</code> - User's display name</p>
                  <p><code>current_time</code> - Current time</p>
                  <p><code>streak_count</code> - Current habit streak</p>
                  <p><code>habit_name</code> - Name of the habit</p>
                  <p><code>weekly_summary</code> - Weekly insights summary</p>
                  <p><code>mood_trend</code> - User's mood trend</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading || !formData.name || !formData.content_template}>
            {isLoading ? 'Saving...' : template ? 'Update Template' : 'Create Template'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
