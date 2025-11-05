'use client';

import type { User, UserRole } from '@/lib/types';
import { mockUsers } from '@/lib/data';
import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';

type UserContextType = {
  user: User;
  setUser: (role: UserRole) => void;
  roles: UserRole[];
};

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(mockUsers.student);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const roles = Object.keys(mockUsers) as UserRole[];

  const setUser = (role: UserRole) => {
    setCurrentUser(mockUsers[role]);
  };

  const value = useMemo(() => ({
    user: currentUser,
    setUser,
    roles,
  }), [currentUser]);

  if (!isMounted) {
    return null;
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
