
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Send, Calendar, Users } from 'lucide-react';

export const NotificationQuickActions: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Send className="w-6 h-6 text-blue-400" />
            <h3 className="text-white font-semibold">Send Notification</h3>
          </div>
          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            Send Now
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-6 h-6 text-green-400" />
            <h3 className="text-white font-semibold">Schedule Campaign</h3>
          </div>
          <Button variant="outline" className="w-full">
            Schedule
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-purple-400" />
            <h3 className="text-white font-semibold">Bulk Email</h3>
          </div>
          <Button variant="outline" className="w-full">
            Compose
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
