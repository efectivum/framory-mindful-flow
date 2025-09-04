
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, History } from 'lucide-react';
import { useState } from 'react';

interface TimelineEvent {
  id: string;
  date: string;
  time: string;
  title: string;
  type: 'journal' | 'goal' | 'habit' | 'mood' | 'reflection';
  description: string;
}

export const ActivityTimeline = () => {
  const [viewMode, setViewMode] = useState<'timeline' | 'calendar'>('timeline');

  // Mock data - this would come from the activity log
  const events: TimelineEvent[] = [
    {
      id: '1',
      date: '2024-01-15',
      time: '09:30',
      title: 'Morning Meditation',
      type: 'habit',
      description: 'Completed 10 minutes of mindfulness meditation'
    },
    {
      id: '2',
      date: '2024-01-15',
      time: '14:20',
      title: 'Reading Session',
      type: 'habit',
      description: 'Read 20 minutes of "Atomic Habits"'
    },
    {
      id: '3',
      date: '2024-01-14',
      time: '19:45',
      title: 'Weekly Reflection',
      type: 'journal',
      description: 'Reflected on this week\'s progress and challenges'
    }
  ];

  const getTypeColor = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'journal': return 'bg-blue-500';
      case 'goal': return 'bg-green-500';
      case 'habit': return 'bg-purple-500';
      case 'mood': return 'bg-orange-500';
      case 'reflection': return 'bg-teal-500';
      default: return 'bg-gray-500';
    }
  };

  const groupEventsByDate = (events: TimelineEvent[]) => {
    return events.reduce((groups, event) => {
      const date = event.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(event);
      return groups;
    }, {} as Record<string, TimelineEvent[]>);
  };

  const groupedEvents = groupEventsByDate(events);

  if (viewMode === 'calendar') {
    return (
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <div className="mobile-flex mobile-flex-between mobile-flex-center">
            <CardTitle className="text-foreground mobile-flex mobile-flex-center mobile-gap-sm">
              <Calendar className="w-5 h-5" />
              Activity Calendar
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode('timeline')}
            >
              <History className="w-4 h-4 mr-2" />
              Timeline View
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mobile-center text-muted-foreground py-8">
            Calendar view coming soon...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50 border-border">
      <CardHeader>
        <div className="mobile-flex mobile-flex-between mobile-flex-center">
          <CardTitle className="text-foreground mobile-flex mobile-flex-center mobile-gap-sm">
            <History className="w-5 h-5" />
            Activity Timeline
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode('calendar')}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Calendar View
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mobile-flow-lg">
          {Object.entries(groupedEvents).map(([date, dateEvents]) => (
            <div key={date} className="relative">
              <div className="sticky top-0 bg-card/80 backdrop-blur-sm mobile-card-content rounded-lg mb-4">
                <h3 className="text-foreground font-medium">
                  {new Date(date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </h3>
              </div>
              
              <div className="mobile-flow-tight pl-4 border-l-2 border-border">
                {dateEvents.map((event, index) => (
                  <div key={event.id} className="relative">
                    <div className={`absolute -left-7 w-4 h-4 rounded-full ${getTypeColor(event.type)} border-2 border-card`} />
                    
                    <div className="bg-muted/30 rounded-lg mobile-card-content">
                      <div className="mobile-flex mobile-flex-between mobile-flex-center mb-2">
                        <h4 className="text-foreground font-medium">{event.title}</h4>
                        <div className="mobile-flex mobile-flex-center mobile-gap-xs mobile-text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {event.time}
                        </div>
                      </div>
                      <p className="text-muted-foreground mobile-text-sm">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
