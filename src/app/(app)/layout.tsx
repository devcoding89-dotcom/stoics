'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
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
  Wallet,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { getAuth, signOut } from 'firebase/auth';

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
    { href: '/users', icon: Users, label: 'Manage Users' },
    { href: '/lessons', icon: BookOpenCheck, label: 'All Lessons' },
    { href: '/payments', icon: CreditCard, label: 'All Payments' },
  ],
};

function getNavigation(role: UserRole) {
  const roleNav = navItems[role] || [];
  
  const allNavs = [...roleNav, ...navItems.shared];

  const uniqueNavs = allNavs.filter((v,i,a)=>a.findIndex(t=>(t.href === v.href))===i)
  
  const order = ['/dashboard', '/lessons', '/attendance', '/ai-tutor', '/users', '/payments', '/communication', '/settings'];
  uniqueNavs.sort((a, b) => order.indexOf(a.href) - order.indexOf(b.href));

  return uniqueNavs;
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading, userProfile } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const auth = getAuth();
  
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !userProfile) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Logo className="h-12 w-12" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
    );
  }
  
  const navigation = getNavigation(userProfile.role);

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 p-2">
              <Logo />
              <span className="font-bold text-lg font-headline">Stoics Educational Services</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href}>
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
                 <SidebarMenuButton onClick={handleLogout}>
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
