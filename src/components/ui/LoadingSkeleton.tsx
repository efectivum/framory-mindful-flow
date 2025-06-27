
import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  variant?: 'card' | 'text' | 'avatar' | 'button' | 'chart';
  className?: string;
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  variant = 'card', 
  className,
  count = 1 
}) => {
  const skeletons = Array.from({ length: count }, (_, index) => (
    <div key={index} className={getSkeletonClasses(variant, className)} />
  ));

  return <>{skeletons}</>;
};

const getSkeletonClasses = (variant: string, className?: string) => {
  const baseClasses = "animate-pulse bg-gradient-to-r from-gray-700/50 via-gray-600/50 to-gray-700/50 bg-[length:200%_100%] rounded-2xl";
  
  const variantClasses = {
    card: "h-32 w-full",
    text: "h-4 w-3/4",
    avatar: "h-12 w-12 rounded-full",
    button: "h-12 w-32",
    chart: "h-64 w-full"
  };

  return cn(baseClasses, variantClasses[variant as keyof typeof variantClasses], className);
};

export const LoadingCardSkeleton: React.FC = () => (
  <div className="app-card-organic p-6 space-y-4 animate-fade-in">
    <div className="flex items-center space-x-3">
      <LoadingSkeleton variant="avatar" />
      <div className="space-y-2 flex-1">
        <LoadingSkeleton variant="text" className="h-5 w-1/2" />
        <LoadingSkeleton variant="text" className="h-3 w-3/4" />
      </div>
    </div>
    <LoadingSkeleton variant="text" className="h-4 w-full" />
    <LoadingSkeleton variant="text" className="h-4 w-5/6" />
    <LoadingSkeleton variant="text" className="h-4 w-4/5" />
  </div>
);
