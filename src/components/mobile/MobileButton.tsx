import { ReactNode, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface MobileButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const MobileButton = ({ 
  children, 
  className, 
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  ...props 
}: MobileButtonProps) => {
  return (
    <button 
      className={cn(
        // Mobile-first base styles
        "rounded-lg font-medium transition-all duration-200",
        "flex items-center justify-center gap-2",
        "min-h-[44px] touch-manipulation", // 44px minimum touch target
        // Variants
        variant === 'primary' && "bg-primary text-primary-foreground hover:bg-primary/90",
        variant === 'secondary' && "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        variant === 'ghost' && "bg-transparent text-foreground hover:bg-secondary",
        // Sizes
        size === 'sm' && "px-4 py-2 text-sm",
        size === 'md' && "px-6 py-3 text-base",
        size === 'lg' && "px-8 py-4 text-lg",
        // Full width
        fullWidth && "w-full",
        // Interactive states
        "active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};