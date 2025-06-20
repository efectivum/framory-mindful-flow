
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Zap } from 'lucide-react';

export const BetaBadge: React.FC = () => {
  return (
    <Badge variant="outline" className="border-blue-400 text-blue-300 bg-blue-400/10">
      <Zap className="w-3 h-3 mr-1" />
      Beta
    </Badge>
  );
};
