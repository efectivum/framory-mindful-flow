import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { VoiceButton } from '@/components/VoiceButton';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { useAutoSave } from '@/hooks/useAutoSave';

interface CreateJournalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialContent?: string;
}

export const CreateJournalDialog = ({ open, onOpenChange, initialContent = '' }: CreateJournalDialogProps) => {
  const [content, setContent] = useState('');
  const { createEntry, isCreating } = useJournalEntries();

  // Set initial content when dialog opens or initialContent changes
  useEffect(() => {
    if (open) {
      setContent(initialContent);
    }
  }, [open, initialContent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    createEntry({
      content: content.trim(),
    });

    // Reset form
    setContent('');
    onOpenChange(false);
  };

  const handleVoiceTranscription = (text: string) => {
    if (content.trim()) {
      setContent(prev => prev + ' ' + text);
    } else {
      setContent(text);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Write Your Journal Entry</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind today? Share your thoughts, feelings, experiences, or anything else you'd like to reflect on..."
              rows={12}
              required
              className="pr-12 text-base leading-relaxed resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
              autoFocus
            />
            <div className="absolute top-3 right-3">
              <VoiceButton onTranscription={handleVoiceTranscription} />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating || !content.trim()}>
              {isCreating ? 'Saving...' : 'Save Entry'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
