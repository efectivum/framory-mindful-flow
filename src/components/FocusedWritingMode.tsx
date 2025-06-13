
import React, { useState, useEffect } from 'react';
import { X, Mic, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { VoiceButton } from '@/components/VoiceButton';
import { motion, AnimatePresence } from 'framer-motion';

interface FocusedWritingModeProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (content: string, mood?: number) => void;
  initialContent?: string;
}

export const FocusedWritingMode: React.FC<FocusedWritingModeProps> = ({
  isOpen,
  onClose,
  onSave,
  initialContent = ''
}) => {
  const [content, setContent] = useState(initialContent);
  const [mood, setMood] = useState<number | undefined>();
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    if (content) {
      setWordCount(content.trim().split(/\s+/).filter(word => word.length > 0).length);
    } else {
      setWordCount(0);
    }
  }, [content]);

  const handleVoiceTranscription = (text: string) => {
    if (content.trim()) {
      setContent(prev => prev + ' ' + text);
    } else {
      setContent(text);
    }
  };

  const handleSave = () => {
    if (content.trim()) {
      onSave(content.trim(), mood);
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      handleSave();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-gray-900 overflow-hidden"
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        {/* Subtle Header */}
        <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-gray-900/80 to-transparent">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center gap-4 text-gray-400 text-sm">
              <span>{wordCount} words</span>
              <span>•</span>
              <span>Ctrl+Enter to save</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Main Writing Area */}
        <div className="h-full flex items-center justify-center p-8 pt-20">
          <div className="w-full max-w-4xl space-y-6">
            <div className="relative">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind? Let your thoughts flow freely..."
                className="min-h-[400px] bg-transparent border-0 text-white text-lg leading-relaxed placeholder-gray-500 focus:ring-0 focus:outline-none resize-none"
                autoFocus
                style={{ fontSize: '18px', lineHeight: '1.8' }}
              />
              
              {/* Voice Button */}
              <div className="absolute top-4 right-4">
                <VoiceButton 
                  onTranscription={handleVoiceTranscription}
                  className="bg-gray-800/50 hover:bg-gray-700/50"
                />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <select 
                  className="bg-gray-800/50 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm"
                  value={mood || ''}
                  onChange={(e) => setMood(e.target.value ? parseInt(e.target.value) : undefined)}
                >
                  <option value="">How are you feeling?</option>
                  <option value="5">😄 Excellent</option>
                  <option value="4">😊 Good</option>
                  <option value="3">😐 Neutral</option>
                  <option value="2">😕 Low</option>
                  <option value="1">😞 Very Low</option>
                </select>
              </div>

              <Button 
                onClick={handleSave}
                disabled={!content.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Save & Continue
              </Button>
            </div>
          </div>
        </div>

        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="h-full w-full bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10" />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
