
import React from 'react';
import { Home, MessageSquare, Target, BookOpen, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navItems = [
  { id: 'dashboard', label: 'Home', icon: Home, path: '/' },
  { id: 'goals', label: 'Goals', icon: Target, path: '/goals' },
  { id: 'journal', label: 'Journal', icon: BookOpen, path: '/journal' },
  { id: 'chat', label: 'Chat', icon: MessageSquare, path: '/chat' },
  { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
];

export const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getCurrentPageId = () => {
    const currentPath = location.pathname;
    const currentItem = navItems.find(item => item.path === currentPath);
    return currentItem?.id || 'dashboard';
  };

  const currentPageId = getCurrentPageId();

  // Debounced navigation to prevent rapid taps
  const handleNavigation = React.useCallback((path: string, label: string) => {
    console.log(`Bottom nav clicked: ${label} (${path})`);
    navigate(path);
  }, [navigate]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 md:hidden safe-area-pb">
      <div className="flex items-center justify-around py-1 px-2">
        {navItems.map((item) => {
          const isActive = currentPageId === item.id;
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path, item.label)}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 min-w-16 min-h-14 touch-manipulation haptic-light",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                "active:scale-95",
                isActive 
                  ? "text-blue-600 bg-blue-50" 
                  : "text-gray-400 active:text-gray-600 active:bg-gray-50"
              )}
              style={{
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation'
              }}
            >
              <Icon className={cn("w-5 h-5 mb-1", isActive && "stroke-2")} />
              <span className="text-xs font-medium leading-none">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
