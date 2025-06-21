
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
  }, [user]);

  const createNewSession = useCallback(async (title: string = 'New Conversation') => {
    if (!user || isCreatingSession) return null;

    setIsCreatingSession(true);
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
      setCurrentSessionId(newSession.id);
      localStorage.setItem('current-chat-session', newSession.id);
      
      return newSession;
    } catch (error) {
      console.error('Error creating session:', error);
      return null;
    } finally {
      setIsCreatingSession(false);
    }
  }, [user, isCreatingSession]);

  const switchToSession = useCallback(async (sessionId: string) => {
    if (sessionId === currentSessionId) return;
    
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
