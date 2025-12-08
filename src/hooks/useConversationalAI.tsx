
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const useConversationalAI = () => {
  const { user } = useAuth();
  const [isDetectingIntent, setIsDetectingIntent] = useState(false);
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);

  const detectIntent = async (
    message: string,
    activityType?: string,
    conversationHistory?: ConversationMessage[]
  ) => {
    if (!user) return null;

    setIsDetectingIntent(true);
    try {
      const { data, error } = await supabase.functions.invoke('detect-intent', {
        body: { 
          message, 
          activityType,
          conversationHistory: conversationHistory?.slice(-3)
        }
      });

      if (error) {
        // Check for rate limit or payment errors
        if (error.message?.includes('429') || error.message?.includes('Rate limit')) {
          toast({
            title: "Please wait",
            description: "Too many requests. Please try again in a moment.",
            variant: "destructive",
          });
          return null;
        }
        if (error.message?.includes('402') || error.message?.includes('credits')) {
          toast({
            title: "AI Credits Exhausted",
            description: "Please add funds to continue using AI features.",
            variant: "destructive",
          });
          return null;
        }
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Failed to detect intent:', error);
      return null;
    } finally {
      setIsDetectingIntent(false);
    }
  };

  const generateResponse = async (
    message: string,
    conversationHistory: ConversationMessage[] = [],
    isJournalEntry: boolean = false,
    mode: "onboarding" | "chat" | "coaching" = "chat"
  ) => {
    if (!user) return null;

    setIsGeneratingResponse(true);
    try {
      const { data, error } = await supabase.functions.invoke('conversational-ai', {
        body: {
          message,
          conversationHistory,
          userId: user.id,
          isJournalEntry,
          onboarding: mode === "onboarding",
          coachingMode: mode === "coaching",
        }
      });

      if (error) {
        // Check for rate limit or payment errors
        if (error.message?.includes('429') || error.message?.includes('Rate limit')) {
          toast({
            title: "Please wait",
            description: "Too many requests. Please try again in a moment.",
            variant: "destructive",
          });
          return null;
        }
        if (error.message?.includes('402') || error.message?.includes('credits')) {
          toast({
            title: "AI Credits Exhausted", 
            description: "Please add funds to continue using AI features.",
            variant: "destructive",
          });
          return null;
        }
        throw error;
      }
      
      // Handle both old and new response formats
      if (typeof data.response === 'string') {
        return data.response;
      } else if (data.response && data.response.response) {
        return data.response.response;
      } else {
        return data.response;
      }
    } catch (error) {
      console.error('Failed to generate AI response:', error);
      toast({
        title: "AI Error",
        description: "Failed to generate response. Please try again.",
        variant: "destructive",
      });
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
