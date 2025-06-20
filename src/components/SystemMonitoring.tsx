
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useErrorTracking } from '@/hooks/useErrorTracking';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { AlertTriangle, CheckCircle, Clock, Trash2 } from 'lucide-react';

export const SystemMonitoring: React.FC = () => {
  const { errors, stats, markErrorResolved, clearErrors } = useErrorTracking();
  const { isOnline, isSlowConnection } = useNetworkStatus();
  const [performanceMetrics, setPerformanceMetrics] = useState({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
  });

  useEffect(() => {
    // Collect performance metrics
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      setPerformanceMetrics({
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        renderTime: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        memoryUsage: (performance as any).memory?.usedJSHeapSize || 0,
      });
    }
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const formatMemory = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  };

  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isOnline ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-500" />
              )}
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Connection:</span>
                <Badge variant={isOnline ? "default" : "destructive"}>
                  {isOnline ? 'Online' : 'Offline'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Speed:</span>
                <Badge variant={isSlowConnection ? "secondary" : "default"}>
                  {isSlowConnection ? 'Slow' : 'Good'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Error Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Errors:</span>
                <span className="font-semibold">{stats.totalErrors}</span>
              </div>
              <div className="flex justify-between">
                <span>Critical:</span>
                <span className="font-semibold text-red-500">{stats.criticalErrors}</span>
              </div>
              <div className="flex justify-between">
                <span>Active:</span>
                <span className="font-semibold">{errors.filter(e => !e.resolved).length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Load Time:</span>
                <span className="font-semibold">{performanceMetrics.loadTime.toFixed(0)}ms</span>
              </div>
              <div className="flex justify-between">
                <span>Render Time:</span>
                <span className="font-semibold">{performanceMetrics.renderTime.toFixed(0)}ms</span>
              </div>
              <div className="flex justify-between">
                <span>Memory:</span>
                <span className="font-semibold">{formatMemory(performanceMetrics.memoryUsage)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Errors */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Errors</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={clearErrors}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Clear All
          </Button>
        </CardHeader>
        <CardContent>
          {errors.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
              <p>No errors detected. System running smoothly!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {errors.slice(0, 10).map((error) => (
                <div
                  key={error.id}
                  className={`p-3 rounded-lg border ${
                    error.resolved ? 'bg-gray-50 opacity-60' : 'bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-2 h-2 rounded-full ${getSeverityColor(error.severity)}`} />
                        <Badge variant="outline" className="text-xs">
                          {error.severity}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(error.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm font-medium mb-1">{error.message}</p>
                      <p className="text-xs text-gray-500">{error.url}</p>
                      {error.context && (
                        <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-x-auto">
                          {JSON.stringify(error.context, null, 2)}
                        </pre>
                      )}
                    </div>
                    {!error.resolved && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => markErrorResolved(error.id)}
                        className="ml-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
