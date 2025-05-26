
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Timeline } from 'lucide-react';
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
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Activity Calendar
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode('timeline')}
              className="bg-gray-700 border-gray-600"
            >
              <Timeline className="w-4 h-4 mr-2" />
              Timeline View
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-400 py-8">
            Calendar view coming soon...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Timeline className="w-5 h-5" />
            Activity Timeline
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode('calendar')}
            className="bg-gray-700 border-gray-600"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Calendar View
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(groupedEvents).map(([date, dateEvents]) => (
            <div key={date} className="relative">
              <div className="sticky top-0 bg-gray-800/80 backdrop-blur-sm p-2 rounded-lg mb-4">
                <h3 className="text-white font-medium">
                  {new Date(date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </h3>
              </div>
              
              <div className="space-y-3 pl-4 border-l-2 border-gray-600">
                {dateEvents.map((event, index) => (
                  <div key={event.id} className="relative">
                    <div className={`absolute -left-7 w-4 h-4 rounded-full ${getTypeColor(event.type)} border-2 border-gray-800`} />
                    
                    <div className="bg-gray-700/30 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-medium">{event.title}</h4>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock className="w-3 h-3" />
                          {event.time}
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm">{event.description}</p>
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
