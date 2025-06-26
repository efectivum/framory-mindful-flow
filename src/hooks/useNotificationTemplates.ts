
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import {
  fetchNotificationTemplates,
  fetchTemplateById,
  createNotificationTemplate,
  updateNotificationTemplate,
  deleteNotificationTemplate,
  duplicateTemplate
} from '@/services/notificationTemplateService';
import type { CreateTemplateInput, UpdateTemplateInput } from '@/types/notifications';

export const useNotificationTemplates = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all templates
  const { 
    data: templates = [], 
    isLoading: isLoadingTemplates 
  } = useQuery({
    queryKey: ['notification-templates'],
    queryFn: fetchNotificationTemplates,
  });

  // Create template mutation
  const createTemplateMutation = useMutation({
    mutationFn: (input: CreateTemplateInput) => createNotificationTemplate(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-templates'] });
      toast({
        title: "Template Created",
        description: "Notification template has been created successfully!",
      });
    },
    onError: (error) => {
      console.error('Error creating template:', error);
      toast({
        title: "Error",
        description: "Failed to create template. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update template mutation
  const updateTemplateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateTemplateInput }) =>
      updateNotificationTemplate(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-templates'] });
      toast({
        title: "Template Updated",
        description: "Notification template has been updated successfully!",
      });
    },
    onError: (error) => {
      console.error('Error updating template:', error);
      toast({
        title: "Error",
        description: "Failed to update template. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete template mutation
  const deleteTemplateMutation = useMutation({
    mutationFn: (id: string) => deleteNotificationTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-templates'] });
      toast({
        title: "Template Deleted",
        description: "Notification template has been deleted.",
      });
    },
    onError: (error) => {
      console.error('Error deleting template:', error);
      toast({
        title: "Error",
        description: "Failed to delete template. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Duplicate template mutation
  const duplicateTemplateMutation = useMutation({
    mutationFn: ({ id, newName }: { id: string; newName: string }) =>
      duplicateTemplate(id, newName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-templates'] });
      toast({
        title: "Template Duplicated",
        description: "Template has been duplicated successfully!",
      });
    },
    onError: (error) => {
      console.error('Error duplicating template:', error);
      toast({
        title: "Error",
        description: "Failed to duplicate template. Please try again.",
        variant: "destructive",
      });
    },
  });

  const createTemplate = useCallback((input: CreateTemplateInput) => {
    createTemplateMutation.mutate(input);
  }, [createTemplateMutation]);

  const updateTemplate = useCallback((id: string, updates: UpdateTemplateInput) => {
    updateTemplateMutation.mutate({ id, updates });
  }, [updateTemplateMutation]);

  const deleteTemplate = useCallback((id: string) => {
    deleteTemplateMutation.mutate(id);
  }, [deleteTemplateMutation]);

  const duplicateTemplateById = useCallback((id: string, newName: string) => {
    duplicateTemplateMutation.mutate({ id, newName });
  }, [duplicateTemplateMutation]);

  return {
    templates,
    isLoading: isLoadingTemplates,
    isCreating: createTemplateMutation.isPending,
    isUpdating: updateTemplateMutation.isPending,
    isDeleting: deleteTemplateMutation.isPending,
    isDuplicating: duplicateTemplateMutation.isPending,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    duplicateTemplate: duplicateTemplateById,
  };
};

export const useNotificationTemplate = (templateId: string | null) => {
  return useQuery({
    queryKey: ['notification-template', templateId],
    queryFn: () => fetchTemplateById(templateId!),
    enabled: !!templateId,
  });
};
