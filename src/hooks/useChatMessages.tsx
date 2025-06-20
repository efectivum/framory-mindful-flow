
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Message } from '@/types/chat';

export interface SessionMessage {
  id: string;
  session_id: string;
  user_id: string;
  type: 'user' | 'bot';
  content: string;
  metadata: any;
  created_at: string;
  updated_at: string;
}

export const useChatMessages = (sessionId: string | null) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Convert database message to Message type
  const convertToMessage = useCallback((dbMessage: SessionMessage): Message => {
    return {
      id: dbMessage.id,
      type: dbMessage.type,
      content: dbMessage.content,
      timestamp: new Date(dbMessage.created_at),
      activityType: dbMessage.metadata?.activityType,
      isJournalEntry: dbMessage.metadata?.isJournalEntry,
      attachmentUrl: dbMessage.metadata?.attachmentUrl,
      attachmentType: dbMessage.metadata?.attachmentType,
      habitSuggestion: dbMessage.metadata?.habitSuggestion,
      coachingMetadata: dbMessage.metadata?.coachingMetadata
    };
  }, []);

  // Load messages for current session
  const loadMessages = useCallback(async () => {
    if (!user || !sessionId) {
      setMessages([]);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const convertedMessages = (data || []).map(convertToMessage);
      setMessages(convertedMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: "Error",
        description: "Failed to load chat messages",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, sessionId, convertToMessage, toast]);

  // Save message to database
  const saveMessage = useCallback(async (message: Message): Promise<void> => {
    if (!user || !sessionId) return;

    try {
      const metadata = {
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
          session_id: sessionId,
          user_id: user.id,
          type: message.type,
          content: message.content,
          metadata
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving message:', error);
      toast({
        title: "Error",
        description: "Failed to save message",
        variant: "destructive"
      });
    }
  }, [user, sessionId, toast]);

  // Add message to local state and save to database
  const addMessage = useCallback(async (message: Message) => {
    setMessages(prev => [...prev, message]);
    await saveMessage(message);
  }, [saveMessage]);

  // Clear messages (for new session)
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  // Load messages when session changes
  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  return {
    messages,
    isLoading,
    addMessage,
    clearMessages,
    loadMessages
  };
};
