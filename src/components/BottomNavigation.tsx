
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { getVisibleNavigationItems } from '@/config/navigation';
import { useAdmin } from '@/hooks/useAdmin';

export const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin } = useAdmin();
  
  // Get all main navigation items (exclude admin for mobile)
  const mainNavItems = getVisibleNavigationItems(false);

  const getCurrentPageId = () => {
    const currentPath = location.pathname;
    const currentItem = mainNavItems.find(item => item.path === currentPath);
    return currentItem?.id || 'dashboard';
  };

  const currentPageId = getCurrentPageId();

  const handleNavigation = React.useCallback((path: string, title: string) => {
    console.log(`Bottom nav clicked: ${title} (${path})`);
    
    // Add haptic feedback for mobile devices
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    try {
      navigate(path);
    } catch (error) {
      console.error('Navigation failed:', error);
      // Fallback to window.location if navigate fails
      window.location.href = path;
    }
  }, [navigate]);

  // Debug logging
  console.log('BottomNavigation rendering:', {
    currentPath: location.pathname,
    currentPageId,
    mainNavItems: mainNavItems.length,
    isVisible: true
  });

  return (
    <div className="bottom-navigation-fixed md:hidden">
      {/* Glass morphism background with subtle gradient */}
      <div className="bg-gray-900/95 backdrop-blur-xl border-t border-gray-700/40 shadow-2xl">
        <div className="flex items-center justify-around px-2 py-2" style={{ minHeight: '72px' }}>
          {mainNavItems.map((item) => {
            const isActive = currentPageId === item.id;
            const Icon = item.icon;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path, item.title)}
                className={cn(
                  "flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 ease-out min-w-14 min-h-16 flex-1 max-w-20",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-gray-900",
                  "active:scale-95 transform-gpu touch-manipulation",
                  "relative overflow-hidden",
                  isActive 
                    ? "text-blue-400 bg-blue-500/15 shadow-lg shadow-blue-500/25 scale-105" 
                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 active:bg-gray-700/50"
                )}
                style={{
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation'
                }}
                aria-label={`Navigate to ${item.title}`}
                role="tab"
                aria-selected={isActive}
              >
                {/* Active indicator glow */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent rounded-2xl animate-pulse" />
                )}
                
                <Icon 
                  className={cn(
                    "w-5 h-5 mb-1 transition-all duration-300 flex-shrink-0",
                    isActive 
                      ? "stroke-2 drop-shadow-sm scale-110" 
                      : "stroke-[1.5] group-hover:stroke-2"
                  )} 
                />
                <span 
                  className={cn(
                    "text-xs font-medium leading-tight transition-all duration-300 text-center",
                    isActive 
                      ? "text-blue-300 drop-shadow-sm font-semibold" 
                      : "text-gray-500"
                  )}
                >
                  {item.title}
                </span>
              </button>
            );
          })}
        </div>
        
        {/* Bottom safe area padding */}
        <div className="h-safe-area-inset-bottom bg-gray-900/80" />
      </div>
    </div>
  );
};
