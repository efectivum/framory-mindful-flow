
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type JournalEntry = {
  id: string;
  user_id: string;
  content: string;
  mood_after?: number;
  mood_before?: number;
  title?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  ai_detected_mood?: number;
  ai_sentiment_score?: number;
  ai_detected_emotions?: string[];
  ai_confidence_level?: number;
  mood_alignment_score?: number;
  tags?: string[];
};

export const useJournalEntries = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Get active (non-deleted) journal entries
  const { data: entries, isLoading, error } = useQuery({
    queryKey: ['journal-entries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .is('deleted_at', null) // Only get non-deleted entries
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as JournalEntry[];
    },
  });

  // Create entry mutation
  const createEntryMutation = useMutation({
    mutationFn: async (entry: { content: string; mood_after?: number; mood_before?: number; title?: string; tags?: string[] }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('journal_entries')
        .insert({
          ...entry,
          user_id: user.id
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal-entries'] });
    },
  });

  // Soft delete entry mutation
  const deleteEntryMutation = useMutation({
    mutationFn: async (entryId: string) => {
      const { error } = await supabase
        .from('journal_entries')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', entryId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal-entries'] });
      toast({
        title: "Entry Deleted",
        description: "Your journal entry has been moved to recently deleted. You can restore it within 30 days.",
      });
    },
    onError: (error) => {
      console.error('Delete error:', error);
      toast({
        title: "Delete Failed",
        description: "There was an error deleting your entry. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update entry mutation
  const updateEntryMutation = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; content?: string; title?: string; mood_after?: number; mood_before?: number; tags?: string[] }) => {
      const { data, error } = await supabase
        .from('journal_entries')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal-entries'] });
    },
  });

  // Calculate current streak
  const calculateCurrentStreak = () => {
    if (!entries || entries.length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    const currentDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    for (let i = 0; i <= 365; i++) { // Check up to a year back
      const checkDate = new Date(currentDate);
      checkDate.setDate(checkDate.getDate() - i);
      
      const hasEntryOnDate = entries.some(entry => {
        const entryDate = new Date(entry.created_at);
        const entryDateOnly = new Date(entryDate.getFullYear(), entryDate.getMonth(), entryDate.getDate());
        return entryDateOnly.getTime() === checkDate.getTime();
      });
      
      if (hasEntryOnDate) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  // Calculate stats from entries
  const stats = {
    totalEntries: entries?.length || 0,
    totalCount: entries?.length || 0, // Alias for compatibility
    thisWeekEntries: entries?.filter(entry => {
      const entryDate = new Date(entry.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return entryDate > weekAgo;
    }).length || 0,
    thisWeekCount: entries?.filter(entry => {
      const entryDate = new Date(entry.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return entryDate > weekAgo;
    }).length || 0, // Alias for compatibility
    averageMood: entries?.reduce((sum, entry) => {
      if (entry.mood_after) return sum + entry.mood_after;
      return sum;
    }, 0) / (entries?.filter(entry => entry.mood_after).length || 1) || 0,
    currentStreak: calculateCurrentStreak(),
  };

  // Wrapper functions for better API
  const createEntry = (entry: { content: string; mood_after?: number; mood_before?: number; title?: string; tags?: string[] }, options?: { onSuccess?: (data: any) => void; onError?: (error: any) => void }) => {
    createEntryMutation.mutate(entry, options);
  };

  const deleteEntry = (entryId: string) => {
    deleteEntryMutation.mutate(entryId);
  };

  const updateEntry = (update: { id: string; content?: string; title?: string; mood_after?: number; mood_before?: number; tags?: string[] }) => {
    updateEntryMutation.mutate(update);
  };

  return {
    entries: entries || [],
    stats,
    isLoading,
    error,
    createEntry,
    deleteEntry,
    updateEntry,
    isCreating: createEntryMutation.isPending,
    isDeleting: deleteEntryMutation.isPending,
    isUpdating: updateEntryMutation.isPending,
  };
};
