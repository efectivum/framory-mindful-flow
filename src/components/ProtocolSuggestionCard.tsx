
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Target, TrendingUp, BookOpen } from 'lucide-react';

interface ProtocolSuggestion {
  id: string;
  protocol_name: string;
  category: string;
  source: string;
  description: string;
  implementation_steps: string[];
  expected_timeline: string;
  success_metrics: string[];
  confidence: number;
  reason: string;
}

interface ProtocolSuggestionCardProps {
  protocol: ProtocolSuggestion;
  onApply: (protocolId: string) => void;
  onLearnMore: (protocol: ProtocolSuggestion) => void;
  isApplying?: boolean;
}

export const ProtocolSuggestionCard: React.FC<ProtocolSuggestionCardProps> = ({
  protocol,
  onApply,
  onLearnMore,
  isApplying = false,
}) => {
  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'huberman_lab':
        return '🧠';
      case 'atomic_habits':
        return '🎯';
      case 'cbt':
        return '💭';
      default:
        return '📚';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'sleep':
        return 'bg-blue-100 text-blue-800';
      case 'stress':
        return 'bg-red-100 text-red-800';
      case 'focus':
        return 'bg-purple-100 text-purple-800';
      case 'habit_formation':
        return 'bg-green-100 text-green-800';
      case 'exercise':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-blue-500/10 to-transparent" />
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{getSourceIcon(protocol.source)}</span>
            <div>
              <CardTitle className="text-lg leading-tight">{protocol.protocol_name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={getCategoryColor(protocol.category)}>
                  {protocol.category.replace('_', ' ')}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {Math.round(protocol.confidence * 100)}% match
                </Badge>
              </div>
            </div>
          </div>
        </div>
        <CardDescription className="text-sm leading-relaxed">
          {protocol.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Quick Preview Steps */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
            <Target className="h-3 w-3" />
            Key Steps
          </h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {protocol.implementation_steps.slice(0, 3).map((step, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-blue-500 font-medium min-w-[1.2em]">{index + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
            {protocol.implementation_steps.length > 3 && (
              <li className="text-gray-400 text-xs italic">
                +{protocol.implementation_steps.length - 3} more steps...
              </li>
            )}
          </ul>
        </div>

        {/* Timeline and Metrics */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="flex items-center gap-1 text-gray-600">
            <Clock className="h-3 w-3" />
            <span>{protocol.expected_timeline}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <TrendingUp className="h-3 w-3" />
            <span>{protocol.success_metrics.length} metrics</span>
          </div>
        </div>

        {/* Why Recommended */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <h5 className="text-xs font-medium text-blue-800 mb-1">Why this is recommended:</h5>
          <p className="text-xs text-blue-700">{protocol.reason}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={() => onApply(protocol.id)}
            disabled={isApplying}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            size="sm"
          >
            {isApplying ? 'Adding...' : 'Try This Protocol'}
          </Button>
          <Button
            variant="outline"
            onClick={() => onLearnMore(protocol)}
            size="sm"
          >
            <BookOpen className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
