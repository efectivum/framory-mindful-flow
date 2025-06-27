
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useHabits } from '@/hooks/useHabits';

interface CreateHabitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateHabitDialog = ({ open, onOpenChange }: CreateHabitDialogProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [frequencyType, setFrequencyType] = useState<'daily' | 'weekly' | 'custom'>('daily');
  const [frequencyValue, setFrequencyValue] = useState(1);
  const [targetDays, setTargetDays] = useState(30);

  const { createHabit, isCreating } = useHabits();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createHabit({
      title: title.trim(),
      description: description.trim() || null,
      frequency_type: frequencyType,
      frequency_value: frequencyValue,
      target_days: targetDays,
      is_active: true,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setFrequencyType('daily');
    setFrequencyValue(1);
    setTargetDays(30);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Habit</DialogTitle>
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
            <Button type="submit" disabled={isCreating || !title.trim()}>
              {isCreating ? 'Creating...' : 'Create Habit'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
