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
    <div className="min-h-screen bg-background safe-area-pt">
      {/* Mobile-First Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border safe-area-pt">
        <div className="px-4 py-3 sm:px-6 sm:py-4">
          {/* Mobile Header Layout */}
          <div className="flex items-center justify-between mb-3 sm:mb-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="mobile-button h-10 w-auto px-3 hover:bg-muted touch-manipulation"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="text-base font-medium">Back</span>
            </Button>

            <Button
              onClick={handleSaveAndFinish}
              disabled={isCreating || !content.trim()}
              className="mobile-button bg-primary hover:bg-primary/90 text-primary-foreground h-10 px-4 touch-manipulation"
            >
              <Save className="w-5 h-5 mr-2" />
              <span className="text-base font-medium">
                {isCreating ? 'Saving...' : 'Publish'}
              </span>
            </Button>
          </div>

          {/* Mobile Status Bar */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span className="font-medium">New Entry</span>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="font-medium">{wordCount} words</span>
              {status === 'saving' && (
                <span className="text-primary font-medium">Saving...</span>
              )}
              {status === 'saved' && lastSaved && (
                <span className="text-green-600 font-medium">Draft saved</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-Optimized Editor */}
      <div className="px-4 py-6 sm:px-6 sm:py-8 pb-24 safe-area-pb">
        <div className="relative">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind today? Share your thoughts, feelings, experiences, or anything else you'd like to reflect on..."
            className="min-h-[calc(100vh-240px)] text-base sm:text-lg leading-relaxed border-none resize-none focus:ring-0 focus:border-none bg-transparent p-0 text-foreground placeholder:text-muted-foreground touch-manipulation"
            style={{ fontSize: '16px' }} // Prevent zoom on iOS
            autoFocus
          />
          
          {/* Mobile-Optimized Voice Button */}
          <div className="fixed bottom-20 right-4 z-20 sm:bottom-6 sm:right-6">
            <div className="bg-primary/90 backdrop-blur-sm rounded-full p-3 shadow-lg border border-border touch-manipulation">
              <VoiceButton 
                onTranscription={handleVoiceTranscription}
                className="text-primary-foreground hover:text-primary-foreground hover:bg-primary/20 h-12 w-12 rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalWrite;