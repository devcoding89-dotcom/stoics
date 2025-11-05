'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@/context/user-context';
import type { UserRole } from '@/lib/types';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { UserNav } from '@/components/user-nav';
import {
  LayoutDashboard,
  BookOpenCheck,
  ClipboardList,
  CreditCard,
  MessagesSquare,
  BrainCircuit,
  Settings,
  LogOut,
  Users,
  User,
  Wallet,
} from 'lucide-react';

const navItems = {
  shared: [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/communication', icon: MessagesSquare, label: 'Communication' },
    { href: '/settings', icon: Settings, label: 'Settings' },
  ],
  student: [
    { href: '/lessons', icon: BookOpenCheck, label: 'My Lessons' },
    { href: '/ai-tutor', icon: BrainCircuit, label: 'AI Tutor' },
    { href: '/payments', icon: CreditCard, label: 'My Payments' },
  ],
  teacher: [
    { href: '/lessons', icon: BookOpenCheck, label: 'Manage Lessons' },
    { href: '/attendance', icon: ClipboardList, label: 'Attendance' },
    { href: '/payments', icon: Wallet, label: 'Earnings' },
  ],
  parent: [
    { href: '/lessons', icon: BookOpenCheck, label: "Child's Lessons" },
    { href: '/attendance', icon: ClipboardList, label: "Child's Attendance" },
    { href: '/payments', icon: CreditCard, label: 'Payments' },
  ],
  admin: [
    { href: '/lessons', icon: BookOpenCheck, label: 'All Lessons' },
    { href: '/users', icon: Users, label: 'Manage Users' },
    { href: '/payments', icon: CreditCard, label: 'All Payments' },
  ],
};

function getNavigation(role: UserRole) {
  const roleNav = navItems[role] || [];
  
  const allNavs = [...roleNav, ...navItems.shared];

  // Simple de-duplication based on href
  const uniqueNavs = allNavs.filter((v,i,a)=>a.findIndex(t=>(t.href === v.href))===i)
  
  // Custom sort order
  const order = ['/dashboard', '/lessons', '/attendance', '/ai-tutor', '/users', '/payments', '/communication', '/settings'];
  uniqueNavs.sort((a, b) => order.indexOf(a.href) - order.indexOf(b.href));

  return uniqueNavs;
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const pathname = usePathname();
  const navigation = getNavigation(user.role);

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 p-2">
              <Logo />
              <span className="font-bold text-xl font-headline">EduConnect</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href} legacyBehavior passHref>
                    <SidebarMenuButton
                      isActive={pathname.startsWith(item.href)}
                      tooltip={{ children: item.label }}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <Separator className="my-2" />
            <SidebarMenu>
              <SidebarMenuItem>
                 <SidebarMenuButton>
                   <LogOut/>
                   <span>Logout</span>
                 </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
            <SidebarTrigger className="md:hidden" />
            <div className="flex-1">
              {/* Optional: Breadcrumbs or Page Title */}
            </div>
            <UserNav />
          </header>
          <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
