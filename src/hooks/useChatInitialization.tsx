
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useChatSessionManager } from './useChatSessionManager';
import { useChatMessages } from './useChatMessages';

export const useChatInitialization = () => {
  const { user } = useAuth();
  const [hasInitialized, setHasInitialized] = useState(false);
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);
  
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
    setWelcomeMessage
  } = useChatMessages();

  const initializeChatState = useCallback(async () => {
    await loadSessions();
    
    // Try to restore or create a session
    const savedSessionId = localStorage.getItem('current-chat-session');
    
    if (savedSessionId) {
      // Check if saved session still exists and is active
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('id')
        .eq('id', savedSessionId)
        .eq('user_id', user!.id)
        .eq('is_active', true)
        .maybeSingle();
      
      if (!error && data) {
        setCurrentSessionId(savedSessionId);
        await loadMessagesForSession(savedSessionId);
        return;
      } else {
        localStorage.removeItem('current-chat-session');
      }
    }
    
    // Look for an existing active session
    const { data: activeSessions } = await supabase
      .from('chat_sessions')
      .select('id, title, created_at, updated_at')
      .eq('user_id', user!.id)
      .eq('context_type', 'coaching')
      .eq('is_active', true)
      .order('updated_at', { ascending: false })
      .limit(1);
    
    if (activeSessions && activeSessions.length > 0) {
      const activeSession = activeSessions[0];
      setCurrentSessionId(activeSession.id);
      localStorage.setItem('current-chat-session', activeSession.id);
      await loadMessagesForSession(activeSession.id);
    } else {
      // Create a new session
      const newSession = await createNewSession();
      if (newSession) {
        setWelcomeMessage();
      }
    }
  }, [user, loadSessions, setCurrentSessionId, loadMessagesForSession, createNewSession, setWelcomeMessage]);

  // Initialize on mount
  useEffect(() => {
    if (user && !hasInitialized) {
      initializeChatState();
      setHasInitialized(true);
    }
  }, [user, hasInitialized, initializeChatState]);

  const addMessage = useCallback(async (message: any) => {
    await addMessageToState(message, currentSessionId);
  }, [addMessageToState, currentSessionId]);

  const startNewChat = useCallback(async () => {
    const session = await createNewSession();
    if (session) {
      setWelcomeMessage();
    } else {
      console.error('Failed to create new session');
    }
  }, [createNewSession, setWelcomeMessage]);

  const handleSwitchToSession = useCallback(async (sessionId: string) => {
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
    isLoadingSessions,
    addMessage,
    loadSessions,
    switchToSession: handleSwitchToSession,
    startNewChat
  };
};
