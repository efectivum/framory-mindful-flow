
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VoiceButton } from '@/components/VoiceButton';
import { useJournalEntries } from '@/hooks/useJournalEntries';

interface CreateJournalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateJournalDialog = ({ open, onOpenChange }: CreateJournalDialogProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [moodBefore, setMoodBefore] = useState<number | undefined>();
  const [moodAfter, setMoodAfter] = useState<number | undefined>();
  const [tags, setTags] = useState('');

  const { createEntry, isCreating } = useJournalEntries();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

    createEntry({
      title: title.trim() || undefined,
      content: content.trim(),
      mood_before: moodBefore,
      mood_after: moodAfter,
      tags: tagsArray.length > 0 ? tagsArray : undefined,
    });

    // Reset form
    setTitle('');
    setContent('');
    setMoodBefore(undefined);
    setMoodAfter(undefined);
    setTags('');
    onOpenChange(false);
  };

  const handleVoiceTranscription = (text: string) => {
    if (content.trim()) {
      setContent(prev => prev + ' ' + text);
    } else {
      setContent(text);
    }
  };

  const moodOptions = [
    { value: 1, label: '😞 Very Low' },
    { value: 2, label: '😕 Low' },
    { value: 3, label: '😐 Neutral' },
    { value: 4, label: '😊 Good' },
    { value: 5, label: '😄 Excellent' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Journal Entry</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title (Optional)</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Morning Reflection"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <div className="relative">
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind today?"
                rows={6}
                required
                className="pr-12"
              />
              <div className="absolute top-2 right-2">
                <VoiceButton onTranscription={handleVoiceTranscription} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mood-before">Mood Before</Label>
              <Select value={moodBefore?.toString()} onValueChange={(value) => setMoodBefore(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select mood" />
                </SelectTrigger>
                <SelectContent>
                  {moodOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mood-after">Mood After</Label>
              <Select value={moodAfter?.toString()} onValueChange={(value) => setMoodAfter(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select mood" />
                </SelectTrigger>
                <SelectContent>
                  {moodOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (Optional)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="gratitude, work, family (comma separated)"
            />
          </div>

          <div className="flex justify-end space-x-2">
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
