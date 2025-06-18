
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useJournalRecovery = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Get deleted entries
  const { data: deletedEntries, isLoading } = useQuery({
    queryKey: ['deleted-journal-entries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .not('deleted_at', 'is', null)
        .order('deleted_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Restore entry
  const restoreEntry = useMutation({
    mutationFn: async (entryId: string) => {
      const { error } = await supabase
        .from('journal_entries')
        .update({ deleted_at: null })
        .eq('id', entryId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deleted-journal-entries'] });
      queryClient.invalidateQueries({ queryKey: ['journal-entries'] });
      toast({
        title: "Entry Restored",
        description: "Your journal entry has been restored successfully.",
      });
    },
    onError: (error) => {
      console.error('Restore error:', error);
      toast({
        title: "Restore Failed",
        description: "There was an error restoring your entry. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Permanently delete entry
  const permanentlyDelete = useMutation({
    mutationFn: async (entryId: string) => {
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', entryId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deleted-journal-entries'] });
      toast({
        title: "Entry Permanently Deleted",
        description: "The journal entry has been permanently removed.",
      });
    },
    onError: (error) => {
      console.error('Permanent delete error:', error);
      toast({
        title: "Delete Failed",
        description: "There was an error deleting the entry. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    deletedEntries,
    isLoading,
    restoreEntry: restoreEntry.mutate,
    permanentlyDelete: permanentlyDelete.mutate,
    isRestoring: restoreEntry.isPending,
    isDeleting: permanentlyDelete.isPending,
  };
};
