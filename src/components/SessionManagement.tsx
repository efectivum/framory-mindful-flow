
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Monitor, Smartphone, Shield, AlertTriangle } from 'lucide-react';

export const SessionManagement = () => {
  const [loading, setLoading] = useState(false);
  const { signOutFromAllDevices, user } = useAuth();
  const { toast } = useToast();

  const handleSignOutAllDevices = async () => {
    setLoading(true);
    try {
      await signOutFromAllDevices();
      toast({
        title: "Signed out from all devices",
        description: "You have been signed out from all devices for security.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to sign out from all devices. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Mock session data - in a real app, this would come from your backend
  const currentSessions = [
    {
      id: '1',
      device: 'Current Device',
      type: 'web',
      location: 'Current Location',
      lastActive: 'Now',
      current: true,
    },
  ];

  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Session Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">Account Security</div>
              <div className="text-gray-400 text-sm">
                Last sign-in: {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Unknown'}
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-900/20 text-green-300 border-green-700">
              Secure
            </Badge>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6">
          <h3 className="text-white font-medium mb-4">Active Sessions</h3>
          <div className="space-y-3">
            {currentSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                <div className="flex items-center gap-3">
                  {session.type === 'web' ? (
                    <Monitor className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Smartphone className="w-4 h-4 text-gray-400" />
                  )}
                  <div>
                    <div className="text-white text-sm font-medium">{session.device}</div>
                    <div className="text-gray-400 text-xs">
                      {session.location} • {session.lastActive}
                    </div>
                  </div>
                </div>
                {session.current && (
                  <Badge variant="outline" className="text-xs border-blue-500 text-blue-300">
                    Current
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6">
          <div className="bg-orange-900/20 border border-orange-700/50 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-orange-300 font-medium mb-1">Security Action</h4>
                <p className="text-orange-300 text-sm">
                  If you suspect unauthorized access to your account, sign out from all devices immediately.
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleSignOutAllDevices}
            disabled={loading}
            variant="destructive"
            className="w-full"
          >
            {loading ? 'Signing out...' : 'Sign Out From All Devices'}
          </Button>
        </div>

        <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
          <h4 className="text-blue-300 font-medium mb-2">Security Tips</h4>
          <ul className="text-blue-300 text-sm space-y-1">
            <li>• Always sign out from shared or public devices</li>
            <li>• Use a strong, unique password for your account</li>
            <li>• Review your active sessions regularly</li>
            <li>• Report any suspicious activity immediately</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
