
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/hooks/useSubscription';
import { useUsageAnalytics } from '@/hooks/useUsageAnalytics';
import { UsageAnalyticsCard } from '@/components/UsageAnalyticsCard';
import { Crown, Calendar, Settings, Zap, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

export const SubscriptionDashboard = () => {
  const { subscriptionTier, isPremium, isBeta, subscriptionEnd, createCheckout, openCustomerPortal, refreshSubscription } = useSubscription();
  const { usageData } = useUsageAnalytics();
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleManageBilling = async () => {
    try {
      await openCustomerPortal();
    } catch (error) {
      console.error('Failed to open billing portal:', error);
    }
  };

  const handleRefreshStatus = async () => {
    setIsRefreshing(true);
    try {
      await refreshSubscription();
    } finally {
      setIsRefreshing(false);
    }
  };

  const subscriptionEndDate = subscriptionEnd 
    ? new Date(subscriptionEnd)
    : null;

  const daysUntilRenewal = subscriptionEndDate 
    ? Math.ceil((subscriptionEndDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  const getStatusBadge = () => {
    if (isBeta) {
      return (
        <Badge variant="outline" className="border-blue-400 text-blue-300 bg-blue-400/10">
          <Zap className="w-4 h-4 mr-1" />
          Beta
        </Badge>
      );
    }
    
    if (isPremium) {
      return (
        <Badge variant="default" className="bg-purple-600 text-white">
          <Crown className="w-4 h-4 mr-1" />
          Premium
        </Badge>
      );
    }
    
    return (
      <Badge variant="outline" className="border-gray-600 text-gray-300">
        Free
      </Badge>
    );
  };

  const getStatusDescription = () => {
    if (isBeta) {
      return "You're part of our exclusive beta program with full premium access!";
    }
    
    if (isPremium && subscriptionEndDate) {
      return daysUntilRenewal && daysUntilRenewal > 0 
        ? `Renews in ${daysUntilRenewal} days (${format(subscriptionEndDate, 'MMM dd, yyyy')})`
        : `Expires ${format(subscriptionEndDate, 'MMM dd, yyyy')}`;
    }
    
    return "Upgrade to unlock premium features";
  };

  return (
    <div className="space-y-6">
      {/* Subscription Status Card */}
      <Card className={`bg-gradient-to-br ${isBeta ? 'from-blue-500/10 to-cyan-600/10 border-blue-500/30' : 'from-purple-500/10 to-blue-600/10 border-purple-500/30'}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              {isBeta ? <Zap className="w-5 h-5 text-blue-400" /> : <Crown className="w-5 h-5 text-yellow-400" />}
              Subscription Status
            </CardTitle>
            <Button
              onClick={handleRefreshStatus}
              variant="ghost"
              size="sm"
              disabled={isRefreshing}
              className="text-gray-400 hover:text-white"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {getStatusBadge()}
                {subscriptionTier && subscriptionTier !== 'free' && (
                  <Badge variant="outline" className="border-yellow-400 text-yellow-300">
                    {subscriptionTier.charAt(0).toUpperCase() + subscriptionTier.slice(1)}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Calendar className="w-4 h-4" />
                <span>{getStatusDescription()}</span>
              </div>
              
              {isBeta && (
                <div className="text-xs text-blue-300 mt-2">
                  🎉 Enjoy all premium features while in beta! You can upgrade to premium anytime.
                </div>
              )}
            </div>

            <div className="flex gap-2">
              {isPremium && !isBeta ? (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleManageBilling}
                  className="border-purple-400 text-purple-300 hover:bg-purple-400/10"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Manage Billing
                </Button>
              ) : !isBeta ? (
                <Button 
                  onClick={createCheckout}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Premium
                </Button>
              ) : (
                <Button 
                  onClick={createCheckout}
                  variant="outline"
                  size="sm"
                  className="border-blue-400 text-blue-300 hover:bg-blue-400/10"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Premium
                </Button>
              )}
            </div>
          </div>

          {/* Usage Overview */}
          {(isPremium || isBeta) && usageData && (
            <div className="border-t border-gray-700 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm text-gray-400">This Month's Usage</div>
                  <div className="text-2xl font-bold text-white">
                    {usageData.totalFeatureUsage}
                  </div>
                  <div className="text-xs text-gray-500">premium features used</div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm text-gray-400">Most Active Feature</div>
                  <div className="text-sm font-medium text-white">
                    {usageData.mostUsedFeature || 'None yet'}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-green-400">
                    <TrendingUp className="w-3 h-3" />
                    <span>Growing usage</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage Analytics */}
      {(isPremium || isBeta) && <UsageAnalyticsCard />}

      {/* Feature Comparison */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Features & Limits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-300">Free Plan</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Journal Entries</span>
                  <span className="text-gray-300">50/month</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">AI Insights</span>
                  <span className="text-gray-300">5/month</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Habit Tracking</span>
                  <span className="text-gray-300">3 habits</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Data Export</span>
                  <span className="text-gray-300">None</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-blue-300 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Beta Plan - Free Access
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Journal Entries</span>
                  <span className="text-green-400">Unlimited</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">AI Insights</span>
                  <span className="text-green-400">Unlimited</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Habit Tracking</span>
                  <span className="text-green-400">Unlimited</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Data Export</span>
                  <span className="text-green-400">10/month</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Voice Transcription</span>
                  <span className="text-green-400">Unlimited</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Advanced Analytics</span>
                  <span className="text-green-400">Included</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-purple-300">Premium Plan - $9.99/month</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Journal Entries</span>
                  <span className="text-green-400">Unlimited</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">AI Insights</span>
                  <span className="text-green-400">Unlimited</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Habit Tracking</span>
                  <span className="text-green-400">Unlimited</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Data Export</span>
                  <span className="text-green-400">10/month</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Voice Transcription</span>
                  <span className="text-green-400">Unlimited</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Advanced Analytics</span>
                  <span className="text-green-400">Included</span>
                </div>
              </div>
            </div>
          </div>

          {!isPremium && !isBeta && (
            <div className="mt-6 pt-4 border-t border-gray-700">
              <Button 
                onClick={createCheckout}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to Premium - $9.99/month
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
