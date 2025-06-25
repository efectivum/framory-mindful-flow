
import React from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const AdminLayout = ({ children, title, subtitle }: AdminLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
              {subtitle && <p className="text-gray-400">{subtitle}</p>}
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
