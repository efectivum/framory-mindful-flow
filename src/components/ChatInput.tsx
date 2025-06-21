
import React, { useEffect, useCallback, useRef } from 'react';
import { Send, Plus, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ActivitySelector } from './ActivitySelector';
import { VoiceButton } from './VoiceButton';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  inputText: string;
  setInputText: (text: string) => void;
  handleSend: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleVoiceTranscription: (text: string) => void;
  handleActivitySelect: (activity: string) => void;
  fileAttachment: File | null;
  setFileAttachment: (file: File | null) => void;
  selectedActivity: string | null;
  setSelectedActivity: (activity: string | null) => void;
  showActivitySelector: boolean;
  setShowActivitySelector: (show: boolean) => void;
  isDetectingIntent: boolean;
  isGeneratingResponse: boolean;
  textAreaRef: React.RefObject<HTMLTextAreaElement>;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  inputText,
  setInputText,
  handleSend,
  handleFileChange,
  handleVoiceTranscription,
  handleActivitySelect,
  fileAttachment,
  setFileAttachment,
  selectedActivity,
  setSelectedActivity,
  showActivitySelector,
  setShowActivitySelector,
  isDetectingIntent,
  isGeneratingResponse,
  textAreaRef,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const adjustTextareaHeight = useCallback(() => {
    if (textAreaRef.current) {
      const textarea = textAreaRef.current;
      // Reset height to calculate scrollHeight properly
      textarea.style.height = 'auto';
      // Calculate new height with smooth constraints
      const scrollHeight = textarea.scrollHeight;
      const minHeight = 44; // Minimum height for mobile touch
      const maxHeight = 120; // Maximum before scrolling
      const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);
      textarea.style.height = `${newHeight}px`;
    }
  }, [textAreaRef]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    // Use requestAnimationFrame for smooth height transitions
    requestAnimationFrame(() => {
      adjustTextareaHeight();
    });
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Auto-focus management
  useEffect(() => {
    if (!isDetectingIntent && !isGeneratingResponse && textAreaRef.current) {
      // Small delay to ensure proper focus on mobile
      setTimeout(() => {
        textAreaRef.current?.focus();
      }, 100);
    }
  }, [isDetectingIntent, isGeneratingResponse, textAreaRef]);

  // Adjust height when content changes externally
  useEffect(() => {
    adjustTextareaHeight();
  }, [inputText, adjustTextareaHeight]);

  const canSend = !isDetectingIntent && !isGeneratingResponse && (inputText.trim() || fileAttachment);
  const isDisabled = isDetectingIntent || isGeneratingResponse;

  return (
    <div className="bg-[#161c26] border-t border-gray-800 safe-area-pb">
      <div className="p-4">
        {selectedActivity && (
          <div className="mb-3 flex items-center justify-between">
            <span className="inline-block px-3 py-1.5 bg-blue-900 text-blue-300 text-xs rounded-full border border-blue-700">
              Logging as: {selectedActivity}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedActivity(null)}
              className="text-gray-400 hover:text-gray-200 text-xs h-auto py-1 px-2 min-h-[36px]"
            >
              Cancel
            </Button>
          </div>
        )}

        {fileAttachment && (
          <div className="mb-3 flex items-center gap-3 p-2 bg-gray-800/50 rounded-lg">
            {fileAttachment.type.startsWith('image/') ? (
              <img
                src={URL.createObjectURL(fileAttachment)}
                alt="preview"
                className="w-12 h-12 rounded border border-gray-700 object-contain"
              />
            ) : (
              <span className="px-2 py-1 rounded bg-gray-700 border border-gray-600 text-gray-200 text-xs">
                {fileAttachment.name}
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFileAttachment(null)}
              className="text-gray-400 hover:text-red-400 min-h-[32px] ml-auto"
              tabIndex={-1}
              type="button"
            >
              ✕
            </Button>
          </div>
        )}

        <div className="flex items-end gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf"
            className="hidden"
            onChange={handleFileChange}
            disabled={isDisabled}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleFileButtonClick}
            className="text-gray-500 hover:text-blue-400 hover:bg-blue-950 h-11 w-11 rounded-full shrink-0 min-h-[44px] min-w-[44px] touch-manipulation"
            type="button"
            disabled={isDisabled}
          >
            <Paperclip className="w-5 h-5" />
          </Button>

          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowActivitySelector(!showActivitySelector)}
              className={cn(
                "text-gray-400 hover:text-blue-300 hover:bg-blue-900 h-11 w-11 shrink-0 rounded-full min-h-[44px] min-w-[44px] touch-manipulation",
                showActivitySelector && "text-blue-400 bg-blue-950"
              )}
              disabled={isDisabled}
            >
              <Plus className="w-5 h-5" />
            </Button>
            <ActivitySelector
              isOpen={showActivitySelector}
              onSelect={handleActivitySelect}
              onClose={() => setShowActivitySelector(false)}
            />
          </div>

          <div className="flex-1 relative">
            <textarea
              ref={textAreaRef}
              value={inputText}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              placeholder={selectedActivity ? `Log your ${selectedActivity} experience...` : "Type your message..."}
              className="w-full min-h-[44px] max-h-[120px] resize-none rounded-xl border border-gray-700 bg-[#232b3a] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none py-3 px-4 text-gray-100 placeholder:text-gray-400 touch-manipulation transition-all duration-200 ease-out overflow-y-auto"
              rows={1}
              disabled={isDisabled}
              style={{ 
                fontSize: '16px',
                height: '44px',
                lineHeight: '1.5',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            />
          </div>

          <VoiceButton
            onTranscription={handleVoiceTranscription}
            disabled={isDisabled}
            className="min-h-[44px] min-w-[44px] h-11 w-11 rounded-full touch-manipulation"
          />

          <Button
            onClick={handleSend}
            disabled={!canSend}
            size="icon"
            className={cn(
              "h-11 w-11 rounded-full shrink-0 shadow-sm min-h-[44px] min-w-[44px] touch-manipulation transition-all duration-200",
              canSend 
                ? "bg-blue-600 hover:bg-blue-700 text-white scale-100" 
                : "bg-gray-700 text-gray-400 cursor-not-allowed scale-95"
            )}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
