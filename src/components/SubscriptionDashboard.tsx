
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useSubscription } from '@/hooks/useSubscription';
import { useUsageAnalytics } from '@/hooks/useUsageAnalytics';
import { UsageAnalyticsCard } from '@/components/UsageAnalyticsCard';
import { Crown, Calendar, CreditCard, TrendingUp, Settings, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

export const SubscriptionDashboard = () => {
  const { subscriptionTier, isPremium, subscriptionEnd, createCheckout, openCustomerPortal } = useSubscription();
  const { usageData } = useUsageAnalytics();

  const handleManageBilling = async () => {
    try {
      await openCustomerPortal();
    } catch (error) {
      console.error('Failed to open billing portal:', error);
    }
  };

  const subscriptionEndDate = subscriptionEnd 
    ? new Date(subscriptionEnd)
    : null;

  const daysUntilRenewal = subscriptionEndDate 
    ? Math.ceil((subscriptionEndDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="space-y-6">
      {/* Subscription Status Card */}
      <Card className="bg-gradient-to-br from-purple-500/10 to-blue-600/10 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-400" />
            Subscription Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge 
                  variant={isPremium ? "default" : "outline"} 
                  className={isPremium ? "bg-purple-600 text-white" : "border-gray-600 text-gray-300"}
                >
                  {isPremium ? 'Premium' : 'Free'}
                </Badge>
                {isPremium && subscriptionTier && (
                  <Badge variant="outline" className="border-yellow-400 text-yellow-300">
                    {subscriptionTier.charAt(0).toUpperCase() + subscriptionTier.slice(1)}
                  </Badge>
                )}
              </div>
              
              {subscriptionEndDate && (
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {daysUntilRenewal && daysUntilRenewal > 0 
                      ? `Renews in ${daysUntilRenewal} days (${format(subscriptionEndDate, 'MMM dd, yyyy')})`
                      : `Expires ${format(subscriptionEndDate, 'MMM dd, yyyy')}`
                    }
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              {isPremium ? (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleManageBilling}
                  className="border-purple-400 text-purple-300 hover:bg-purple-400/10"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Manage Billing
                </Button>
              ) : (
                <Button 
                  onClick={createCheckout}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Premium
                </Button>
              )}
            </div>
          </div>

          {/* Usage Overview */}
          {isPremium && usageData && (
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
      {isPremium && <UsageAnalyticsCard />}

      {/* Feature Comparison */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Features & Limits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          {!isPremium && (
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
