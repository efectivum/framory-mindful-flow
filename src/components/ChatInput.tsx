
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
    <div className="mobile-chat-container mobile-safe-bottom">
      {selectedActivity && (
        <div className="mobile-flex mobile-flex-between mobile-section">
          <span className="mobile-badge bg-accent text-accent-foreground">
            Logging as: {selectedActivity}
          </span>
          <button
            onClick={() => setSelectedActivity(null)}
            className="mobile-button mobile-button-small mobile-button-ghost"
          >
            Cancel
          </button>
        </div>
      )}

      {fileAttachment && (
        <div className="mobile-flex mobile-section mobile-card mobile-card-compact">
          {fileAttachment.type.startsWith('image/') ? (
            <img
              src={URL.createObjectURL(fileAttachment)}
              alt="preview"
              className="w-12 h-12 rounded border border-border object-contain"
            />
          ) : (
            <span className="mobile-badge bg-muted text-muted-foreground">
              {fileAttachment.name}
            </span>
          )}
          <button
            onClick={() => setFileAttachment(null)}
            className="mobile-button mobile-button-small mobile-button-ghost text-destructive ml-auto"
            tabIndex={-1}
            type="button"
          >
            ✕
          </button>
        </div>
      )}

      <div className="mobile-chat-actions">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,application/pdf"
          className="hidden"
          onChange={handleFileChange}
          disabled={isDisabled}
        />
        <button
          onClick={handleFileButtonClick}
          className="mobile-button mobile-button-ghost mobile-gesture-zone text-muted-foreground"
          type="button"
          disabled={isDisabled}
        >
          <Paperclip className="w-5 h-5" />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowActivitySelector(!showActivitySelector)}
            className={cn(
              "mobile-button mobile-button-ghost mobile-gesture-zone",
              showActivitySelector ? "text-accent bg-accent/20" : "text-muted-foreground"
            )}
            disabled={isDisabled}
          >
            <Plus className="w-5 h-5" />
          </button>
          <ActivitySelector
            isOpen={showActivitySelector}
            onSelect={handleActivitySelect}
            onClose={() => setShowActivitySelector(false)}
          />
        </div>

        <div className="mobile-flex-1 relative">
          <textarea
            ref={textAreaRef}
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder={selectedActivity ? `Log your ${selectedActivity} experience...` : "Type your message..."}
            className="mobile-chat-input mobile-touch"
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
          className="mobile-button mobile-gesture-zone"
        />

        <button
          onClick={handleSend}
          disabled={!canSend}
          className={cn(
            "mobile-button mobile-gesture-zone transition-all duration-200",
            canSend 
              ? "bg-accent text-accent-foreground scale-100" 
              : "bg-muted text-muted-foreground cursor-not-allowed scale-95"
          )}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
