
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Plus, Edit, Copy, Trash2 } from 'lucide-react';
import type { NotificationTemplate } from '@/types/notifications';

interface NotificationTemplatesListProps {
  templates: NotificationTemplate[];
  isLoading: boolean;
  isDeleting: boolean;
  isDuplicating: boolean;
  onCreateTemplate: () => void;
  onEditTemplate: (template: NotificationTemplate) => void;
  onDuplicateTemplate: (template: NotificationTemplate) => void;
  onDeleteTemplate: (template: NotificationTemplate) => void;
}

export const NotificationTemplatesList: React.FC<NotificationTemplatesListProps> = ({
  templates,
  isLoading,
  isDeleting,
  isDuplicating,
  onCreateTemplate,
  onEditTemplate,
  onDuplicateTemplate,
  onDeleteTemplate
}) => {
  const getChannelColor = (channel: string) => {
    switch (channel) {
      case 'push': return 'bg-blue-500/20 text-blue-300';
      case 'email': return 'bg-green-500/20 text-green-300';
      case 'whatsapp': return 'bg-purple-500/20 text-purple-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'daily_reminder': return 'bg-orange-500/20 text-orange-300';
      case 'weekly_insight': return 'bg-indigo-500/20 text-indigo-300';
      case 'habit_checkin': return 'bg-pink-500/20 text-pink-300';
      case 'custom': return 'bg-gray-500/20 text-gray-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Templates
          </CardTitle>
          <Button 
            onClick={onCreateTemplate}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Template
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-gray-400">Loading templates...</div>
        ) : templates.length === 0 ? (
          <div className="text-center py-8 text-gray-400">No templates found</div>
        ) : (
          <div className="space-y-4">
            {templates.map((template) => (
              <div key={template.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-white font-medium">{template.name}</h4>
                    <Badge className={getChannelColor(template.channel)}>
                      {template.channel}
                    </Badge>
                    <Badge className={getTypeColor(template.type)}>
                      {template.type.replace('_', ' ')}
                    </Badge>
                    {template.is_system && (
                      <Badge className="bg-yellow-500/20 text-yellow-300">
                        System
                      </Badge>
                    )}
                    {!template.is_active && (
                      <Badge className="bg-red-500/20 text-red-300">
                        Inactive
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm">
                    {template.description || 'No description'}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    Variables: {Array.isArray(template.variables) ? template.variables.join(', ') : 'None'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditTemplate(template)}
                    className="text-gray-400 hover:text-white"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDuplicateTemplate(template)}
                    className="text-gray-400 hover:text-white"
                    disabled={isDuplicating}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  {!template.is_system && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteTemplate(template)}
                      className="text-gray-400 hover:text-red-400"
                      disabled={isDeleting}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
