
import React from 'react';
import { Home, MessageSquare, Target, BookOpen, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Home', icon: Home },
  { id: 'chat', label: 'Chat', icon: MessageSquare },
  { id: 'goals', label: 'Goals', icon: Target },
  { id: 'journal', label: 'Journal', icon: BookOpen },
  { id: 'profile', label: 'Profile', icon: User },
];

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentPage,
  onPageChange,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-800/95 backdrop-blur-md border-t border-gray-700 md:hidden">
      <div className="flex items-center justify-around py-2 px-4 safe-area-pb">
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 min-w-16 min-h-16",
                isActive 
                  ? "text-blue-400 bg-blue-500/20" 
                  : "text-gray-400 hover:text-white hover:bg-gray-700/50"
              )}
            >
              <Icon className={cn("w-6 h-6 mb-1", isActive && "scale-110")} />
              <span className="text-xs font-medium">{item.label}</span>
              {isActive && (
                <div className="w-1 h-1 bg-blue-400 rounded-full mt-1" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
