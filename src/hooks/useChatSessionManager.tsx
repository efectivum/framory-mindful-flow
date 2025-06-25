
import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export const useChatSessionManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [isCreatingSession, setIsCreatingSession] = useState(false);

  const loadSessions = useCallback(async () => {
    if (!user) {
      console.log('Session manager: No user, clearing sessions');
      setSessions([]);
      return;
    }

    setIsLoadingSessions(true);
    try {
      console.log('Session manager: Loading sessions for user:', user.id);
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('id, title, created_at, updated_at')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Session manager: Error loading sessions:', error);
        throw error;
      }
      
      console.log('Session manager: Loaded sessions:', data?.length || 0);
      setSessions(data || []);
    } catch (error) {
      console.error('Session manager: Failed to load sessions:', error);
      toast({
        title: "Session Load Error",
        description: "Failed to load chat sessions.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingSessions(false);
    }
  }, [user, toast]);

  const createNewSession = useCallback(async (title: string = 'New Conversation') => {
    if (!user) {
      console.error('Session manager: Cannot create session - no user');
      return null;
    }
    
    if (isCreatingSession) {
      console.log('Session manager: Already creating session, skipping');
      return null;
    }

    setIsCreatingSession(true);
    try {
      console.log('Session manager: Creating new session with title:', title);
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

      if (error) {
        console.error('Session manager: Error creating session:', error);
        throw error;
      }

      const newSession: ChatSession = {
        id: data.id,
        title: data.title,
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      console.log('Session manager: Session created successfully:', newSession.id);
      setSessions(prev => [newSession, ...prev]);
      setCurrentSessionId(newSession.id);
      localStorage.setItem('current-chat-session', newSession.id);
      
      return newSession;
    } catch (error) {
      console.error('Session manager: Failed to create session:', error);
      toast({
        title: "Session Creation Error",
        description: "Failed to create new conversation. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsCreatingSession(false);
    }
  }, [user, isCreatingSession, toast]);

  const switchToSession = useCallback(async (sessionId: string) => {
    if (sessionId === currentSessionId) {
      console.log('Session manager: Already on session:', sessionId);
      return;
    }
    
    console.log('Session manager: Switching to session:', sessionId);
    setCurrentSessionId(sessionId);
    localStorage.setItem('current-chat-session', sessionId);
  }, [currentSessionId]);

  return {
    sessions,
    setSessions,
    currentSessionId,
    setCurrentSessionId,
    isLoadingSessions,
    isCreatingSession,
    loadSessions,
    createNewSession,
    switchToSession
  };
};
