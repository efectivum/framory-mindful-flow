
import { Shield, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { DataExportDialog } from './DataExportDialog';
import { AccountDeletionDialog } from './AccountDeletionDialog';
import { RecoveryDialog } from './RecoveryDialog';

export const PrivacySettings = () => {
  return (
    <Card className="card-serene border-0 shadow-none">
      <CardHeader className="pb-4">
        <CardTitle className="text-foreground flex items-center gap-2 text-base">
          <Shield className="w-5 h-5 text-success" />
          Privacy & Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-foreground font-medium text-sm">Data Analytics</div>
              <div className="text-muted-foreground text-xs">Help improve Lumatori</div>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-foreground font-medium text-sm">AI Insights</div>
              <div className="text-muted-foreground text-xs">Allow AI analysis</div>
            </div>
            <Switch defaultChecked />
          </div>
        </div>

        <div className="border-t border-border pt-5 space-y-3">
          <h3 className="text-foreground font-medium text-sm flex items-center gap-2">
            <Download className="w-4 h-4" />
            Data Management
          </h3>
          
          <div className="space-y-2">
            <DataExportDialog />
            <RecoveryDialog />
          </div>

          <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
            <h4 className="text-primary font-medium text-sm mb-2">Your Data Rights</h4>
            <ul className="text-muted-foreground text-xs space-y-1">
              <li>• Export data in JSON or CSV</li>
              <li>• Restore deleted entries</li>
              <li>• GDPR compliant</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-5">
          <h3 className="text-destructive font-medium text-sm mb-3">Danger Zone</h3>
          <AccountDeletionDialog />
        </div>
      </CardContent>
    </Card>
  );
};
