
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Crown } from 'lucide-react';

export const PremiumBadge: React.FC = () => {
  return (
    <Badge variant="outline" className="border-yellow-400 text-yellow-300 bg-yellow-400/10">
      <Crown className="w-3 h-3 mr-1" />
      Premium
    </Badge>
  );
};
