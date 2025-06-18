
import { useState } from 'react';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { useConversationalAI } from '@/hooks/useConversationalAI';
import { useToast } from '@/hooks/use-toast';
import { Message } from '@/types/chat';

interface UseMessageManagerProps {
  isCoachingMode: boolean;
  onConversation: (inputText: string) => Promise<void>;
  textAreaRef: React.RefObject<HTMLTextAreaElement>;
}

export const useMessageManager = ({
  isCoachingMode,
  onConversation,
  textAreaRef
}: UseMessageManagerProps) => {
  const [inputText, setInputText] = useState('');
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [fileAttachment, setFileAttachment] = useState<File | null>(null);
  const { toast } = useToast();
  const { createEntry } = useJournalEntries();
  const { detectIntent, isDetectingIntent } = useConversationalAI();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      toast({
        title: "Unsupported file",
        description: "Only images and PDFs are supported in this preview.",
        variant: "destructive"
      });
      return;
    }
    setFileAttachment(file);
    textAreaRef.current?.focus();
  };

  const handleSend = async (onMessageAdd: (message: Message) => void) => {
    if (!inputText.trim() && !fileAttachment) return;
    
    let attachmentUrl: string | undefined = undefined;
    let attachmentType: string | undefined = undefined;
    if (fileAttachment) {
      attachmentUrl = URL.createObjectURL(fileAttachment);
      attachmentType = fileAttachment.type;
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputText,
      activityType: selectedActivity || undefined,
      timestamp: new Date(),
      ...(attachmentUrl ? { attachmentUrl, attachmentType } : {}),
    };

    onMessageAdd(newMessage);
    setInputText('');
    setFileAttachment(null);
    textAreaRef.current?.focus();

    if (attachmentUrl && !inputText.trim()) return;

    // Handle message based on mode
    if (isCoachingMode) {
      await onConversation(inputText);
    } else {
      // Regular chat mode with intent detection
      const intentResult = await detectIntent(inputText, selectedActivity, []);
      console.log('Intent detection result:', intentResult);

      if (intentResult?.intent === 'journal' && intentResult.confidence > 0.7) {
        newMessage.isJournalEntry = true;
        // Update the message to show it's a journal entry
        onMessageAdd(newMessage);

        createEntry({
          content: inputText,
          title: selectedActivity ? `${selectedActivity} entry` : undefined,
        });

        await onConversation(inputText);
      } else {
        await onConversation(inputText);
      }
    }

    setSelectedActivity(null);
  };

  const handleActivitySelect = (activity: string) => {
    setSelectedActivity(activity);
    textAreaRef.current?.focus();
  };

  const handleVoiceTranscription = (transcribedText: string) => {
    setInputText(transcribedText);
    textAreaRef.current?.focus();
  };

  return {
    inputText,
    setInputText,
    selectedActivity,
    setSelectedActivity,
    fileAttachment,
    setFileAttachment,
    handleSend,
    handleFileChange,
    handleActivitySelect,
    handleVoiceTranscription,
    isDetectingIntent
  };
};
