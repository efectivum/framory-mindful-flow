
import { useState } from 'react';
import { Message } from '@/types/chat';

interface SimpleMessageManagerProps {
  onMessageAdd: (message: Message) => void;
  textAreaRef: React.RefObject<HTMLTextAreaElement>;
}

export const useSimpleMessageManager = ({
  onMessageAdd,
  textAreaRef
}: SimpleMessageManagerProps) => {
  const [inputText, setInputText] = useState('');
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [fileAttachment, setFileAttachment] = useState<File | null>(null);

  const handleSend = async () => {
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
    setSelectedActivity(null);
    
    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileAttachment(file);
    }
  };

  const handleVoiceTranscription = (transcribedText: string) => {
    setInputText(transcribedText);
    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
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
    handleVoiceTranscription,
    isDetectingIntent: false // Simplified for now
  };
};
