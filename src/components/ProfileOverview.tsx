
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';

export const ProfileOverview = () => {
  const { user } = useAuth();

  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <CardHeader className="text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
          <User className="w-12 h-12 text-white" />
        </div>
        <CardTitle className="text-white">{user?.email?.split('@')[0] || 'User'}</CardTitle>
        <p className="text-gray-400 text-sm">{user?.email}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">47</div>
          <div className="text-gray-400 text-sm">Days Active</div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-white">127</div>
            <div className="text-gray-400 text-xs">Journal Entries</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-white">8</div>
            <div className="text-gray-400 text-xs">Active Goals</div>
          </div>
        </div>
        <Button variant="outline" className="w-full">
          Edit Profile
        </Button>
      </CardContent>
    </Card>
  );
};
