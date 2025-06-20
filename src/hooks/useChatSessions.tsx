
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  context_type: string;
  context_data: any;
  is_active: boolean;
  last_message_at: string;
  created_at: string;
  updated_at: string;
}

export const useChatSessions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load user's chat sessions
  const loadSessions = useCallback(async () => {
    if (!user) {
      setSessions([]);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: queryError } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('last_message_at', { ascending: false });

      if (queryError) {
        console.error('Database query error:', queryError);
        throw new Error(`Failed to load sessions: ${queryError.message}`);
      }
      
      setSessions(data || []);
    } catch (error) {
      console.error('Error loading chat sessions:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      
      // Only show toast for unexpected errors, not connection issues
      if (!errorMessage.includes('Failed to fetch')) {
        toast({
          title: "Error",
          description: "Failed to load chat sessions",
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  // Create a new chat session
  const createSession = useCallback(async (
    title: string = 'New Conversation',
    contextType: string = 'general',
    contextData: any = {}
  ): Promise<ChatSession | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: user.id,
          title,
          context_type: contextType,
          context_data: contextData
        })
        .select()
        .single();

      if (error) throw error;

      const newSession = data as ChatSession;
      setSessions(prev => [newSession, ...prev]);
      setCurrentSession(newSession);
      return newSession;
    } catch (error) {
      console.error('Error creating chat session:', error);
      toast({
        title: "Error",
        description: "Failed to create new chat session",
        variant: "destructive"
      });
      return null;
    }
  }, [user, toast]);

  // Update session title
  const updateSessionTitle = useCallback(async (sessionId: string, title: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('chat_sessions')
        .update({ title })
        .eq('id', sessionId)
        .eq('user_id', user.id);

      if (error) throw error;

      setSessions(prev => prev.map(s => 
        s.id === sessionId ? { ...s, title } : s
      ));

      if (currentSession?.id === sessionId) {
        setCurrentSession(prev => prev ? { ...prev, title } : null);
      }
    } catch (error) {
      console.error('Error updating session title:', error);
      toast({
        title: "Error",
        description: "Failed to update session title",
        variant: "destructive"
      });
    }
  }, [user, currentSession, toast]);

  // Delete a session
  const deleteSession = useCallback(async (sessionId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', sessionId)
        .eq('user_id', user.id);

      if (error) throw error;

      setSessions(prev => prev.filter(s => s.id !== sessionId));
      
      if (currentSession?.id === sessionId) {
        setCurrentSession(null);
      }

      toast({
        title: "Session deleted",
        description: "Chat session has been removed"
      });
    } catch (error) {
      console.error('Error deleting session:', error);
      toast({
        title: "Error",
        description: "Failed to delete session",
        variant: "destructive"
      });
    }
  }, [user, currentSession, toast]);

  // Set current session
  const setActiveSession = useCallback((session: ChatSession | null) => {
    setCurrentSession(session);
  }, []);

  // Load sessions on mount
  useEffect(() => {
    if (user) {
      loadSessions();
    }
  }, [user, loadSessions]);

  return {
    sessions,
    currentSession,
    isLoading,
    error,
    createSession,
    updateSessionTitle,
    deleteSession,
    setActiveSession,
    loadSessions
  };
};
