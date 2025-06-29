
import { Message } from '@/types/chat';

export const generateMessageId = (): string => {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const createWelcomeMessage = (): Message => {
  return {
    id: generateMessageId(),
    type: 'bot',
    content: "Hi! I'm your personal growth coach. I'm here to help you explore your thoughts, work through challenges, and gain deeper insights. What's on your mind today?",
    timestamp: new Date(),
  };
};

export const createUserMessage = (
  content: string,
  activityType?: string,
  attachmentUrl?: string,
  attachmentType?: string
): Message => {
  return {
    id: generateMessageId(),
    type: 'user',
    content,
    timestamp: new Date(),
    activityType,
    attachmentUrl,
    attachmentType,
  };
};

export const createBotMessage = (content: string): Message => {
  return {
    id: generateMessageId(),
    type: 'bot',
    content,
    timestamp: new Date(),
  };
};
