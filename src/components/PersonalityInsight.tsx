
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';

export const PersonalityInsight: React.FC = () => {
  // Placeholder component. Future implementation will use journal analysis
  // to provide insights based on the Big Five model.
  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white text-lg flex items-center gap-2">
          <User className="w-5 h-5 text-purple-300" />
          Personality Insight
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-400 text-sm">
          As you continue to journal, we'll uncover insights about your personality traits. Keep writing to learn more about yourself!
        </p>
      </CardContent>
    </Card>
  );
};
