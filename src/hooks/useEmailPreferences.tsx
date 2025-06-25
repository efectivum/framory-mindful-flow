
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export const useEmailPreferences = () => {
  const { user } = useAuth();

  const sendWeeklyInsights = async () => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      const { data, error } = await supabase.functions.invoke('send-weekly-insights', {
        body: { userId: user.id }
      });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error sending weekly insights:', error);
      return { success: false, error };
    }
  };

  return {
    sendWeeklyInsights,
  };
};
