'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { mockUsers } from '@/lib/data';
import type { User, UserRole } from '@/lib/types';

interface UserContextType {
  userProfile: User | null;
  loading: boolean;
  switchUser: (role: UserRole) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('student');

  const userProfile = mockUsers[currentUserRole];

  const switchUser = useCallback((role: UserRole) => {
    setLoading(true);
    setCurrentUserRole(role);
    // Simulate loading delay
    setTimeout(() => setLoading(false), 300);
  }, []);

  const value = {
    userProfile,
    loading,
    switchUser
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
