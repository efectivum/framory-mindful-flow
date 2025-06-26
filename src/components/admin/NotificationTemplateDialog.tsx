
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
import { TemplateEngine } from '@/utils/templateEngine';
import { NotificationTemplateForm } from './NotificationTemplateForm';
import { NotificationTemplateVariables } from './NotificationTemplateVariables';
import { NotificationTemplatePreview } from './NotificationTemplatePreview';
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

  const handleFormChange = (updates: Partial<CreateTemplateInput>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleVariablesChange = (variables: string[]) => {
    setFormData(prev => ({ ...prev, variables }));
  };

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
            <NotificationTemplateForm
              formData={formData}
              onChange={handleFormChange}
            />
            
            <NotificationTemplateVariables
              variables={formData.variables}
              onChange={handleVariablesChange}
            />
          </div>

          <NotificationTemplatePreview
            formData={formData}
            showPreview={showPreview}
            onTogglePreview={() => setShowPreview(!showPreview)}
          />
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
