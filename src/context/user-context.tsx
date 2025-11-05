'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { User as AppUser, UserRole } from '@/lib/types';
import { mockUsers } from '@/lib/data';
import { useRouter } from 'next/navigation';

interface UserContextType {
  user: AppUser | null; // For demo, user and userProfile are the same
  userProfile: AppUser | null;
  loading: boolean;
  isUserProfileLoading: boolean;
  switchRole: (role: UserRole) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('student');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const userProfile = mockUsers[currentRole];

  const switchRole = (role: UserRole) => {
    setLoading(true);
    setCurrentRole(role);
    // Simulate loading a new dashboard
    setTimeout(() => setLoading(false), 300);
  };
  
  const logout = () => {
    router.push('/');
  };

  const value = {
    user: userProfile,
    userProfile,
    loading,
    isUserProfileLoading: loading,
    switchRole,
    logout,
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
