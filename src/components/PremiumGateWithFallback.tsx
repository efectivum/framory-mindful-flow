
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/hooks/useSubscription';
import { Crown, Sparkles, AlertCircle } from 'lucide-react';

interface PremiumGateWithFallbackProps {
  feature: string;
  description: string;
  children?: React.ReactNode;
  showPreview?: boolean;
  className?: string;
}

export const PremiumGateWithFallback: React.FC<PremiumGateWithFallbackProps> = ({
  feature,
  description,
  children,
  showPreview = false,
  className = ""
}) => {
  const { isPremium, isBeta, createCheckout, isLoading } = useSubscription();
  const [hasTimedOut, setHasTimedOut] = React.useState(false);
  const [allowAccess, setAllowAccess] = React.useState(false);

  // Timeout after 10 seconds to prevent infinite loading
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setHasTimedOut(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  // If loading has timed out, allow access with warning
  if (hasTimedOut && isLoading) {
    if (allowAccess) {
      return <>{children}</>;
    }

    return (
      <Card className={`bg-gradient-to-br from-orange-500/10 to-red-600/10 border-orange-500/30 ${className}`}>
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-400" />
            Connection Issue
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-3">
            <p className="text-gray-300 text-sm">
              We're having trouble verifying your subscription status. You can continue using the feature, but some functionality may be limited.
            </p>
            
            <div className="flex gap-2">
              <Button 
                onClick={() => setAllowAccess(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
              >
                Continue Anyway
              </Button>
              <Button 
                onClick={() => window.location.reload()}
                variant="outline"
                className="border-orange-400 text-orange-300 hover:bg-orange-400/10"
              >
                Retry
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Allow access for both premium and beta users
  if (isPremium || isBeta) {
    return <>{children}</>;
  }

  // Show loading only for a reasonable time
  if (isLoading && !hasTimedOut) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Checking subscription status...</div>
      </div>
    );
  }

  return (
    <Card className={`bg-gradient-to-br from-purple-500/10 to-blue-600/10 border-purple-500/30 ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-400" />
            {feature}
          </CardTitle>
          <Badge variant="outline" className="border-purple-400 text-purple-300">
            Premium
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showPreview && (
          <div className="relative">
            <div className="blur-sm opacity-50">
              {children}
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Crown className="w-8 h-8 text-purple-400" />
            </div>
          </div>
        )}
        
        <div className="text-center space-y-3">
          <p className="text-gray-300 text-sm">{description}</p>
          
          <Button 
            onClick={createCheckout}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white w-full"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Upgrade to Premium - $9.99/month
          </Button>
          
          <div className="text-xs text-gray-400">
            ✨ AI-powered insights • 📊 Advanced analytics • 🎯 Unlimited habits
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
