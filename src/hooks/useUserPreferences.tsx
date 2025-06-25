
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface UserPreferences {
  id: string;
  user_id: string;
  tone_of_voice: 'calm' | 'motivational' | 'supportive' | 'direct' | 'gentle';
  growth_focus: 'habits' | 'mindfulness' | 'goals' | 'journaling';
  notification_time: string;
  notification_frequency: 'daily' | 'weekly' | 'custom' | 'none';
  whatsapp_enabled: boolean;
  push_notifications_enabled: boolean;
  weekly_insights_email: boolean;
  security_alerts_email: boolean;
  marketing_emails: boolean;
  created_at: string;
  updated_at: string;
}

const DEFAULT_PREFERENCES: Omit<UserPreferences, 'id' | 'user_id' | 'created_at' | 'updated_at'> = {
  tone_of_voice: 'supportive',
  growth_focus: 'habits',
  notification_time: '09:00',
  notification_frequency: 'daily',
  whatsapp_enabled: false,
  push_notifications_enabled: true,
  weekly_insights_email: true,
  security_alerts_email: true,
  marketing_emails: false,
};

export const useUserPreferences = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: preferences, isLoading } = useQuery({
    queryKey: ['user-preferences', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching preferences:', error);
        throw error;
      }

      // Return preferences with defaults if no data exists
      if (!data) {
        return {
          ...DEFAULT_PREFERENCES,
          id: '',
          user_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as UserPreferences;
      }

      return data as UserPreferences;
    },
    enabled: !!user,
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: async (updates: Partial<Omit<UserPreferences, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
      if (!user) throw new Error('User not authenticated');

      try {
        // Use upsert with proper conflict resolution
        const { data, error } = await supabase
          .from('user_preferences')
          .upsert({
            user_id: user.id,
            ...DEFAULT_PREFERENCES,
            ...updates,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error in updatePreferencesMutation:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['user-preferences', user?.id], data);
      
      toast({
        title: "Success!",
        description: "Preferences updated successfully!",
      });

      // Schedule notifications in background
      if (user) {
        supabase.functions.invoke('schedule-notifications', {
          body: { userId: user.id },
        }).catch((error) => {
          console.error('Failed to schedule notifications:', error);
        });
      }
    },
    onError: (error: any) => {
      console.error('Error updating preferences:', error);
      toast({
        title: "Error",
        description: `Failed to update preferences: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  return {
    preferences: preferences || {
      ...DEFAULT_PREFERENCES,
      id: '',
      user_id: user?.id || '',
      created_at: '',
      updated_at: '',
    },
    isLoading,
    updatePreferences: updatePreferencesMutation.mutate,
    isUpdating: updatePreferencesMutation.isPending,
  };
};
