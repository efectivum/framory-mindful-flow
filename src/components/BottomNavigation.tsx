import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { getVisibleNavigationItems } from '@/config/navigation';
import { motion } from 'framer-motion';

export const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get main navigation items (exclude admin for bottom nav)
  const mainNavItems = getVisibleNavigationItems(false);

  const getCurrentPageId = () => {
    const currentPath = location.pathname;
    const currentItem = mainNavItems.find(item => item.path === currentPath);
    return currentItem?.id || 'today';
  };

  const currentPageId = getCurrentPageId();

  const handleNavigation = React.useCallback((path: string) => {
    // Add haptic feedback for mobile devices
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    navigate(path);
  }, [navigate]);

  return (
    <nav 
      className="fixed bottom-4 left-4 right-4 z-50 bg-card/95 backdrop-blur-xl rounded-2xl border border-border"
      style={{ 
        paddingBottom: 'env(safe-area-inset-bottom)',
        boxShadow: '0 -4px 24px hsl(var(--foreground) / 0.06)'
      }}
    >
      <div className="flex items-center justify-around px-2 py-3 max-w-md mx-auto">
        {mainNavItems.map((item) => {
          const isActive = currentPageId === item.id;
          const Icon = item.icon;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl",
                "min-w-[64px] min-h-[52px]",
                "transition-colors duration-200",
                "touch-manipulation",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-label={`Navigate to ${item.title}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Active indicator pill */}
              {isActive && (
                <motion.div
                  layoutId="activeNavIndicator"
                  className="absolute inset-0 bg-primary/10 rounded-xl"
                  initial={false}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              
              <Icon 
                className={cn(
                  "w-6 h-6 relative z-10 transition-all duration-200",
                  isActive ? "stroke-[2.5]" : "stroke-2"
                )} 
              />
              <span 
                className={cn(
                  "text-xs relative z-10 transition-all duration-200",
                  isActive ? "font-semibold text-primary" : "font-medium"
                )}
              >
                {item.title}
              </span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};
