import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Save, BookOpen } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { VoiceButton } from '@/components/VoiceButton';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { useAutoSave } from '@/hooks/useAutoSave';
import { useToast } from '@/hooks/use-toast';
import { MobileLayout, MobilePage, MobileContent } from '@/components/layouts/MobileLayout';
import { MobileHeader, MobileHeaderAction } from '@/components/ui/MobileHeader';

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
    <MobileLayout>
      <MobilePage>
        <MobileHeader
          title="New Entry"
          backTo="/journal"
          onBack={handleBack}
          actions={
            <MobileHeaderAction
              onClick={handleSaveAndFinish}
              variant="primary"
              disabled={!content.trim() || isCreating}
            >
              {isCreating ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="text-sm">Saving...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  <span className="text-sm font-medium">Publish</span>
                </div>
              )}
            </MobileHeaderAction>
          }
        />

        <MobileContent padded>
          <div className="space-y-4">
            {/* Status Bar */}
            <div className="flex justify-between items-center text-muted-foreground">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span className="font-medium">New Entry</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-medium">{wordCount} words</span>
                {status === 'saving' && (
                  <span className="text-primary font-medium text-xs">Saving...</span>
                )}
                {status === 'saved' && lastSaved && (
                  <span className="text-green-600 font-medium text-xs">Draft saved</span>
                )}
              </div>
            </div>

            {/* Writing Area */}
            <div className="relative">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind today? Share your thoughts, feelings, experiences, or anything else you'd like to reflect on..."
                className="min-h-[calc(100vh-280px)] bg-transparent border-none focus:ring-0 focus:border-none p-0 text-foreground placeholder:text-muted-foreground resize-none"
                style={{ fontSize: '16px' }} // Prevent zoom on iOS
                autoFocus
              />
              
              {/* Voice Button - Mobile Optimized */}
              <div className="fixed bottom-20 right-4 z-50 md:bottom-6 md:right-6">
                <div className="bg-primary/90 backdrop-blur-sm rounded-full shadow-lg border border-border/20 p-2">
                  <VoiceButton 
                    onTranscription={handleVoiceTranscription}
                    className="text-primary-foreground hover:text-primary-foreground hover:bg-primary/20 h-12 w-12 rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </MobileContent>
      </MobilePage>
    </MobileLayout>
  );
};

export default JournalWrite;