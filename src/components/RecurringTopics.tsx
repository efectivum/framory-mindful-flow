
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserPatterns } from '@/hooks/useUserPatterns';
import { Loader2, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const RecurringTopics: React.FC = () => {
  const { recurringTopics, isLoading } = useUserPatterns();

  if (isLoading) {
    return null;
  }

  if (recurringTopics.length === 0) {
    return null; // Don't show if no topics yet
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white text-lg flex items-center gap-2">
          <Tag className="w-5 h-5 text-blue-300" />
          Recurring Topics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {recurringTopics.slice(0, 5).map(topic => (
            <Badge key={topic.id} variant="secondary" className="bg-blue-900/50 border-blue-700/50 text-blue-200">
              {topic.pattern_key}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
