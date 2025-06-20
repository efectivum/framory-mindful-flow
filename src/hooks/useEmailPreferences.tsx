
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface EmailPreferences {
  weekly_insights_email: boolean;
  security_alerts_email: boolean;
  marketing_emails: boolean;
}

export const useEmailPreferences = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<EmailPreferences>({
    weekly_insights_email: true,
    security_alerts_email: true,
    marketing_emails: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPreferences();
    }
  }, [user]);

  const fetchPreferences = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('weekly_insights_email, security_alerts_email, marketing_emails')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        throw error;
      }

      if (data) {
        setPreferences({
          weekly_insights_email: data.weekly_insights_email ?? true,
          security_alerts_email: data.security_alerts_email ?? true,
          marketing_emails: data.marketing_emails ?? false,
        });
      }
    } catch (error) {
      console.error('Error fetching email preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (newPreferences: Partial<EmailPreferences>) => {
    if (!user) return;

    try {
      const updatedPreferences = { ...preferences, ...newPreferences };
      
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          ...updatedPreferences,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      setPreferences(updatedPreferences);
      return { success: true };
    } catch (error) {
      console.error('Error updating email preferences:', error);
      return { success: false, error };
    }
  };

  const sendWeeklyInsights = async () => {
    if (!user) return;

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
    preferences,
    loading,
    updatePreferences,
    sendWeeklyInsights,
    refetch: fetchPreferences,
  };
};
