'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as FirebaseUser, getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import type { User as AppUser, UserRole } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface UserContextType {
  user: FirebaseUser | null;
  userProfile: AppUser | null;
  isUserLoading: boolean;
  isUserProfileLoading: boolean;
  // Kept for type compatibility, but functionality is removed from demo
  switchRole: (role: UserRole) => void; 
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<AppUser | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [isUserProfileLoading, setIsUserProfileLoading] = useState(true);
  const router = useRouter();
  const auth = getAuth();
  const firestore = getFirestore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setIsUserLoading(false);
      
      if (firebaseUser) {
        setIsUserProfileLoading(true);
        const userRef = doc(firestore, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserProfile(userSnap.data() as AppUser);
        } else {
          setUserProfile(null); // Or handle user creation flow
        }
        setIsUserProfileLoading(false);
      } else {
        setUserProfile(null);
        setIsUserProfileLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth, firestore]);

  const logout = () => {
    signOut(auth).then(() => {
      router.push('/');
    });
  };

  // This function is now a placeholder to satisfy the type.
  // In a real app with role switching for admins, this would have a real implementation.
  const switchRole = (role: UserRole) => {
    console.warn("Role switching is not implemented in the real authentication setup.", role);
  };
  
  const value = {
    user,
    userProfile,
    isUserLoading,
    isUserProfileLoading,
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
