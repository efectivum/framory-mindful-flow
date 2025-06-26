
import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useNotificationTemplates } from '@/hooks/useNotificationTemplates';
import { NotificationTemplateDialog } from '@/components/admin/NotificationTemplateDialog';
import { NotificationQuickActions } from '@/components/admin/NotificationQuickActions';
import { NotificationTemplatesList } from '@/components/admin/NotificationTemplatesList';
import type { NotificationTemplate, CreateTemplateInput } from '@/types/notifications';

export default function AdminNotifications() {
  const {
    templates,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    isDuplicating,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    duplicateTemplate
  } = useNotificationTemplates();

  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplate | null>(null);

  const handleCreateTemplate = (input: CreateTemplateInput) => {
    createTemplate(input);
    setShowTemplateDialog(false);
  };

  const handleEditTemplate = (template: NotificationTemplate) => {
    setEditingTemplate(template);
    setShowTemplateDialog(true);
  };

  const handleUpdateTemplate = (input: CreateTemplateInput) => {
    if (editingTemplate) {
      updateTemplate(editingTemplate.id, input);
      setShowTemplateDialog(false);
      setEditingTemplate(null);
    }
  };

  const handleDuplicateTemplate = (template: NotificationTemplate) => {
    const newName = `${template.name} (Copy)`;
    duplicateTemplate(template.id, newName);
  };

  const handleDeleteTemplate = (template: NotificationTemplate) => {
    if (template.is_system) {
      alert('System templates cannot be deleted');
      return;
    }
    if (confirm(`Are you sure you want to delete "${template.name}"?`)) {
      deleteTemplate(template.id);
    }
  };

  const handleCreateTemplateClick = () => {
    setEditingTemplate(null);
    setShowTemplateDialog(true);
  };

  return (
    <AdminLayout 
      title="Notification Management" 
      subtitle="Manage notification templates and send targeted communications"
    >
      <div className="space-y-6">
        <NotificationQuickActions />
        
        <NotificationTemplatesList
          templates={templates}
          isLoading={isLoading}
          isDeleting={isDeleting}
          isDuplicating={isDuplicating}
          onCreateTemplate={handleCreateTemplateClick}
          onEditTemplate={handleEditTemplate}
          onDuplicateTemplate={handleDuplicateTemplate}
          onDeleteTemplate={handleDeleteTemplate}
        />
      </div>

      <NotificationTemplateDialog
        open={showTemplateDialog}
        onOpenChange={setShowTemplateDialog}
        template={editingTemplate}
        onSave={editingTemplate ? handleUpdateTemplate : handleCreateTemplate}
        isLoading={isCreating || isUpdating}
      />
    </AdminLayout>
  );
}
