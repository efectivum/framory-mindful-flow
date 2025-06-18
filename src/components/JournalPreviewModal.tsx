
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Save, X, Edit3 } from 'lucide-react';

interface JournalPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  suggestedContent: string;
  onSave: (content: string) => void;
  onCancel: () => void;
}

export const JournalPreviewModal: React.FC<JournalPreviewModalProps> = ({
  isOpen,
  onClose,
  suggestedContent,
  onSave,
  onCancel,
}) => {
  const [content, setContent] = useState(suggestedContent);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onSave(content);
    onClose();
  };

  const handleCancel = () => {
    onCancel();
    onClose();
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Save to Journal</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-gray-300 text-sm">
            The AI has extracted this content for your journal entry:
          </p>
          
          {isEditing ? (
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-32 bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500"
              placeholder="Edit your journal entry..."
            />
          ) : (
            <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
              <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">
                {content}
              </p>
            </div>
          )}
          
          <div className="flex items-center gap-3 pt-2">
            <Button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save to Journal
            </Button>
            
            {!isEditing && (
              <Button
                variant="outline"
                onClick={handleEdit}
                className="border-gray-600 text-gray-300 hover:bg-gray-700 flex items-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                Edit
              </Button>
            )}
            
            <Button
              variant="ghost"
              onClick={handleCancel}
              className="text-gray-400 hover:text-white hover:bg-gray-700 flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
