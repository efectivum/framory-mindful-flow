
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { MessageSquare, Star } from 'lucide-react';

interface HabitNoteDialogProps {
  habitTitle: string;
  onSaveNote: (note: string, moodRating?: number) => void;
  disabled?: boolean;
}

export const HabitNoteDialog = ({ habitTitle, onSaveNote, disabled = false }: HabitNoteDialogProps) => {
  const [note, setNote] = useState('');
  const [moodRating, setMoodRating] = useState([5]);
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    onSaveNote(note, moodRating[0]);
    setNote('');
    setMoodRating([5]);
    setOpen(false);
  };

  const handleComplete = () => {
    onSaveNote('', moodRating[0]);
    setNote('');
    setMoodRating([5]);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-gray-400 hover:text-white p-1 h-auto"
          disabled={disabled}
        >
          <MessageSquare className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Complete {habitTitle}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="mood" className="text-gray-300 flex items-center gap-2">
              <Star className="w-4 h-4" />
              How are you feeling? ({moodRating[0]}/10)
            </Label>
            <Slider
              id="mood"
              value={moodRating}
              onValueChange={setMoodRating}
              max={10}
              min={1}
              step={1}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>😞 Poor</span>
              <span>😊 Great</span>
            </div>
          </div>
          
          <div>
            <Label htmlFor="note" className="text-gray-300">
              Add a note (optional)
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
              onClick={handleComplete}
              className="bg-green-600 hover:bg-green-700"
            >
              Complete Habit
            </Button>
            {note.trim() && (
              <Button 
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Complete with Note
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
