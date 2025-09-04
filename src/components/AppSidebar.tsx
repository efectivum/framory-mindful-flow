
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
import { cn } from '@/lib/utils';

export function AppSidebar() {
  const { isAdmin, isLoading } = useAdmin();
  const menuItems = getVisibleNavigationItems(isAdmin);

  return (
    <Sidebar collapsible="icon" className="bg-card border-r border-border">
      <SidebarHeader className="mobile-content-spacing">
        <div className="mobile-flex mobile-flex-center">
          <div className="w-8 h-8 bg-primary rounded-lg mobile-flex mobile-flex-center">
            <Calendar className="w-4 h-4 text-white" />
          </div>
          <span className="mobile-h2 font-bold text-foreground">Lumatori</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="mobile-content-spacing">
        <SidebarGroup>
          <SidebarGroupLabel className="mobile-text-caption text-muted-foreground uppercase tracking-wider">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    asChild 
                    className={cn(
                      "mobile-touchable text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
                      item.adminOnly && "border-t border-border mt-2 pt-2 text-destructive hover:text-destructive-foreground hover:bg-destructive/20"
                    )}
                  >
                    <Link to={item.path} className="mobile-flex mobile-flex-center mobile-gesture-zone rounded-lg">
                      <item.icon className="w-5 h-5" />
                      <span className="mobile-text-body">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="mobile-content-spacing border-t border-border">
        <UserButton />
      </SidebarFooter>
    </Sidebar>
  );
}
