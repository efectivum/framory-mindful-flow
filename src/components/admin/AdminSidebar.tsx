
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Bell, 
  BarChart3, 
  FileText, 
  Settings, 
  ArrowLeft,
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';

const adminMenuItems = [
  {
    title: 'Dashboard',
    url: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'User Management',
    url: '/admin/users',
    icon: Users,
  },
  {
    title: 'Notifications',
    url: '/admin/notifications',
    icon: Bell,
  },
  {
    title: 'Analytics',
    url: '/admin/analytics',
    icon: BarChart3,
  },
  {
    title: 'Content',
    url: '/admin/content',
    icon: FileText,
  },
  {
    title: 'System',
    url: '/admin/system',
    icon: Settings,
  },
];

export const AdminSidebar = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-gray-800/50 border-r border-gray-700 flex flex-col">
      {/* Admin Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold text-white">Admin Panel</span>
        </div>
        <Link 
          to="/" 
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to App
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {adminMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.url;
            
            return (
              <Link
                key={item.title}
                to={item.url}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                  isActive 
                    ? "bg-blue-600 text-white" 
                    : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
