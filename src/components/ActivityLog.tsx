
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Clock, MessageSquare, Globe, Filter, Calendar, History } from 'lucide-react';
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
        return 'mobile-bg-secondary mobile-text-secondary mobile-border';
    }
  };

  if (viewMode === 'timeline') {
    return <ActivityTimeline />;
  }

  if (isLoading) {
    return (
      <Card className={`mobile-card ${className}`}>
        <CardContent className="p-6">
          <div className="mobile-space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 mobile-bg-secondary rounded w-3/4 mb-2"></div>
                <div className="h-3 mobile-bg-secondary rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`mobile-card ${className}`}>
      <CardHeader>
        <div className="mobile-flex mobile-flex-between">
          <CardTitle className="mobile-text-primary mobile-flex mobile-flex-center gap-2">
            <Clock className="w-5 h-5" />
            Activity Log
          </CardTitle>
          <div className="mobile-flex mobile-flex-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === 'list' ? 'timeline' : 'list')}
              className="mobile-button"
            >
              {viewMode === 'list' ? (
                <>
                  <History className="w-4 h-4 mr-2" />
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
                <Filter className="w-4 h-4 mobile-text-secondary" />
                <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as ActivityType | 'all')}>
                  <SelectTrigger className="w-32 mobile-bg-secondary mobile-border">
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
                  <SelectTrigger className="w-32 mobile-bg-secondary mobile-border">
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
          <div className="mobile-space-y-3">
            {activities.map((activity) => (
              <div key={activity.id} className="mobile-card mobile-card-compact">
                <div className="mobile-flex mobile-flex-between mb-2">
                  <div className="mobile-flex mobile-flex-center gap-2">
                    <Badge className={`mobile-badge ${getTypeColor(activity.type as ActivityType)}`}>
                      {ACTIVITY_TYPE_LABELS[activity.type as ActivityType]}
                    </Badge>
                    <div className="mobile-flex mobile-flex-center gap-1 mobile-text-caption mobile-text-secondary">
                      {getSourceIcon(activity.source as ActivitySource)}
                      <span>{ACTIVITY_SOURCE_LABELS[activity.source as ActivitySource]}</span>
                    </div>
                  </div>
                  <div className="mobile-flex mobile-flex-center gap-1 mobile-text-caption mobile-text-secondary">
                    <Calendar className="w-3 h-3" />
                    {new Date(activity.created_at).toLocaleDateString()}
                  </div>
                </div>
                <h4 className="font-medium mobile-text-primary mobile-text-body mb-1">{activity.title}</h4>
                <p className="mobile-text-secondary mobile-text-body line-clamp-2">{activity.content}</p>
                {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                  <div className="mt-2 mobile-flex mobile-flex-wrap gap-1">
                    {Object.entries(activity.metadata).map(([key, value]) => (
                      <span key={key} className="mobile-badge mobile-bg-secondary mobile-text-secondary">
                        {key}: {String(value)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="mobile-text-secondary mobile-text-body text-center py-4">
            No activities found. Start tracking your progress!
          </p>
        )}
      </CardContent>
    </Card>
  );
};
