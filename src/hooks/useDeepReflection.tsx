
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { JournalEntry } from '@/hooks/useJournalEntries';

export interface DeepReflection {
  id: string;
  entry_id: string;
  user_id: string;
  reflection_content: string;
  probing_question: string;
  created_at: string;
}

export const useDeepReflection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const getDeepReflection = (entryId: string) => {
    return useQuery({
      queryKey: ['deep-reflection', entryId],
      queryFn: async () => {
        if (!user) return null;
        
        const { data, error } = await supabase
          .from('deep_reflections')
          .select('*')
          .eq('entry_id', entryId)
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
        return data as DeepReflection | null;
      },
      enabled: !!user && !!entryId,
    });
  };

  const generateDeepReflection = useMutation({
    mutationFn: async (entry: JournalEntry) => {
      if (!user) throw new Error('User not authenticated');

      // Get user preferences and recent entries for context
      const [preferencesResult, recentEntriesResult] = await Promise.all([
        supabase.from('user_preferences').select('*').eq('user_id', user.id).single(),
        supabase.from('journal_entries')
          .select('content, created_at')
          .eq('user_id', user.id)
          .neq('id', entry.id)
          .order('created_at', { ascending: false })
          .limit(3)
      ]);

      // Generate reflection using edge function
      const { data: reflectionData, error: functionError } = await supabase.functions.invoke('generate-deep-reflection', {
        body: { 
          entryContent: entry.content,
          userPreferences: preferencesResult.data,
          recentEntries: recentEntriesResult.data || []
        }
      });

      if (functionError) throw functionError;

      // Store the reflection in database
      const { data, error } = await supabase
        .from('deep_reflections')
        .insert([{
          entry_id: entry.id,
          user_id: user.id,
          reflection_content: reflectionData.reflection_content,
          probing_question: reflectionData.probing_question,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, entry) => {
      queryClient.invalidateQueries({ queryKey: ['deep-reflection', entry.id] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to generate reflection: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  return {
    getDeepReflection,
    generateDeepReflection: generateDeepReflection.mutate,
    isGenerating: generateDeepReflection.isPending,
  };
};
