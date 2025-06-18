
import { useState } from 'react';
import { Download, FileText, Database, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useDataExport } from '@/hooks/useDataExport';

export const DataExportDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [exportType, setExportType] = useState<'full' | 'journal_only' | 'habits_only'>('full');
  const [format, setFormat] = useState<'json' | 'csv'>('json');
  const { exportData, isExporting } = useDataExport();

  const handleExport = async () => {
    await exportData(exportType, format);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Download className="w-4 h-4 mr-2" />
          Export My Data
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Export Your Data</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <Label className="text-white font-medium mb-3 block">What to export:</Label>
            <RadioGroup value={exportType} onValueChange={(value: any) => setExportType(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="full" id="full" />
                <Label htmlFor="full" className="text-gray-300 flex items-center">
                  <Database className="w-4 h-4 mr-2" />
                  Everything (Journal, Habits, Preferences)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="journal_only" id="journal" />
                <Label htmlFor="journal" className="text-gray-300 flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Journal Entries Only
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="habits_only" id="habits" />
                <Label htmlFor="habits" className="text-gray-300 flex items-center">
                  <Activity className="w-4 h-4 mr-2" />
                  Habits & Tracking Only
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-white font-medium mb-3 block">Format:</Label>
            <RadioGroup value={format} onValueChange={(value: any) => setFormat(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="json" id="json" />
                <Label htmlFor="json" className="text-gray-300">
                  JSON (structured data, best for backups)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="csv" id="csv" />
                <Label htmlFor="csv" className="text-gray-300">
                  CSV (spreadsheet format, best for analysis)
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
            <p className="text-blue-300 text-sm">
              Your exported data will include all your personal information. 
              Keep the file secure and only share with trusted parties.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleExport}
              disabled={isExporting}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isExporting ? (
                "Exporting..."
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </>
              )}
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
