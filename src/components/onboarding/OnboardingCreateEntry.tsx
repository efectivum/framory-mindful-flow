
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useSampleTemplates } from '@/hooks/useSampleTemplates';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { BookOpen, Sparkles } from 'lucide-react';

interface OnboardingCreateEntryProps {
  onNext: () => void;
}

export const OnboardingCreateEntry: React.FC<OnboardingCreateEntryProps> = ({ onNext }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const { journalTemplates } = useSampleTemplates('journal');
  const { createEntry, isCreating } = useJournalEntries();

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template.id);
    setTitle(template.title);
    setContent(template.content);
  };

  const handleCreateEntry = async () => {
    if (!content.trim()) return;

    try {
      await createEntry({
        title: title || 'My First Entry',
        content: content.trim(),
        mood_before: 5
      });
      onNext();
    } catch (error) {
      console.error('Failed to create entry:', error);
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
        <BookOpen className="w-12 h-12 text-blue-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Write Your First Entry</h2>
        <p className="text-muted-foreground">
          Start your journey with a journal entry. You can use one of our templates or write from scratch.
        </p>
      </motion.div>

      {/* Templates */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3 flex items-center">
          <Sparkles className="w-4 h-4 mr-2 text-yellow-500" />
          Choose a Template (Optional)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {journalTemplates.slice(0, 2).map((template) => (
            <Card
              key={template.id}
              className={`p-4 cursor-pointer transition-colors ${
                selectedTemplate === template.id 
                  ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950' 
                  : 'hover:bg-muted/50'
              }`}
              onClick={() => handleTemplateSelect(template)}
            >
              <h4 className="font-medium mb-1">{template.title}</h4>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {template.description}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* Entry Form */}
      <div className="space-y-4">
        <div>
          <Input
            placeholder="Entry title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <Textarea
            placeholder="What's on your mind? How are you feeling today?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            className="resize-none"
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t">
        <Button variant="ghost" onClick={handleSkipForNow}>
          Skip for now
        </Button>
        <Button 
          onClick={handleCreateEntry}
          disabled={!content.trim() || isCreating}
        >
          {isCreating ? 'Creating...' : 'Create Entry'}
        </Button>
      </div>
    </div>
  );
};
