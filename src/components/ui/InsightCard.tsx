
import React from 'react';
import { FlippableCard } from './FlippableCard';
import { Card } from './card';
import { cn } from '@/lib/utils';
import { RotateCcw } from 'lucide-react';

interface InsightCardProps {
  title: string;
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
  className?: string;
  height?: string;
  timeframe?: string;
  helpIcon?: React.ReactNode;
}

export const InsightCard: React.FC<InsightCardProps> = ({
  title,
  frontContent,
  backContent,
  className,
  height = "h-[290px]",
  timeframe,
  helpIcon
}) => {
  const frontCard = (
    <Card className={cn(
      "relative flex w-full h-full flex-col rounded-3xl bg-gray-800/50 border-gray-700/50 backdrop-blur-sm cursor-pointer transition-all duration-200 hover:border-gray-600/50",
      className
    )}>
      {/* Header */}
      <div className="px-6 pt-6">
        <div className="flex flex-row items-center justify-between border-b border-gray-700/50 pb-4">
          <div className="flex flex-row items-center text-gray-300">
            <div className="md:pr-2 font-medium">{title}</div>
            {helpIcon && (
              <button className="ml-2 flex h-[20px] w-[20px] items-center justify-center rounded-full bg-blue-600 text-white">
                {helpIcon}
              </button>
            )}
          </div>
          {timeframe && (
            <div className="text-gray-400 text-sm">{timeframe}</div>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="flex h-0 flex-1 flex-col p-6">
        {frontContent}
      </div>
      
      {/* Flip Indicator */}
      <div className="absolute bottom-4 right-4">
        <RotateCcw className="w-5 h-5 text-gray-500" />
      </div>
    </Card>
  );

  const backCard = (
    <Card className={cn(
      "relative flex w-full h-full flex-col rounded-3xl bg-gray-800/60 border-gray-600/50 backdrop-blur-sm",
      className
    )}>
      <div className="flex h-full w-full overflow-y-auto p-6 scrollbar-hide">
        <div className="w-full">
          {backContent}
        </div>
      </div>
    </Card>
  );

  return (
    <FlippableCard
      frontContent={frontCard}
      backContent={backCard}
      height={height}
      className="cursor-pointer"
    />
  );
};
