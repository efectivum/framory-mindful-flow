
import React, { useState, useEffect } from 'react';
import { X, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { VoiceButton } from '@/components/VoiceButton';
import { motion, AnimatePresence } from 'framer-motion';

interface FocusedWritingModeProps {
  isOpen: boolean;
  onClose: () => void;
  onFinish: (content: string) => void;
  onGoDeeper: (content: string) => void;
  initialContent?: string;
}

export const FocusedWritingMode: React.FC<FocusedWritingModeProps> = ({
  isOpen,
  onClose,
  onFinish,
  onGoDeeper,
  initialContent = ''
}) => {
  const [content, setContent] = useState(initialContent);
  const [wordCount, setWordCount] = useState(0);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Update content when initialContent changes
  useEffect(() => {
    if (isOpen) {
      setContent(initialContent);
    }
  }, [isOpen, initialContent]);

  useEffect(() => {
    if (content) {
      setWordCount(content.trim().split(/\s+/).filter(word => word.length > 0).length);
    } else {
      setWordCount(0);
    }
  }, [content]);

  // Detect keyboard visibility on mobile
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        const viewportHeight = window.visualViewport?.height || window.innerHeight;
        const screenHeight = window.screen.height;
        setKeyboardVisible(viewportHeight < screenHeight * 0.75);
      }
    };

    window.addEventListener('resize', handleResize);
    window.visualViewport?.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.visualViewport?.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleVoiceTranscription = (text: string) => {
    if (content.trim()) {
      setContent(prev => prev + ' ' + text);
    } else {
      setContent(text);
    }
  };

  const handleFinish = () => {
    if (content.trim()) {
      onFinish(content.trim());
    }
  };

  const handleGoDeeper = () => {
    if (content.trim()) {
      onGoDeeper(content.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      handleFinish();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-gray-900 overflow-hidden touch-manipulation"
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        {/* Mobile-optimized Header */}
        <div className="absolute top-0 left-0 right-0 z-10 p-3 md:p-4 bg-gradient-to-b from-gray-900/90 to-transparent safe-area-pt">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center gap-3 md:gap-4 text-gray-400 text-xs md:text-sm">
              <span>{wordCount} words</span>
              <span className="hidden md:inline">•</span>
              <span className="hidden md:inline">Ctrl+Enter to finish</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white h-10 w-10 md:h-auto md:w-auto min-h-[44px] md:min-h-0"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Main Writing Area with proper mobile spacing */}
        <div className="h-full flex flex-col p-4 md:p-8 pt-16 md:pt-20 pb-32 md:pb-8">
          <div className="flex-1 w-full max-w-4xl mx-auto space-y-4 md:space-y-6">
            <div className="relative flex-1">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind? Let your thoughts flow freely..."
                className="min-h-[300px] md:min-h-[400px] bg-transparent border-0 text-white text-base md:text-lg leading-relaxed placeholder-gray-500 focus:ring-0 focus:outline-none resize-none"
                autoFocus
                style={{ fontSize: '16px', lineHeight: '1.8' }}
              />
              
              {/* Mobile-optimized Voice Button */}
              <div className="absolute top-3 right-3 md:top-4 md:right-4">
                <VoiceButton 
                  onTranscription={handleVoiceTranscription}
                  className="bg-gray-800/50 hover:bg-gray-700/50 h-11 w-11 md:h-auto md:w-auto min-h-[44px] rounded-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Bottom Actions */}
        <div className="fixed bottom-0 left-0 right-0 z-20 bg-gray-900/95 backdrop-blur-sm border-t border-gray-800 p-4 mb-0 safe-area-pb">
          <div className="flex flex-col sm:flex-row gap-3 max-w-4xl mx-auto">
            <Button 
              onClick={handleFinish}
              disabled={!content.trim()}
              variant="outline"
              className="w-full sm:flex-1 py-3 min-h-[44px] text-base font-medium border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              Finish
            </Button>
            
            <Button 
              onClick={handleGoDeeper}
              disabled={!content.trim()}
              className="w-full sm:flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 min-h-[44px] text-base font-medium"
            >
              Go Deeper
            </Button>
          </div>
        </div>

        {/* Backdrop overlay to prevent interaction with background */}
        <div className="absolute inset-0 bg-black/50 -z-10" />
      </motion.div>
    </AnimatePresence>
  );
};
