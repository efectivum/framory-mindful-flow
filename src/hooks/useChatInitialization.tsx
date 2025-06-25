
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useChatSessionManager } from './useChatSessionManager';
import { useChatMessages } from './useChatMessages';
import { useToast } from '@/hooks/use-toast';

export const useChatInitialization = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [hasInitialized, setHasInitialized] = useState(false);
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  
  const {
    sessions,
    currentSessionId,
    setCurrentSessionId,
    isLoadingSessions,
    isCreatingSession,
    loadSessions,
    createNewSession,
    switchToSession
  } = useChatSessionManager();

  const {
    messages,
    setMessages,
    loadMessagesForSession,
    addMessage: addMessageToState,
    setWelcomeMessage
  } = useChatMessages();

  const initializeChatState = useCallback(async () => {
    if (!user || hasInitialized || isInitializing) {
      return;
    }

    console.log('Chat initialization: Starting for user:', user.id);
    setIsInitializing(true);
    
    try {
      // Load all user sessions
      await loadSessions();
      
      // Try to find the most recent active session
      const { data: recentSession, error } = await supabase
        .from('chat_sessions')
        .select('id, title, created_at, updated_at')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Chat initialization: Error loading recent session:', error);
      }

      if (recentSession) {
        console.log('Chat initialization: Restoring recent session:', recentSession.id);
        setCurrentSessionId(recentSession.id);
        localStorage.setItem('current-chat-session', recentSession.id);
        await loadMessagesForSession(recentSession.id);
      } else {
        console.log('Chat initialization: No sessions found, creating new one');
        const newSession = await createNewSession('New Conversation');
        if (newSession) {
          console.log('Chat initialization: New session created:', newSession.id);
          // Welcome message will be added by loadMessagesForSession for empty sessions
        } else {
          throw new Error('Failed to create initial session');
        }
      }

      setHasInitialized(true);
    } catch (error) {
      console.error('Chat initialization: Failed:', error);
      toast({
        title: "Chat Setup Error",
        description: "Failed to set up chat. Please refresh the page.",
        variant: "destructive"
      });
    } finally {
      setIsInitializing(false);
    }
  }, [user, hasInitialized, isInitializing, loadSessions, setCurrentSessionId, loadMessagesForSession, createNewSession, toast]);

  // Initialize when user is available and we haven't initialized yet
  useEffect(() => {
    if (user && !hasInitialized && !isLoadingSessions && !isInitializing) {
      initializeChatState();
    }
  }, [user, hasInitialized, isLoadingSessions, isInitializing, initializeChatState]);

  const addMessage = useCallback(async (message: any) => {
    if (!currentSessionId) {
      console.warn('Chat: Cannot add message - no current session');
      return;
    }
    
    console.log('Chat: Adding message to session:', currentSessionId);
    await addMessageToState(message, currentSessionId);
  }, [addMessageToState, currentSessionId]);

  const startNewChat = useCallback(async () => {
    console.log('Chat: Starting new chat');
    const session = await createNewSession('New Conversation');
    if (session) {
      setMessages([]);
      setWelcomeMessage();
    }
  }, [createNewSession, setWelcomeMessage, setMessages]);

  const handleSwitchToSession = useCallback(async (sessionId: string) => {
    console.log('Chat: Switching to session:', sessionId);
    await switchToSession(sessionId);
    await loadMessagesForSession(sessionId);
  }, [switchToSession, loadMessagesForSession]);

  return {
    messages,
    setMessages,
    sessions,
    currentSessionId,
    isGeneratingResponse,
    setIsGeneratingResponse,
    isLoadingSessions: isLoadingSessions || isInitializing,
    addMessage,
    loadSessions,
    switchToSession: handleSwitchToSession,
    startNewChat,
    hasInitialized
  };
};
