
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
      // Load all user sessions with timeout
      const loadSessionsPromise = loadSessions();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Session loading timeout')), 10000)
      );
      
      await Promise.race([loadSessionsPromise, timeoutPromise]);
      
      // Try to find the most recent active session with timeout
      const sessionQueryPromise = supabase
        .from('chat_sessions')
        .select('id, title, created_at, updated_at')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();
        
      const sessionTimeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Session query timeout')), 5000)
      );

      const { data: recentSession, error } = await Promise.race([
        sessionQueryPromise,
        sessionTimeoutPromise
      ]) as any;

      if (error && !error.message?.includes('timeout')) {
        console.error('Chat initialization: Error loading recent session:', error);
      }

      if (recentSession) {
        console.log('Chat initialization: Restoring recent session:', recentSession.id);
        setCurrentSessionId(recentSession.id);
        localStorage.setItem('current-chat-session', recentSession.id);
        
        // Load messages with timeout
        const loadMessagesPromise = loadMessagesForSession(recentSession.id);
        const messagesTimeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Messages loading timeout')), 8000)
        );
        
        try {
          await Promise.race([loadMessagesPromise, messagesTimeoutPromise]);
        } catch (messagesError) {
          console.warn('Chat initialization: Messages loading failed, using fallback:', messagesError);
          setWelcomeMessage();
        }
      } else {
        console.log('Chat initialization: No sessions found, creating new one');
        const newSession = await createNewSession('New Conversation');
        if (newSession) {
          console.log('Chat initialization: New session created:', newSession.id);
          setWelcomeMessage();
        } else {
          throw new Error('Failed to create initial session');
        }
      }

      setHasInitialized(true);
    } catch (error) {
      console.error('Chat initialization: Failed:', error);
      
      // Fallback: create basic session state
      try {
        console.log('Chat initialization: Using fallback initialization');
        const fallbackSession = await createNewSession('Fallback Session');
        if (fallbackSession) {
          setWelcomeMessage();
          setHasInitialized(true);
        } else {
          // Ultimate fallback - just show welcome message
          setWelcomeMessage();
          setHasInitialized(true);
        }
      } catch (fallbackError) {
        console.error('Chat initialization: Fallback failed:', fallbackError);
        setWelcomeMessage();
        setHasInitialized(true);
        
        toast({
          title: "Chat Setup Warning",
          description: "Chat initialized with limited functionality. Some features may not work properly.",
          variant: "destructive"
        });
      }
    } finally {
      setIsInitializing(false);
    }
  }, [user, hasInitialized, isInitializing, loadSessions, setCurrentSessionId, loadMessagesForSession, createNewSession, setWelcomeMessage, toast]);

  // Initialize when user is available and we haven't initialized yet
  useEffect(() => {
    if (user && !hasInitialized && !isLoadingSessions && !isInitializing) {
      // Add small delay to ensure everything is ready
      const timer = setTimeout(() => {
        initializeChatState();
      }, 100);
      
      return () => clearTimeout(timer);
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
    
    try {
      await loadMessagesForSession(sessionId);
    } catch (error) {
      console.warn('Chat: Failed to load messages for session:', error);
      setWelcomeMessage();
    }
  }, [switchToSession, loadMessagesForSession, setWelcomeMessage]);

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
