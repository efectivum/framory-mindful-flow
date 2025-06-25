
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { getVisibleNavigationItems } from '@/config/navigation';
import { useAdmin } from '@/hooks/useAdmin';

export const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin } = useAdmin();
  
  // Get main navigation items (exclude admin for mobile to save space)
  const mainNavItems = getVisibleNavigationItems(false).slice(0, 5); // Show first 5 items

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

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Glass morphism background with subtle gradient */}
      <div className="bg-gray-900/90 backdrop-blur-xl border-t border-gray-700/30 shadow-2xl">
        <div className="flex items-center justify-around px-2 py-1">
          {mainNavItems.map((item) => {
            const isActive = currentPageId === item.id;
            const Icon = item.icon;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path, item.title)}
                className={cn(
                  "flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 ease-out min-w-16 min-h-16",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-gray-900",
                  "active:scale-95 transform-gpu",
                  "relative overflow-hidden",
                  isActive 
                    ? "text-blue-400 bg-blue-500/10 shadow-lg shadow-blue-500/20" 
                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/40 active:bg-gray-700/40"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent rounded-2xl" />
                )}
                
                <Icon 
                  className={cn(
                    "w-5 h-5 mb-1 transition-all duration-300",
                    isActive 
                      ? "stroke-2 drop-shadow-sm" 
                      : "stroke-[1.5] group-hover:stroke-2"
                  )} 
                />
                <span 
                  className={cn(
                    "text-xs font-medium leading-none transition-all duration-300",
                    isActive 
                      ? "text-blue-300 drop-shadow-sm" 
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
        <div className="h-safe-area-inset-bottom bg-gray-900/50" />
      </div>
    </div>
  );
};
