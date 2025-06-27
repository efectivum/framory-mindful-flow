
import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressRingProps {
  progress: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  children?: React.ReactNode;
  className?: string;
  showPercentage?: boolean;
  animated?: boolean;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 'md',
  strokeWidth,
  color = '#8b5cf6',
  backgroundColor = '#374151',
  children,
  className,
  showPercentage = false,
  animated = true
}) => {
  const sizes = {
    sm: { radius: 20, defaultStroke: 3 },
    md: { radius: 40, defaultStroke: 4 },
    lg: { radius: 60, defaultStroke: 6 }
  };

  const { radius, defaultStroke } = sizes[size];
  const stroke = strokeWidth || defaultStroke;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        height={radius * 2}
        width={radius * 2}
        className={animated ? "transform -rotate-90 transition-all duration-500" : "transform -rotate-90"}
      >
        {/* Background circle */}
        <circle
          stroke={backgroundColor}
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Progress circle */}
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className={animated ? "transition-all duration-500" : ""}
        />
      </svg>
      
      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children || (showPercentage && (
          <span className="text-sm font-semibold text-white">
            {Math.round(progress)}%
          </span>
        ))}
      </div>
    </div>
  );
};

export const HabitStreakRing: React.FC<{ streak: number; target: number; size?: 'sm' | 'md' | 'lg' }> = ({ 
  streak, 
  target, 
  size = 'md' 
}) => {
  const progress = Math.min((streak / target) * 100, 100);
  const isComplete = streak >= target;

  return (
    <ProgressRing
      progress={progress}
      size={size}
      color={isComplete ? '#10b981' : '#8b5cf6'}
      showPercentage={false}
    >
      <div className="text-center">
        <div className={cn(
          "font-bold",
          size === 'sm' ? "text-xs" : size === 'md' ? "text-sm" : "text-base",
          isComplete ? "text-green-400" : "text-white"
        )}>
          {streak}
        </div>
        <div className={cn(
          "text-gray-400",
          size === 'sm' ? "text-xs" : "text-xs"
        )}>
          days
        </div>
      </div>
    </ProgressRing>
  );
};
