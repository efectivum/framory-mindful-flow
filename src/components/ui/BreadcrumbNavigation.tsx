
import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

export const BreadcrumbNavigation: React.FC = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', href: '/', icon: <Home className="w-4 h-4" /> }
  ];

  // Map path segments to readable labels
  const pathLabels: Record<string, string> = {
    'journal': 'Journal',
    'goals': 'Habits',
    'insights': 'Insights',
    'coach': 'AI Coach',
    'profile': 'Profile'
  };

  pathSegments.forEach((segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/');
    const label = pathLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    breadcrumbItems.push({ label, href });
  });

  if (breadcrumbItems.length <= 1) return null;

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-6 animate-fade-in">
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={item.href}>
          {index > 0 && <ChevronRight className="w-4 h-4 text-gray-500" />}
          <Link
            to={item.href}
            className={cn(
              "flex items-center gap-1 transition-colors hover:text-white",
              index === breadcrumbItems.length - 1 
                ? "text-white font-medium" 
                : "hover:text-purple-300"
            )}
          >
            {item.icon}
            {item.label}
          </Link>
        </React.Fragment>
      ))}
    </nav>
  );
};
