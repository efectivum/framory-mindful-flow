
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const useConversationalAI = () => {
  const { user } = useAuth();
  const [isDetectingIntent, setIsDetectingIntent] = useState(false);
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);

  const detectIntent = async (message: string, activityType?: string) => {
    if (!user) return null;

    setIsDetectingIntent(true);
    try {
      const { data, error } = await supabase.functions.invoke('detect-intent', {
        body: { message, activityType }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to detect intent:', error);
      return null;
    } finally {
      setIsDetectingIntent(false);
    }
  };

  const generateResponse = async (message: string, conversationHistory: ConversationMessage[] = []) => {
    if (!user) return null;

    setIsGeneratingResponse(true);
    try {
      const { data, error } = await supabase.functions.invoke('conversational-ai', {
        body: { 
          message, 
          conversationHistory,
          userId: user.id 
        }
      });

      if (error) throw error;
      return data.response;
    } catch (error) {
      console.error('Failed to generate AI response:', error);
      return null;
    } finally {
      setIsGeneratingResponse(false);
    }
  };

  return {
    detectIntent,
    generateResponse,
    isDetectingIntent,
    isGeneratingResponse,
  };
};
