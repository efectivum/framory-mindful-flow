
import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';

export const AdminHeader = () => {
  const { user } = useAuth();

  return (
    <header className="bg-gray-800/30 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search admin panel..."
              className="pl-10 w-80 bg-gray-700 border-gray-600 text-white"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
            <Bell className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center gap-2 text-gray-300">
            <User className="w-5 h-5" />
            <span className="text-sm">{user?.email?.split('@')[0]}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
