import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  BarChart3, 
  Target, 
  User 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', icon: Home, label: 'Today' },
  { path: '/journal', icon: BookOpen, label: 'Journal' },
  { path: '/insights', icon: BarChart3, label: 'Insights' },
  { path: '/goals', icon: Target, label: 'Goals' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 z-50",
      "bg-card border-t border-border",
      "px-2 py-2 pb-safe", // pb-safe for iPhone home indicator
      "flex items-center justify-around",
      "md:hidden" // Hide on desktop
    )}>
      {navItems.map(({ path, icon: Icon, label }) => {
        const isActive = location.pathname === path;
        
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={cn(
              "flex flex-col items-center gap-1",
              "px-3 py-2 rounded-lg",
              "min-w-[64px] min-h-[52px]", // 44px+ touch target
              "transition-colors duration-200",
              "touch-manipulation",
              isActive 
                ? "text-primary bg-primary/10" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        );
      })}
    </nav>
  );
};