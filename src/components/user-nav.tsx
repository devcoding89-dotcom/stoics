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
} from '@/components/ui/dropdown-menu';
import { useUser } from '@/firebase';
import { LogOut, Settings } from 'lucide-react';
import Link from 'next/link';
import { getAuth, signOut } from 'firebase/auth';

export function UserNav() {
  const { user, userProfile } = useUser();
  const auth = getAuth();

  if (!user || !userProfile) {
    return null;
  }

  const userDisplayName = userProfile.firstName ? `${userProfile.firstName} ${userProfile.lastName}` : user.displayName || 'User';
  const userFallback = userProfile.firstName ? userProfile.firstName.charAt(0) : user.displayName?.charAt(0) || 'U';
  const userAvatar = userProfile.avatar || user.photoURL;

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <div className="flex items-center gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src={userAvatar || undefined} alt={userDisplayName || 'User'} />
              <AvatarFallback>{userFallback}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{userDisplayName}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {userProfile.email || user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <Link href="/settings" passHref>
              <DropdownMenuItem asChild>
                <span>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </span>
              </DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
