
import { Calendar } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Link } from 'react-router-dom';
import { UserButton } from '@/components/UserButton';
import { useAdmin } from '@/hooks/useAdmin';
import { getVisibleNavigationItems } from '@/config/navigation';

export function AppSidebar() {
  const { isAdmin, isLoading } = useAdmin();
  const menuItems = getVisibleNavigationItems(isAdmin);

  return (
    <Sidebar collapsible="icon" className="bg-gradient-to-b from-gray-900 to-gray-800 border-r border-gray-700">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Calendar className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold text-white">Lumatori</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400 text-xs uppercase tracking-wider">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    asChild 
                    className={`text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors ${
                      item.adminOnly ? 'border-t border-gray-700 mt-2 pt-2 text-red-300 hover:text-red-100 hover:bg-red-900/20' : ''
                    }`}
                  >
                    <Link to={item.path} className="flex items-center gap-3 px-3 py-2 rounded-lg">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t border-gray-700">
        <UserButton />
      </SidebarFooter>
    </Sidebar>
  );
}
