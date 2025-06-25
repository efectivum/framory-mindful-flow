
import { Message } from '@/types/chat';

export const generateMessageId = (): string => {
  // Generate a UUID v4 compatible string without external dependencies
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const createWelcomeMessage = (): Message => {
  return {
    id: generateMessageId(),
    type: 'bot',
    content: "Hi! I'm your personal growth coach. I'm here to help you explore your thoughts, work through challenges, and gain deeper insights. What's on your mind today?",
    timestamp: new Date(),
  };
};

export const createUserMessage = (content: string, activityType?: string, attachmentUrl?: string, attachmentType?: string): Message => {
  return {
    id: generateMessageId(),
    type: 'user',
    content,
    timestamp: new Date(),
    ...(activityType ? { activityType } : {}),
    ...(attachmentUrl ? { attachmentUrl, attachmentType } : {}),
  };
};

export const createBotMessage = (content: string, habitSuggestion?: any, coachingMetadata?: any): Message => {
  return {
    id: generateMessageId(),
    type: 'bot',
    content,
    timestamp: new Date(),
    ...(habitSuggestion ? { habitSuggestion } : {}),
    ...(coachingMetadata ? { coachingMetadata } : {}),
  };
};
