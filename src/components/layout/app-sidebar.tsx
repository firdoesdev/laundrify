
"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  BarChartBig,
  MessageSquareText,
  Settings,
  ChevronDown,
  Package,
} from 'lucide-react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/customers', label: 'Customers', icon: Users },
  { href: '/reports', label: 'Reports', icon: BarChartBig },
  { href: '/reviews', label: 'Reviews Analysis', icon: MessageSquareText },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar collapsible="icon" variant="sidebar" side="left">
      <SidebarHeader className="p-4">
        <Link href="/dashboard" className="flex items-center gap-2 group" onClick={() => setOpenMobile(false)}>
          <Package className="h-8 w-8 text-primary transition-transform duration-300 group-hover:rotate-[15deg]" />
          <h1 className="text-2xl font-bold text-sidebar-foreground group-data-[collapsible=icon]:hidden">Laundrify</h1>
        </Link>
      </SidebarHeader>
      <Separator className="bg-sidebar-border group-data-[collapsible=icon]:hidden" />
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))}
                  tooltip={item.label}
                  onClick={() => setOpenMobile(false)}
                  className="justify-start"
                >
                  <item.icon className="h-5 w-5" />
                  <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
       <Separator className="my-2 bg-sidebar-border group-data-[collapsible=icon]:hidden" />
      <SidebarFooter className="p-4 mt-auto group-data-[collapsible=icon]:p-2">
        <Link href="/settings" legacyBehavior passHref>
            <SidebarMenuButton tooltip="Settings" className="justify-start" onClick={() => setOpenMobile(false)}>
                <Settings className="h-5 w-5" />
                <span className="group-data-[collapsible=icon]:hidden">Settings</span>
            </SidebarMenuButton>
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
