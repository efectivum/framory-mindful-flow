
import React from 'react';
import { FlippableCard } from '@/components/ui/FlippableCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Lightbulb, ArrowRight } from 'lucide-react';

interface SuggestionCardProps {
  title: string;
  description: string;
  detailedContent: string;
  actionText?: string;
  onAction?: () => void;
  category?: string;
  className?: string;
}

export const SuggestionCard: React.FC<SuggestionCardProps> = ({
  title,
  description,
  detailedContent,
  actionText = "Try this",
  onAction,
  category,
  className
}) => {
  const frontCard = (
    <Card className={cn(
      "relative flex w-full h-full flex-col rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-600/10 border border-blue-500/20 backdrop-blur-sm cursor-pointer transition-all duration-200 hover:border-blue-400/30",
      className
    )}>
      <div className="flex h-full w-full flex-col p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-blue-400" />
            {category && (
              <span className="text-xs text-blue-300 bg-blue-900/30 px-2 py-1 rounded-full">
                {category}
              </span>
            )}
          </div>
          <div className="text-blue-400/50 text-sm">Flip for details</div>
        </div>
        
        <div className="flex-1">
          <h3 className="text-white font-semibold text-lg mb-3 leading-tight">
            {title}
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            {description}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-blue-300 text-sm font-medium">
            Hover to explore →
          </span>
          <ArrowRight className="w-4 h-4 text-blue-400" />
        </div>
      </div>
    </Card>
  );

  const backCard = (
    <Card className={cn(
      "relative flex w-full h-full flex-col rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-600/10 border border-purple-500/20 backdrop-blur-sm",
      className
    )}>
      <div className="flex h-full w-full flex-col p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-purple-400" />
          <h3 className="text-white font-semibold text-lg">{title}</h3>
        </div>
        
        <div className="flex-1 mb-6">
          <p className="text-gray-300 text-sm leading-relaxed">
            {detailedContent}
          </p>
        </div>

        <Button 
          onClick={onAction}
          className="bg-purple-600 hover:bg-purple-700 text-white w-full"
        >
          {actionText}
        </Button>
      </div>
    </Card>
  );

  return (
    <FlippableCard
      frontContent={frontCard}
      backContent={backCard}
      height="h-[280px]"
      flipOnHover={true}
      flipOnClick={false}
    />
  );
};
