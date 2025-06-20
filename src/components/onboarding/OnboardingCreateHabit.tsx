
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useSampleTemplates } from '@/hooks/useSampleTemplates';
import { useHabits } from '@/hooks/useHabits';
import { Target, Sparkles } from 'lucide-react';

interface OnboardingCreateHabitProps {
  onNext: () => void;
}

export const OnboardingCreateHabit: React.FC<OnboardingCreateHabitProps> = ({ onNext }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const { habitTemplates } = useSampleTemplates('habit');
  const { createHabit, isCreating } = useHabits();

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template.id);
    setTitle(template.title);
    setDescription(template.content);
  };

  const handleCreateHabit = async () => {
    if (!title.trim()) return;

    try {
      await createHabit({
        title: title.trim(),
        description: description.trim() || undefined,
        frequency_type: 'daily',
        frequency_value: 1,
        target_days: 30,
        is_active: true,
      });
      onNext();
    } catch (error) {
      console.error('Failed to create habit:', error);
    }
  };

  const handleSkipForNow = () => {
    onNext();
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <Target className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Build Your First Habit</h2>
        <p className="text-muted-foreground">
          Habits are the building blocks of lasting change. Start with something small and achievable.
        </p>
      </motion.div>

      {/* Templates */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3 flex items-center">
          <Sparkles className="w-4 h-4 mr-2 text-yellow-500" />
          Popular Habit Ideas
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {habitTemplates.slice(0, 3).map((template) => (
            <Card
              key={template.id}
              className={`p-4 cursor-pointer transition-colors ${
                selectedTemplate === template.id 
                  ? 'ring-2 ring-green-500 bg-green-50 dark:bg-green-950' 
                  : 'hover:bg-muted/50'
              }`}
              onClick={() => handleTemplateSelect(template)}
            >
              <h4 className="font-medium mb-1">{template.title}</h4>
              <p className="text-sm text-muted-foreground">
                {template.description}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* Habit Form */}
      <div className="space-y-4">
        <div>
          <Input
            placeholder="What habit would you like to build?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <Input
            placeholder="Why is this important to you? (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t">
        <Button variant="ghost" onClick={handleSkipForNow}>
          Skip for now
        </Button>
        <Button 
          onClick={handleCreateHabit}
          disabled={!title.trim() || isCreating}
        >
          {isCreating ? 'Creating...' : 'Create Habit'}
        </Button>
      </div>
    </div>
  );
};
