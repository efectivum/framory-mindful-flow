
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface JournalEntry {
  id: string;
  user_id: string;
  title?: string;
  content: string;
  mood_before?: number;
  mood_after?: number;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export const useJournalEntries = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ['journal-entries', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as JournalEntry[];
    },
    enabled: !!user,
  });

  const createEntryMutation = useMutation({
    mutationFn: async (newEntry: {
      title?: string;
      content: string;
      mood_before?: number;
      mood_after?: number;
      tags?: string[];
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('journal_entries')
        .insert([{ ...newEntry, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal-entries'] });
      toast({
        title: "Success!",
        description: "Journal entry saved successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to save entry: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const updateEntryMutation = useMutation({
    mutationFn: async ({ id, updates }: {
      id: string;
      updates: Partial<Omit<JournalEntry, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('journal_entries')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal-entries'] });
      toast({
        title: "Success!",
        description: "Journal entry updated successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update entry: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Get stats for dashboard
  const getJournalStats = () => {
    const thisWeek = entries.filter(entry => {
      const entryDate = new Date(entry.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return entryDate > weekAgo;
    });

    const avgMood = entries
      .filter(entry => entry.mood_after)
      .reduce((sum, entry) => sum + (entry.mood_after || 0), 0) / 
      entries.filter(entry => entry.mood_after).length || 0;

    return {
      thisWeekCount: thisWeek.length,
      totalCount: entries.length,
      averageMood: avgMood,
      currentStreak: calculateJournalStreak(entries),
    };
  };

  const calculateJournalStreak = (entries: JournalEntry[]) => {
    if (entries.length === 0) return 0;
    
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 30; i++) {
      const dayEntries = entries.filter(entry => {
        const entryDate = new Date(entry.created_at);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === currentDate.getTime();
      });
      
      if (dayEntries.length > 0) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  };

  return {
    entries,
    isLoading,
    createEntry: createEntryMutation.mutate,
    updateEntry: updateEntryMutation.mutate,
    isCreating: createEntryMutation.isPending,
    isUpdating: updateEntryMutation.isPending,
    stats: getJournalStats(),
  };
};
