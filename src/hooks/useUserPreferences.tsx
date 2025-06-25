
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface UserPreferences {
  id: string;
  tone_of_voice: 'calm' | 'motivational' | 'supportive' | 'direct' | 'gentle';
  growth_focus: 'habits' | 'mindfulness' | 'goals' | 'journaling';
  notification_time: string;
  notification_frequency: 'daily' | 'weekly' | 'custom' | 'none';
  whatsapp_enabled: boolean;
  push_notifications_enabled: boolean;
}

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
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data as UserPreferences | null;
    },
    enabled: !!user,
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: async (updates: Partial<Omit<UserPreferences, 'id'>>) => {
      if (!user) throw new Error('User not authenticated');

      // First, try to get existing preferences
      const { data: existingPrefs } = await supabase
        .from('user_preferences')
        .select('id')
        .eq('user_id', user.id)
        .single();

      let result;
      
      if (existingPrefs) {
        // Update existing record
        const { data, error } = await supabase
          .from('user_preferences')
          .update({
            ...updates,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) throw error;
        result = data;
      } else {
        // Insert new record
        const { data, error } = await supabase
          .from('user_preferences')
          .insert({
            user_id: user.id,
            ...updates,
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (error) throw error;
        result = data;
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-preferences'] });
      
      if (user) {
        supabase.functions.invoke('schedule-notifications', {
          body: { userId: user.id },
        }).then(({ error }) => {
          if (error) {
            console.error('Failed to schedule notifications:', error);
            toast({
              title: "Preferences saved, but...",
              description: `We couldn't update your notification schedule. Error: ${error.message}`,
              variant: "destructive",
            });
          } else {
            toast({
              title: "Success!",
              description: "Preferences and notification schedule updated successfully!",
            });
          }
        });
      } else {
          toast({
            title: "Success!",
            description: "Preferences updated successfully!",
          });
      }
    },
    onError: (error) => {
      console.error('Error updating preferences:', error);
      toast({
        title: "Error",
        description: `Failed to update preferences: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  return {
    preferences,
    isLoading,
    updatePreferences: updatePreferencesMutation.mutate,
    isUpdating: updatePreferencesMutation.isPending,
  };
};
