
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { CopyableText } from '@/components/CopyableText';

export const AccountInformation = () => {
  const { user } = useAuth();

  return (
    <Card className="mobile-card">
      <CardHeader>
        <CardTitle className="mobile-text-primary">Account Information</CardTitle>
      </CardHeader>
      <CardContent className="mobile-space-y-4">
        <div>
          <label className="mobile-block mobile-text-primary font-medium mb-2">
            Your Email
          </label>
          <CopyableText text={user?.email || 'No email available'} />
        </div>
        
        <div>
          <label className="mobile-block mobile-text-primary font-medium mb-2">
            User ID
          </label>
          <CopyableText text={user?.id || 'No ID available'} />
        </div>
        
        <div>
          <label className="mobile-block mobile-text-primary font-medium mb-2">
            Current URL
          </label>
          <CopyableText text={window.location.href} />
        </div>
      </CardContent>
    </Card>
  );
};
