
import { 
  Home, 
  Target, 
  BookOpen, 
  MessageSquare, 
  TrendingUp, 
  Library, 
  User, 
  Shield 
} from 'lucide-react';

export interface NavigationItem {
  id: string;
  title: string;
  path: string;
  icon: typeof Home;
  adminOnly?: boolean;
}

export const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    title: 'Home',
    path: '/',
    icon: Home,
  },
  {
    id: 'goals',
    title: 'Goals',
    path: '/goals',
    icon: Target,
  },
  {
    id: 'journal',
    title: 'Journal',
    path: '/journal',
    icon: BookOpen,
  },
  {
    id: 'coach',
    title: 'Coach',
    path: '/coach',
    icon: MessageSquare,
  },
  {
    id: 'insights',
    title: 'Insights',
    path: '/insights',
    icon: TrendingUp,
  },
  {
    id: 'resources',
    title: 'Resources',
    path: '/resources',
    icon: Library,
  },
  {
    id: 'profile',
    title: 'Profile',
    path: '/profile',
    icon: User,
  },
  {
    id: 'admin',
    title: 'Admin Panel',
    path: '/admin',
    icon: Shield,
    adminOnly: true,
  },
];

export const getVisibleNavigationItems = (isAdmin: boolean = false): NavigationItem[] => {
  return navigationItems.filter(item => !item.adminOnly || isAdmin);
};
