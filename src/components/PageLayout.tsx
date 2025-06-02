
import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { BottomNavigation } from '@/components/BottomNavigation';
import { useIsMobile } from '@/hooks/use-mobile';

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  showHeader?: boolean;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ 
  children, 
  title, 
  subtitle,
  showHeader = true 
}) => {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Desktop Sidebar - hidden on mobile */}
        <div className="hidden md:block">
          <AppSidebar />
        </div>
        
        <main className="flex-1 flex flex-col">
          {/* Header */}
          {showHeader && (
            <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <SidebarTrigger className="text-white hover:bg-gray-700 hidden md:flex" />
                  <div>
                    <h1 className="text-xl font-semibold text-white">{title}</h1>
                    {subtitle && <p className="text-gray-400 text-sm">{subtitle}</p>}
                  </div>
                </div>
              </div>
            </header>
          )}
          
          {/* Page Content */}
          <div className="flex-1 p-4 lg:p-6 pb-20 md:pb-6">
            {children}
          </div>
        </main>
        
        {/* Mobile Bottom Navigation - shown only on mobile */}
        {isMobile && <BottomNavigation />}
      </div>
    </SidebarProvider>
  );
};
