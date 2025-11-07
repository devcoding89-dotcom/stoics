'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSidebar, useUser } from '@/firebase';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import { UserNav } from '@/components/user-nav';
import { BookCopy, LayoutDashboard, MessageSquare, PlusCircle, Shield } from 'lucide-react';

function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { userProfile } = useUser();
  const { setOpenMobile } = useSidebar();


  return (
    <div className="min-h-screen bg-background">
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <Logo className="h-8 w-auto" />
            <span className="font-bold text-lg font-headline">Stoics Educational Institute & Services</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem onClick={() => setOpenMobile(false)}>
              <Link href="/dashboard">
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith('/dashboard')}
                  tooltip={{ children: 'Dashboard' }}
                >
                  <span>
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            {userProfile?.role === 'student' && (
                <SidebarMenuItem onClick={() => setOpenMobile(false)}>
                <Link href="/homework">
                    <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith('/homework')}
                    tooltip={{ children: 'Homework' }}
                    >
                    <span>
                        <BookCopy />
                        <span>Homework</span>
                    </span>
                    </SidebarMenuButton>
                </Link>
                </SidebarMenuItem>
            )}
            {userProfile?.role === 'teacher' && (
                <SidebarMenuItem onClick={() => setOpenMobile(false)}>
                <Link href="/lessons/create">
                    <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith('/lessons/create')}
                    tooltip={{ children: 'New Lesson' }}
                    >
                    <span>
                        <PlusCircle />
                        <span>New Lesson</span>
                    </span>
                    </SidebarMenuButton>
                </Link>
                </SidebarMenuItem>
            )}
             {userProfile?.role === 'admin' && (
                <SidebarMenuItem onClick={() => setOpenMobile(false)}>
                <Link href="/admin">
                    <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith('/admin')}
                    tooltip={{ children: 'Admin' }}
                    >
                    <span>
                        <Shield />
                        <span>Admin</span>
                    </span>
                    </SidebarMenuButton>
                </Link>
                </SidebarMenuItem>
            )}
            <SidebarMenuItem onClick={() => setOpenMobile(false)}>
                <Link href="/messages">
                    <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith('/messages')}
                    tooltip={{ children: 'Messages' }}
                    >
                    <span>
                        <MessageSquare />
                        <span>Messages</span>
                    </span>
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1" />
          <UserNav />
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isUserLoading, user } = useUser();
  const router = useRouter();
  
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [isUserLoading, user, router]);

  if (isUserLoading || !user) {
    return (
       <div className="flex h-screen w-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Logo className="h-12 w-auto animate-pulse" />
          <p className="text-muted-foreground">Loading your experience...</p>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <MainLayout>{children}</MainLayout>
    </SidebarProvider>
  )
}
