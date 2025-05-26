
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MessageSquare } from 'lucide-react';

interface HabitNoteDialogProps {
  habitTitle: string;
  onSaveNote: (note: string) => void;
}

export const HabitNoteDialog = ({ habitTitle, onSaveNote }: HabitNoteDialogProps) => {
  const [note, setNote] = useState('');
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    onSaveNote(note);
    setNote('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-gray-400 hover:text-white p-1 h-auto"
        >
          <MessageSquare className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Add Note to {habitTitle}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="note" className="text-gray-300">
              How did this habit go today? Any insights or challenges?
            </Label>
            <Textarea
              id="note"
              placeholder="e.g., Meditation felt really peaceful today, focused on breathing..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="mt-2 bg-gray-700 border-gray-600 text-white"
              rows={3}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!note.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Save Note
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
