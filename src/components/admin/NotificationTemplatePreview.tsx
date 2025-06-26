
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Eye } from 'lucide-react';
import { TemplateEngine } from '@/utils/templateEngine';
import type { CreateTemplateInput } from '@/types/notifications';

interface NotificationTemplatePreviewProps {
  formData: CreateTemplateInput;
  showPreview: boolean;
  onTogglePreview: () => void;
}

export const NotificationTemplatePreview: React.FC<NotificationTemplatePreviewProps> = ({
  formData,
  showPreview,
  onTogglePreview
}) => {
  const previewContent = TemplateEngine.preview(formData.content_template);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Preview</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onTogglePreview}
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
  );
};
