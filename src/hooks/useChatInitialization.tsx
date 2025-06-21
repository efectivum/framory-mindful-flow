
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
  const [initializationError, setInitializationError] = useState<string | null>(null);
  
  const {
    sessions,
    setSessions,
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
    setWelcomeMessage,
    ensureWelcomeMessage
  } = useChatMessages();

  const initializeChatState = useCallback(async () => {
    if (!user) {
      console.log('Chat initialization: No user found');
      return;
    }

    try {
      console.log('Chat initialization: Starting...');
      setInitializationError(null);
      
      // Load all sessions first
      await loadSessions();
      console.log('Chat initialization: Sessions loaded');
      
      // Try to restore saved session
      const savedSessionId = localStorage.getItem('current-chat-session');
      console.log('Chat initialization: Saved session ID:', savedSessionId);
      
      if (savedSessionId) {
        try {
          // Verify saved session exists and is active
          const { data, error } = await supabase
            .from('chat_sessions')
            .select('id')
            .eq('id', savedSessionId)
            .eq('user_id', user.id)
            .eq('is_active', true)
            .maybeSingle();
          
          if (!error && data) {
            console.log('Chat initialization: Restoring saved session');
            setCurrentSessionId(savedSessionId);
            await loadMessagesForSession(savedSessionId);
            return;
          } else {
            console.log('Chat initialization: Saved session invalid, removing from storage');
            localStorage.removeItem('current-chat-session');
          }
        } catch (error) {
          console.error('Chat initialization: Error verifying saved session:', error);
          localStorage.removeItem('current-chat-session');
        }
      }
      
      // Look for existing active session
      try {
        const { data: activeSessions, error } = await supabase
          .from('chat_sessions')
          .select('id, title, created_at, updated_at')
          .eq('user_id', user.id)
          .eq('context_type', 'coaching')
          .eq('is_active', true)
          .order('updated_at', { ascending: false })
          .limit(1);
        
        if (error) throw error;
        
        if (activeSessions && activeSessions.length > 0) {
          const activeSession = activeSessions[0];
          console.log('Chat initialization: Found existing active session');
          setCurrentSessionId(activeSession.id);
          localStorage.setItem('current-chat-session', activeSession.id);
          await loadMessagesForSession(activeSession.id);
          return;
        }
      } catch (error) {
        console.error('Chat initialization: Error loading active sessions:', error);
      }
      
      // Create new session as last resort
      console.log('Chat initialization: Creating new session');
      const newSession = await createNewSession();
      if (newSession) {
        console.log('Chat initialization: New session created successfully');
        // Welcome message will be automatically added by loadMessagesForSession for empty sessions
      } else {
        throw new Error('Failed to create new session');
      }
    } catch (error) {
      console.error('Chat initialization: Failed to initialize:', error);
      setInitializationError(error instanceof Error ? error.message : 'Failed to initialize chat');
      toast({
        title: "Chat Initialization Error",
        description: "Failed to set up chat session. Please refresh the page.",
        variant: "destructive"
      });
    }
  }, [user, loadSessions, setCurrentSessionId, loadMessagesForSession, createNewSession, toast]);

  // Initialize on mount
  useEffect(() => {
    if (user && !hasInitialized && !isLoadingSessions) {
      console.log('Chat initialization: Starting initialization effect');
      initializeChatState();
      setHasInitialized(true);
    }
  }, [user, hasInitialized, isLoadingSessions, initializeChatState]);

  const addMessage = useCallback(async (message: any) => {
    if (!currentSessionId) {
      console.error('Chat: Cannot add message - no current session');
      toast({
        title: "Session Error",
        description: "No active chat session. Please refresh the page.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      console.log('Chat: Adding message to session:', currentSessionId);
      await addMessageToState(message, currentSessionId);
    } catch (error) {
      console.error('Chat: Failed to add message:', error);
      toast({
        title: "Message Error",
        description: "Failed to save message. Please try again.",
        variant: "destructive"
      });
    }
  }, [addMessageToState, currentSessionId, toast]);

  const startNewChat = useCallback(async () => {
    try {
      console.log('Chat: Starting new chat');
      const session = await createNewSession();
      if (session) {
        console.log('Chat: New chat session created');
        // Clear messages and ensure welcome message is shown
        setMessages([]);
        setWelcomeMessage();
      } else {
        throw new Error('Failed to create new session');
      }
    } catch (error) {
      console.error('Chat: Failed to start new chat:', error);
      toast({
        title: "New Chat Error",
        description: "Failed to create new conversation. Please try again.",
        variant: "destructive"
      });
    }
  }, [createNewSession, setWelcomeMessage, setMessages, toast]);

  const handleSwitchToSession = useCallback(async (sessionId: string) => {
    try {
      console.log('Chat: Switching to session:', sessionId);
      await switchToSession(sessionId);
      await loadMessagesForSession(sessionId);
    } catch (error) {
      console.error('Chat: Failed to switch session:', error);
      toast({
        title: "Session Switch Error",
        description: "Failed to switch conversations. Please try again.",
        variant: "destructive"
      });
    }
  }, [switchToSession, loadMessagesForSession, toast]);

  // Ensure welcome message is present when component mounts and session is ready
  useEffect(() => {
    if (currentSessionId && hasInitialized && messages.length === 0) {
      console.log('Chat: Ensuring welcome message for empty session');
      ensureWelcomeMessage();
    }
  }, [currentSessionId, hasInitialized, messages.length, ensureWelcomeMessage]);

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
    switchToSession: handleSwitchToSession,
    startNewChat,
    initializationError,
    hasInitialized
  };
};
