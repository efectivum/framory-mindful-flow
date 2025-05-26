import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Clock, MessageSquare, Globe, Filter, Calendar, Timeline } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Activity, ActivityType, ActivitySource, ACTIVITY_TYPE_LABELS, ACTIVITY_SOURCE_LABELS } from '@/lib/activityTypes';
import { ActivityTimeline } from './ActivityTimeline';

interface ActivityLogProps {
  limit?: number;
  showFilters?: boolean;
  className?: string;
}

export const ActivityLog = ({ limit, showFilters = true, className }: ActivityLogProps) => {
  const { user } = useAuth();
  const [typeFilter, setTypeFilter] = useState<ActivityType | 'all'>('all');
  const [sourceFilter, setSourceFilter] = useState<ActivitySource | 'all'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'timeline'>('list');

  const { data: activities, isLoading } = useQuery({
    queryKey: ['activities', user?.id, typeFilter, sourceFilter, limit],
    queryFn: async () => {
      if (!user?.id) return [];
      
      let query = supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (typeFilter !== 'all') {
        query = query.eq('type', typeFilter);
      }

      if (sourceFilter !== 'all') {
        query = query.eq('source', sourceFilter);
      }

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  const getSourceIcon = (source: ActivitySource) => {
    switch (source) {
      case 'whatsapp':
        return <MessageSquare className="w-3 h-3" />;
      case 'website':
        return <Globe className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  const getTypeColor = (type: ActivityType) => {
    switch (type) {
      case 'journal':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'goal':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'habit':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'mood':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'reflection':
        return 'bg-teal-500/20 text-teal-300 border-teal-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  if (viewMode === 'timeline') {
    return <ActivityTimeline />;
  }

  if (isLoading) {
    return (
      <Card className={`bg-gray-800/50 border-gray-700 ${className}`}>
        <CardContent className="p-6">
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-gray-800/50 border-gray-700 ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Activity Log
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === 'list' ? 'timeline' : 'list')}
              className="bg-gray-700 border-gray-600"
            >
              {viewMode === 'list' ? (
                <>
                  <Timeline className="w-4 h-4 mr-2" />
                  Timeline
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4 mr-2" />
                  List
                </>
              )}
            </Button>
            {showFilters && (
              <>
                <Filter className="w-4 h-4 text-gray-400" />
                <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as ActivityType | 'all')}>
                  <SelectTrigger className="w-32 bg-gray-700 border-gray-600">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {Object.entries(ACTIVITY_TYPE_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sourceFilter} onValueChange={(value) => setSourceFilter(value as ActivitySource | 'all')}>
                  <SelectTrigger className="w-32 bg-gray-700 border-gray-600">
                    <SelectValue placeholder="Source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    {Object.entries(ACTIVITY_SOURCE_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {activities && activities.length > 0 ? (
          <div className="space-y-3">
            {activities.map((activity) => (
              <div key={activity.id} className="p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge className={`text-xs ${getTypeColor(activity.type as ActivityType)}`}>
                      {ACTIVITY_TYPE_LABELS[activity.type as ActivityType]}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      {getSourceIcon(activity.source as ActivitySource)}
                      <span>{ACTIVITY_SOURCE_LABELS[activity.source as ActivitySource]}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    {new Date(activity.created_at).toLocaleDateString()}
                  </div>
                </div>
                <h4 className="font-medium text-white text-sm mb-1">{activity.title}</h4>
                <p className="text-gray-300 text-sm line-clamp-2">{activity.content}</p>
                {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {Object.entries(activity.metadata).map(([key, value]) => (
                      <span key={key} className="text-xs bg-gray-700/50 text-gray-400 px-2 py-1 rounded">
                        {key}: {String(value)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm text-center py-4">
            No activities found. Start tracking your progress!
          </p>
        )}
      </CardContent>
    </Card>
  );
};
