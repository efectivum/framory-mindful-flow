
import React from 'react';
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
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

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
          <label className="relative">
            <input
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={handleFileChange}
              disabled={isDetectingIntent || isGeneratingResponse}
            />
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-blue-400 hover:bg-blue-950 h-11 w-11 rounded-full shrink-0 min-h-[44px] min-w-[44px] touch-manipulation"
              type="button"
              tabIndex={-1}
            >
              <Paperclip className="w-5 h-5" />
            </Button>
          </label>

          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowActivitySelector(!showActivitySelector)}
              className={cn(
                "text-gray-400 hover:text-blue-300 hover:bg-blue-900 h-11 w-11 shrink-0 rounded-full min-h-[44px] min-w-[44px] touch-manipulation",
                showActivitySelector && "text-blue-400 bg-blue-950"
              )}
            >
              <Plus className="w-5 h-5" />
            </Button>
            <ActivitySelector
              isOpen={showActivitySelector}
              onSelect={handleActivitySelect}
              onClose={() => setShowActivitySelector(false)}
            />
          </div>

          <Textarea
            ref={textAreaRef}
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              e.target.rows = 1;
              const newRows = Math.min(Math.ceil(e.target.scrollHeight / 24), 4);
              e.target.rows = newRows;
            }}
            onKeyPress={handleKeyPress}
            placeholder={selectedActivity ? `Log your ${selectedActivity} experience...` : "Type your message..."}
            className="flex-1 min-h-[44px] max-h-[120px] resize-none rounded-xl border-gray-700 bg-[#232b3a] focus:border-blue-500 focus:ring-blue-500 py-3 px-4 text-gray-100 placeholder:text-gray-400 touch-manipulation"
            rows={1}
            disabled={isDetectingIntent || isGeneratingResponse}
            style={{ fontSize: '16px' }}
          />

          <VoiceButton
            onTranscription={handleVoiceTranscription}
            disabled={isDetectingIntent || isGeneratingResponse}
            className="min-h-[44px] min-w-[44px] h-11 w-11 rounded-full touch-manipulation"
          />

          <Button
            onClick={handleSend}
            disabled={isDetectingIntent || isGeneratingResponse || (!inputText.trim() && !fileAttachment)}
            size="icon"
            className="bg-blue-600 hover:bg-blue-700 text-white h-11 w-11 rounded-full shrink-0 shadow-sm disabled:opacity-60 min-h-[44px] min-w-[44px] touch-manipulation haptic-light"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
