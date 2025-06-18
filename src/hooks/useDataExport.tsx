
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type ExportType = 'full' | 'journal_only' | 'habits_only';
type ExportFormat = 'json' | 'csv';

export const useDataExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const exportData = async (exportType: ExportType = 'full', format: ExportFormat = 'json') => {
    try {
      setIsExporting(true);
      
      const { data, error } = await supabase.functions.invoke('export-user-data', {
        body: { export_type: exportType, format }
      });

      if (error) {
        throw error;
      }

      // Create download link
      const blob = new Blob([data], { 
        type: format === 'csv' ? 'text/csv' : 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `lumatori-data-${exportType}-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: `Your ${exportType} data has been downloaded as ${format.toUpperCase()}.`,
      });

    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting your data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return {
    exportData,
    isExporting,
  };
};
