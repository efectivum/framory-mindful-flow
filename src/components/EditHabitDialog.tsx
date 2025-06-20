import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Habit } from '@/types/habits';

interface EditHabitDialogProps {
  habit: Habit;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updates: Partial<Habit>) => void;
  isUpdating: boolean;
}

export const EditHabitDialog = ({ habit, open, onOpenChange, onSave, isUpdating }: EditHabitDialogProps) => {
  const [title, setTitle] = useState(habit.title);
  const [description, setDescription] = useState(habit.description || '');
  const [frequencyType, setFrequencyType] = useState<'daily' | 'weekly' | 'custom'>(habit.frequency_type);
  const [frequencyValue, setFrequencyValue] = useState(habit.frequency_value);
  const [targetDays, setTargetDays] = useState(habit.target_days);

  useEffect(() => {
    if (open) {
      setTitle(habit.title);
      setDescription(habit.description || '');
      setFrequencyType(habit.frequency_type);
      setFrequencyValue(habit.frequency_value);
      setTargetDays(habit.target_days);
    }
  }, [habit, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      description: description.trim() || null,
      frequency_type: frequencyType,
      frequency_value: frequencyValue,
      target_days: targetDays,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Habit</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Habit Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Daily Meditation"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Meditate for 10 minutes every day"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequency">Frequency</Label>
            <Select value={frequencyType} onValueChange={(value: 'daily' | 'weekly' | 'custom') => setFrequencyType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {frequencyType !== 'daily' && (
            <div className="space-y-2">
              <Label htmlFor="frequency-value">
                {frequencyType === 'weekly' ? 'Times per week' : 'Custom frequency'}
              </Label>
              <Input
                id="frequency-value"
                type="number"
                value={frequencyValue}
                onChange={(e) => setFrequencyValue(parseInt(e.target.value) || 1)}
                min={1}
                max={frequencyType === 'weekly' ? 7 : 365}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="target">Target Days</Label>
            <Input
              id="target"
              type="number"
              value={targetDays}
              onChange={(e) => setTargetDays(parseInt(e.target.value) || 30)}
              min={1}
              max={365}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUpdating || !title.trim()}>
              {isUpdating ? 'Updating...' : 'Update Habit'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
