
import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Message } from '@/types/chat';
import { useToast } from '@/hooks/use-toast';
import { createWelcomeMessage, generateMessageId } from '@/utils/messageUtils';

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
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);

  const saveMessageToDatabase = useCallback(async (message: Message, sessionId: string) => {
    if (!user) return;

    try {
      const metadata: MessageMetadata = {
        activityType: message.activityType,
        isJournalEntry: message.isJournalEntry,
        attachmentUrl: message.attachmentUrl,
        attachmentType: message.attachmentType,
        habitSuggestion: message.habitSuggestion,
        coachingMetadata: message.coachingMetadata
      };

      const { error } = await supabase
        .from('chat_messages')
        .insert({
          id: message.id,
          session_id: sessionId,
          user_id: user.id,
          type: message.type,
          content: message.content,
          metadata: metadata as any
        });

      if (error) {
        console.error('Messages: Error saving message:', error);
        // Retry once after a brief delay with a new ID if UUID conflict
        setTimeout(async () => {
          const retryMessage = { ...message, id: generateMessageId() };
          const { error: retryError } = await supabase
            .from('chat_messages')
            .insert({
              id: retryMessage.id,
              session_id: sessionId,
              user_id: user.id,
              type: retryMessage.type,
              content: retryMessage.content,
              metadata: metadata as any
            });
          
          if (retryError) {
            console.error('Messages: Retry failed:', retryError);
          } else {
            console.log('Messages: Message saved on retry');
          }
        }, 1000);
      } else {
        console.log('Messages: Message saved successfully');
      }
    } catch (error) {
      console.error('Messages: Failed to save message:', error);
    }
  }, [user]);

  const loadMessagesForSession = useCallback(async (sessionId: string) => {
    if (!user) {
      console.log('Messages: No user, cannot load messages');
      return;
    }

    try {
      console.log('Messages: Loading messages for session:', sessionId);
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Messages: Error loading messages:', error);
        throw error;
      }

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

      console.log('Messages: Loaded messages:', convertedMessages.length);
      
      if (convertedMessages.length === 0) {
        console.log('Messages: Session is empty, adding welcome message');
        const welcomeMessage = createWelcomeMessage();
        setMessages([welcomeMessage]);
        // Save welcome message to database
        await saveMessageToDatabase(welcomeMessage, sessionId);
      } else {
        setMessages(convertedMessages);
      }
    } catch (error) {
      console.error('Messages: Failed to load messages:', error);
      toast({
        title: "Message Load Error",
        description: "Failed to load conversation history.",
        variant: "destructive"
      });
      // Set welcome message as fallback
      const welcomeMessage = createWelcomeMessage();
      setMessages([welcomeMessage]);
    }
  }, [user, toast, saveMessageToDatabase]);

  const addMessage = useCallback(async (message: Message, currentSessionId: string | null) => {
    if (!currentSessionId) {
      console.error('Messages: Cannot add message - no session ID');
      return;
    }

    console.log('Messages: Adding message to session:', currentSessionId);
    
    // Add to local state immediately for instant UI update
    setMessages(prev => [...prev, message]);

    // Save to database
    await saveMessageToDatabase(message, currentSessionId);
  }, [saveMessageToDatabase]);

  const setWelcomeMessage = useCallback(() => {
    console.log('Messages: Setting welcome message');
    const welcomeMessage = createWelcomeMessage();
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
