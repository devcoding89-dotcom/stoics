'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import { useUser } from '@/context/user-context';
import { LogOut, User as UserIcon, Settings, Users, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { mockUsers } from '@/lib/data';
import type { UserRole } from '@/lib/types';


export function UserNav() {
  const { userProfile, switchUser } = useUser();
  const router = useRouter();

  if (!userProfile) {
    return null;
  }

  const handleLogout = () => {
    // In a real app, this would sign the user out.
    // For this demo, we'll just go back to the landing page.
    router.push('/');
  };

  const userDisplayName = `${userProfile.firstName} ${userProfile.lastName}`;
  const userFallback = userProfile.firstName.charAt(0);


  return (
    <div className="flex items-center gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src={userProfile.avatar} alt={userDisplayName} />
              <AvatarFallback>{userFallback}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{userDisplayName}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {userProfile.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

       {/* Mock user switcher */}
       <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Users className="h-4 w-4"/>
            <span className="sr-only">Switch User</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel>Switch User Role</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={userProfile.role} onValueChange={(role) => switchUser(role as UserRole)}>
            {Object.values(mockUsers).map(u => (
              <DropdownMenuRadioItem key={u.id} value={u.role}>
                {u.role.charAt(0).toUpperCase() + u.role.slice(1)} ({u.firstName})
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
