
import { Shield, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

export const PrivacySettings = () => {
  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Privacy & Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white font-medium">Data Analytics</div>
            <div className="text-gray-400 text-sm">Help improve Framory with usage data</div>
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
        <div className="pt-4 border-t border-gray-700">
          <Button variant="outline" className="w-full mb-2">
            <Download className="w-4 h-4 mr-2" />
            Export My Data
          </Button>
          <Button variant="destructive" className="w-full">
            Delete Account
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
