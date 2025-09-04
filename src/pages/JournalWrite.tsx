import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Save, Mic, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { VoiceButton } from '@/components/VoiceButton';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { useAutoSave } from '@/hooks/useAutoSave';
import { useToast } from '@/hooks/use-toast';

const JournalWrite = () => {
  const location = useLocation();
  const initialContent = location.state?.initialContent || '';
  const [content, setContent] = useState(initialContent);
  const [wordCount, setWordCount] = useState(0);
  const { createEntry, isCreating } = useJournalEntries();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Calculate word count
  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [content]);

  // Auto-save functionality
  const { status, lastSaved } = useAutoSave(content, {
    delay: 3000,
    onSave: async (data: string) => {
      if (data.trim().length > 10) {
        // Only save meaningful content
        localStorage.setItem('journal-draft', data);
      }
    },
    onError: (error) => {
      console.log('Draft save failed:', error);
    }
  });

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem('journal-draft');
    if (draft && !initialContent) {
      setContent(draft);
    }
  }, [initialContent]);

  const handleSaveAndFinish = async () => {
    if (!content.trim()) {
      toast({
        title: "Entry is empty",
        description: "Please write something before saving.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createEntry({
        content: content.trim(),
      });

      // Clear draft
      localStorage.removeItem('journal-draft');
      
      toast({
        title: "Entry saved!",
        description: "Your journal entry has been saved successfully.",
      });

      navigate('/journal');
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleVoiceTranscription = (text: string) => {
    if (content.trim()) {
      setContent(prev => prev + ' ' + text);
    } else {
      setContent(text);
    }
  };

  const handleBack = () => {
    if (content.trim() && content !== initialContent) {
      // Save as draft before leaving
      localStorage.setItem('journal-draft', content);
      toast({
        title: "Draft saved",
        description: "Your progress has been saved as a draft.",
      });
    }
    navigate('/journal');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="hover:bg-muted"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center gap-2 text-muted-foreground">
                <BookOpen className="w-4 h-4" />
                <span className="text-sm font-medium">New Entry</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Word count & auto-save status */}
              <div className="text-sm text-muted-foreground">
                {wordCount} words
                {status === 'saving' && (
                  <span className="ml-2 text-primary">Saving...</span>
                )}
                {status === 'saved' && lastSaved && (
                  <span className="ml-2 text-green-600">Draft saved</span>
                )}
              </div>

              <Button
                onClick={handleSaveAndFinish}
                disabled={isCreating || !content.trim()}
                className="bg-primary hover:bg-primary/90"
              >
                <Save className="w-4 h-4 mr-2" />
                {isCreating ? 'Saving...' : 'Publish'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Editor */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="relative">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind today? Share your thoughts, feelings, experiences, or anything else you'd like to reflect on..."
            className="min-h-[calc(100vh-200px)] text-lg leading-relaxed border-none resize-none focus:ring-0 focus:border-none bg-transparent p-0 text-foreground placeholder:text-muted-foreground"
            autoFocus
          />
          
          {/* Voice button */}
          <div className="fixed bottom-6 right-6 z-20">
            <div className="bg-background/95 backdrop-blur-sm rounded-full p-2 shadow-lg border border-border">
              <VoiceButton onTranscription={handleVoiceTranscription} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalWrite;