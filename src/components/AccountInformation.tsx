
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { CopyableText } from '@/components/CopyableText';
import { User } from 'lucide-react';

export const AccountInformation = () => {
  const { user } = useAuth();

  return (
    <Card className="card-serene border-0 shadow-none">
      <CardHeader className="pb-4">
        <CardTitle className="text-foreground flex items-center gap-2 text-base">
          <User className="w-5 h-5 text-primary" />
          Account Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-foreground font-medium text-sm mb-2">
            Your Email
          </label>
          <CopyableText text={user?.email || 'No email available'} />
        </div>
        
        <div>
          <label className="block text-foreground font-medium text-sm mb-2">
            User ID
          </label>
          <CopyableText text={user?.id || 'No ID available'} />
        </div>
        
        <div>
          <label className="block text-foreground font-medium text-sm mb-2">
            Current URL
          </label>
          <CopyableText text={window.location.href} />
        </div>
      </CardContent>
    </Card>
  );
};
