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
  useSidebar,
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

function MainLayout({ children }: { children: React.ReactNode }) {
  const { userProfile } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const auth = getAuth();
  const { setOpenMobile } = useSidebar();
  
  const handleLogout = () => {
    signOut(auth);
    router.push('/login');
  };
  
  const handleLinkClick = (e: React.MouseEvent) => {
    // Only close on mobile
    if (window.innerWidth < 768) {
      setOpenMobile(false);
    }
  };
  
  // userProfile is guaranteed to exist here by the AppLayout guard
  const navigation = getNavigation(userProfile!.role);

  return (
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
                <Link href={item.href} onClick={handleLinkClick}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith(item.href)}
                    tooltip={{ children: item.label }}
                  >
                    <span>
                      <item.icon />
                      <span>{item.label}</span>
                    </span>
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
  );
}


export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isUserLoading, user, isUserProfileLoading, userProfile } = useUser();
  const router = useRouter();
  
  useEffect(() => {
    // If auth is done loading and there's no user, redirect to login.
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [isUserLoading, user, router]);

  // Combined loading state: wait for both auth and profile fetch.
  const isLoading = isUserLoading || isUserProfileLoading;

  if (isLoading) {
    return (
       <div className="flex h-screen w-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Logo className="h-12 w-12 animate-pulse" />
          <p className="text-muted-foreground">Loading your experience...</p>
        </div>
      </div>
    )
  }

  // If loading is complete but there is no user, redirecting.
  // Returning null prevents children from rendering prematurely.
  if (!user || !userProfile) {
    return null;
  }

  return (
    <SidebarProvider>
      <MainLayout>{children}</MainLayout>
    </SidebarProvider>
  )
}
