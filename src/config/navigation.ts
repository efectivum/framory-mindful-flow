
import { 
  Calendar, 
  BookOpen, 
  MessageSquare, 
  MoreHorizontal, 
  Shield 
} from 'lucide-react';

export interface NavigationItem {
  id: string;
  title: string;
  path: string;
  icon: typeof Calendar;
  adminOnly?: boolean;
}

export const navigationItems: NavigationItem[] = [
  {
    id: 'today',
    title: 'Today',
    path: '/',
    icon: Calendar,
  },
  {
    id: 'coach',
    title: 'Coach',
    path: '/coach',
    icon: MessageSquare,
  },
  {
    id: 'journal',
    title: 'Journal',
    path: '/journal',
    icon: BookOpen,
  },
  {
    id: 'more',
    title: 'More',
    path: '/profile',
    icon: MoreHorizontal,
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
