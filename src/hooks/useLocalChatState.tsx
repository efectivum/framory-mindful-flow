
import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Message } from '@/types/chat';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

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

export const useLocalChatState = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Local state - this is the source of truth for UI
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome-' + Date.now(),
        type: 'bot',
        content: "Hi! I'm your personal growth coach. I'm here to help you explore your thoughts, work through challenges, and gain deeper insights. What's on your mind today?",
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [messages.length]);

  // Load sessions on mount
  useEffect(() => {
    if (user) {
      loadSessions();
      
      // Try to restore session from localStorage
      const savedSessionId = localStorage.getItem('current-chat-session');
      if (savedSessionId) {
        setCurrentSessionId(savedSessionId);
        loadMessagesForSession(savedSessionId);
      }
    }
  }, [user]);

  const loadSessions = async () => {
    if (!user) return;

    setIsLoadingSessions(true);
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('id, title, created_at, updated_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setIsLoadingSessions(false);
    }
  };

  const loadMessagesForSession = async (sessionId: string) => {
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
  };

  const createNewSession = async (title: string = 'New Conversation') => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: user.id,
          title,
          context_type: 'coaching',
          context_data: {}
        })
        .select()
        .single();

      if (error) throw error;

      const newSession: ChatSession = {
        id: data.id,
        title: data.title,
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      setSessions(prev => [newSession, ...prev]);
      return newSession;
    } catch (error) {
      console.error('Error creating session:', error);
      return null;
    }
  };

  const switchToSession = async (sessionId: string) => {
    setCurrentSessionId(sessionId);
    localStorage.setItem('current-chat-session', sessionId);
    await loadMessagesForSession(sessionId);
  };

  const startNewChat = async () => {
    const session = await createNewSession();
    if (session) {
      setCurrentSessionId(session.id);
      localStorage.setItem('current-chat-session', session.id);
      
      // Reset to welcome message
      const welcomeMessage: Message = {
        id: 'welcome-' + Date.now(),
        type: 'bot',
        content: "Hi! I'm your personal growth coach. I'm here to help you explore your thoughts, work through challenges, and gain deeper insights. What's on your mind today?",
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  };

  const addMessage = useCallback(async (message: Message) => {
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
    } else if (user && !currentSessionId) {
      // Create session lazily on first message
      const session = await createNewSession();
      if (session) {
        setCurrentSessionId(session.id);
        localStorage.setItem('current-chat-session', session.id);
        
        // Retry saving the message
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
              session_id: session.id,
              user_id: user.id,
              type: message.type,
              content: message.content,
              metadata: metadata as any
            });
        } catch (error) {
          console.error('Failed to save message after session creation:', error);
        }
      }
    }
  }, [user, currentSessionId]);

  return {
    messages,
    setMessages,
    sessions,
    currentSessionId,
    isGeneratingResponse,
    setIsGeneratingResponse,
    isLoadingSessions,
    addMessage,
    loadSessions,
    switchToSession,
    startNewChat
  };
};
