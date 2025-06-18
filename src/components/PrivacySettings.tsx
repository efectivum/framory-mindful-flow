
import { Shield, Download, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { DataExportDialog } from './DataExportDialog';
import { AccountDeletionDialog } from './AccountDeletionDialog';
import { RecoveryDialog } from './RecoveryDialog';

export const PrivacySettings = () => {
  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Privacy & Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">Data Analytics</div>
              <div className="text-gray-400 text-sm">Help improve Lumatori with usage data</div>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">AI Insights</div>
              <div className="text-gray-400 text-sm">Allow AI analysis of your entries</div>
            </div>
            <Switch defaultChecked />
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 space-y-4">
          <h3 className="text-white font-medium flex items-center gap-2">
            <Download className="w-4 h-4" />
            Data Management
          </h3>
          
          <div className="space-y-3">
            <DataExportDialog />
            <RecoveryDialog />
          </div>

          <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
            <h4 className="text-blue-300 font-medium mb-2">Your Data Rights</h4>
            <ul className="text-blue-300 text-sm space-y-1">
              <li>• Export your data at any time in JSON or CSV format</li>
              <li>• Restore accidentally deleted journal entries</li>
              <li>• Full control over your account and data</li>
              <li>• GDPR compliant data handling</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6">
          <h3 className="text-red-400 font-medium mb-3">Danger Zone</h3>
          <AccountDeletionDialog />
        </div>
      </CardContent>
    </Card>
  );
};
