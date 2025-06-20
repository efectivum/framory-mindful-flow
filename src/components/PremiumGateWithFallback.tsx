
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/hooks/useSubscription';
import { Crown, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

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
  const { isPremium, isBeta, createCheckout, isLoading, refreshSubscription } = useSubscription();
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshSubscription();
    } finally {
      setIsRefreshing(false);
    }
  };

  // Allow access for both premium and beta users
  if (isPremium || isBeta) {
    return <>{children}</>;
  }

  // Show loading for a reasonable time
  if (isLoading) {
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
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-purple-400 text-purple-300">
              Premium
            </Badge>
            <Button
              onClick={handleRefresh}
              variant="ghost"
              size="sm"
              disabled={isRefreshing}
              className="text-gray-400 hover:text-white"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
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
          
          <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Already subscribed? Try refreshing your status above
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
