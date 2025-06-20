
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SampleTemplate {
  id: string;
  type: 'journal' | 'habit' | 'goal';
  title: string;
  content: string;
  description: string | null;
  category: string | null;
  sort_order: number | null;
}

export const useSampleTemplates = (type?: string) => {
  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['sample_templates', type],
    queryFn: async () => {
      let query = supabase
        .from('sample_templates')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (type) {
        query = query.eq('type', type);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as SampleTemplate[];
    }
  });

  const getTemplatesByCategory = (category: string) => {
    return templates.filter(template => template.category === category);
  };

  const journalTemplates = templates.filter(t => t.type === 'journal');
  const habitTemplates = templates.filter(t => t.type === 'habit');

  return {
    templates,
    journalTemplates,
    habitTemplates,
    isLoading,
    getTemplatesByCategory
  };
};
