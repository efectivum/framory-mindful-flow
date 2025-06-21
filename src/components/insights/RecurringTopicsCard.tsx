
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Tag, Calendar, TrendingUp } from 'lucide-react';
import { useUserPatterns } from '@/hooks/useUserPatterns';
import { format, subDays } from 'date-fns';

export const RecurringTopicsCard: React.FC = () => {
  const { recurringTopics, isLoading } = useUserPatterns();

  if (isLoading) {
    return (
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <Tag className="w-5 h-5" />
            Recurring Topics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-700/30 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (recurringTopics.length === 0) {
    return (
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <Tag className="w-5 h-5" />
            Recurring Topics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-400">
            <Tag className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Keep journaling to discover your recurring topics!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white text-lg flex items-center gap-2">
          <Tag className="w-5 h-5" />
          Recurring Topics
          <Badge variant="outline" className="ml-auto text-xs">
            This Week
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {recurringTopics.slice(0, 6).map((topic, index) => (
            <AccordionItem key={topic.id} value={`topic-${index}`} className="border-gray-700/50">
              <AccordionTrigger className="text-white hover:text-blue-400 py-3">
                <div className="flex items-center justify-between w-full mr-4">
                  <span className="capitalize font-medium">{topic.pattern_key}</span>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="secondary" 
                      className="bg-blue-900/50 border-blue-700/50 text-blue-200 text-xs"
                    >
                      {topic.occurrence_count}x
                    </Badge>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-gray-300 pb-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span>Confidence: {Math.round(topic.confidence_level * 100)}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-purple-400" />
                      <span>Last seen: {format(new Date(topic.last_detected_at), 'MMM dd')}</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700/30 rounded-lg p-3">
                    <p className="text-sm leading-relaxed">
                      This topic appears frequently in your entries, suggesting it's an important 
                      theme in your personal growth journey. Consider exploring this area deeper 
                      in future reflections.
                    </p>
                  </div>

                  {topic.pattern_value && typeof topic.pattern_value === 'object' && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {Object.entries(topic.pattern_value as Record<string, any>)
                        .slice(0, 3)
                        .map(([key, value]) => (
                          <Badge key={key} variant="outline" className="text-xs">
                            {key}: {String(value)}
                          </Badge>
                        ))
                      }
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};
