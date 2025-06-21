
import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Message } from '@/types/chat';
import { useToast } from '@/hooks/use-toast';

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
      setMessages(convertedMessages);
    } catch (error) {
      console.error('Messages: Failed to load messages:', error);
      toast({
        title: "Message Load Error",
        description: "Failed to load conversation history.",
        variant: "destructive"
      });
    }
  }, [user, toast]);

  const addMessage = useCallback(async (message: Message, currentSessionId: string | null) => {
    if (!currentSessionId) {
      console.error('Messages: Cannot add message - no session ID');
      return;
    }

    console.log('Messages: Adding message to session:', currentSessionId);
    
    // Add to local state immediately for instant UI update
    setMessages(prev => [...prev, message]);

    // Background sync to database
    if (user) {
      try {
        const metadata: MessageMetadata = {
          activityType: message.activityType,
          isJournalEntry: message.isJournalEntry,
          attachmentUrl: message.attachmentUrl,
          attachmentType: message.attachmentType,
          habitSuggestion: message.habitSuggestion,
          coachingMetadata: message.coachingMetadata
        };

        console.log('Messages: Saving message to database');
        const { error: insertError } = await supabase
          .from('chat_messages')
          .insert({
            id: message.id,
            session_id: currentSessionId,
            user_id: user.id,
            type: message.type,
            content: message.content,
            metadata: metadata as any
          });

        if (insertError) {
          console.error('Messages: Error saving message:', insertError);
          throw insertError;
        }

        // Update session's last_message_at
        const { error: updateError } = await supabase
          .from('chat_sessions')
          .update({ 
            updated_at: new Date().toISOString(),
            last_message_at: new Date().toISOString()
          })
          .eq('id', currentSessionId);

        if (updateError) {
          console.error('Messages: Error updating session timestamp:', updateError);
        }

        console.log('Messages: Message saved successfully');
      } catch (error) {
        console.error('Messages: Background sync failed:', error);
        // Don't show error to user - message is already in UI
        // But we could implement retry logic here in the future
      }
    }
  }, [user]);

  const setWelcomeMessage = useCallback(() => {
    console.log('Messages: Setting welcome message');
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
