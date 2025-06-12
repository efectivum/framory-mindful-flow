
import { Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const AdditionalSettings = () => {
  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Additional Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-white font-medium mb-2">Timezone</label>
          <select className="w-full bg-gray-700 border-gray-600 text-white rounded px-3 py-2">
            <option>UTC-8 (Pacific Time)</option>
            <option>UTC-5 (Eastern Time)</option>
            <option>UTC+0 (GMT)</option>
            <option>UTC+1 (Central European Time)</option>
          </select>
        </div>
        <div>
          <label className="block text-white font-medium mb-2">Theme</label>
          <select className="w-full bg-gray-700 border-gray-600 text-white rounded px-3 py-2">
            <option>Dark (Current)</option>
            <option>Light</option>
            <option>Auto</option>
          </select>
        </div>
      </CardContent>
    </Card>
  );
};
