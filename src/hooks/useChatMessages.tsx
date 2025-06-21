
import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Message } from '@/types/chat';

interface MessageMetadata {
  activityType?: string;
  isJournalEntry?: boolean;
  attachmentUrl?: string;
  attachmentType?: string;
  habitSuggestion?: {
    title: string;
    description: string;
    frequency_type: 'daily' | 'weekly';
    target_days: number;
    conversationContext?: string;
  };
  coachingMetadata?: {
    interventionType: string;
    hasProtocolReference: boolean;
    canRequestFeedback: boolean;
    interactionId?: string;
  };
}

export const useChatMessages = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);

  const loadMessagesForSession = useCallback(async (sessionId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const convertedMessages = (data || []).map(msg => {
        const metadata = (msg.metadata as MessageMetadata) || {};
        
        return {
          id: msg.id,
          type: msg.type as 'user' | 'bot',
          content: msg.content,
          timestamp: new Date(msg.created_at),
          activityType: metadata.activityType,
          isJournalEntry: metadata.isJournalEntry,
          attachmentUrl: metadata.attachmentUrl,
          attachmentType: metadata.attachmentType,
          habitSuggestion: metadata.habitSuggestion,
          coachingMetadata: metadata.coachingMetadata
        };
      });

      setMessages(convertedMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  }, [user]);

  const addMessage = useCallback(async (message: Message, currentSessionId: string | null) => {
    // Add to local state immediately for instant UI update
    setMessages(prev => [...prev, message]);

    // Background sync to database
    if (user && currentSessionId) {
      try {
        const metadata: MessageMetadata = {
          activityType: message.activityType,
          isJournalEntry: message.isJournalEntry,
          attachmentUrl: message.attachmentUrl,
          attachmentType: message.attachmentType,
          habitSuggestion: message.habitSuggestion,
          coachingMetadata: message.coachingMetadata
        };

        await supabase
          .from('chat_messages')
          .insert({
            id: message.id,
            session_id: currentSessionId,
            user_id: user.id,
            type: message.type,
            content: message.content,
            metadata: metadata as any
          });

        // Update session's last_message_at
        await supabase
          .from('chat_sessions')
          .update({ 
            updated_at: new Date().toISOString(),
            last_message_at: new Date().toISOString()
          })
          .eq('id', currentSessionId);

      } catch (error) {
        console.error('Background sync failed:', error);
        // Don't show error to user - message is already in UI
      }
    }
  }, [user]);

  const setWelcomeMessage = useCallback(() => {
    const welcomeMessage: Message = {
      id: 'welcome-' + Date.now(),
      type: 'bot',
      content: "Hi! I'm your personal growth coach. I'm here to help you explore your thoughts, work through challenges, and gain deeper insights. What's on your mind today?",
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, []);

  return {
    messages,
    setMessages,
    loadMessagesForSession,
    addMessage,
    setWelcomeMessage
  };
};
