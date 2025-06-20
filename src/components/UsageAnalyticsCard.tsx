
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUsageAnalytics } from '@/hooks/useUsageAnalytics';
import { BarChart3, TrendingUp, Clock, Zap } from 'lucide-react';
import { format } from 'date-fns';

export const UsageAnalyticsCard = () => {
  const { usageData, isLoading } = useUsageAnalytics();

  if (isLoading) {
    return (
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Usage Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="h-20 bg-gray-700 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!usageData) return null;

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Usage Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid grid-cols-2 w-full bg-gray-700">
            <TabsTrigger value="overview" className="text-gray-300">Overview</TabsTrigger>
            <TabsTrigger value="features" className="text-gray-300">Features</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-400">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm">Total Usage</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {usageData.totalFeatureUsage}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-400">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">Most Used</span>
                </div>
                <div className="text-sm font-medium text-white truncate">
                  {usageData.mostUsedFeature || 'No usage yet'}
                </div>
              </div>
            </div>

            {usageData.dailyUsage.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-300">Daily Activity</h4>
                <div className="space-y-1">
                  {usageData.dailyUsage.slice(-7).map((day) => (
                    <div key={day.date} className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        {format(new Date(day.date), 'MMM dd')}
                      </span>
                      <span className="text-xs text-white">{day.usage}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="features" className="space-y-4">
            <div className="space-y-3">
              {usageData.featureBreakdown.map((feature) => (
                <div key={feature.featureName} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white">
                        {feature.featureName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                      <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                        {feature.category}
                      </Badge>
                    </div>
                    <span className="text-sm text-gray-400">{feature.usageCount}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>Last used: {format(new Date(feature.lastUsed), 'MMM dd, HH:mm')}</span>
                  </div>
                </div>
              ))}
              
              {usageData.featureBreakdown.length === 0 && (
                <div className="text-center text-gray-400 py-4">
                  <p>No feature usage data available</p>
                  <p className="text-xs mt-1">Start using premium features to see analytics</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
