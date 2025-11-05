'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth, useFirestore, useUser as useFirebaseAuthUser } from '@/firebase';
import { doc, getDoc, setDoc, DocumentData, serverTimestamp } from 'firebase/firestore';
import type { User as AppUser, UserRole } from '@/lib/types';
import type { User as FirebaseUser } from 'firebase/auth';

interface UserContextType {
  user: FirebaseUser | null;
  userProfile: AppUser | null;
  loading: boolean;
  isUserProfileLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isUserLoading: isAuthLoading } = useFirebaseAuthUser();
  const firestore = useFirestore();
  const auth = useAuth();
  
  const [userProfile, setUserProfile] = useState<AppUser | null>(null);
  const [isUserProfileLoading, setIsUserProfileLoading] = useState(true);

  useEffect(() => {
    if (isAuthLoading || !auth) return;

    if (!user) {
      setUserProfile(null);
      setIsUserProfileLoading(false);
      return;
    }

    const fetchOrCreateUserProfile = async (firebaseUser: FirebaseUser) => {
      if (!firestore) return;
      setIsUserProfileLoading(true);

      const userRef = doc(firestore, 'users', firebaseUser.uid);
      
      try {
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          setUserProfile(docSnap.data() as AppUser);
        } else {
          // User is new, create a profile.
          const [firstName, ...lastNameParts] = (firebaseUser.displayName || 'New User').split(' ');
          const lastName = lastNameParts.join(' ');

          const newUserProfile: AppUser = {
            id: firebaseUser.uid,
            firstName,
            lastName,
            email: firebaseUser.email || '',
            role: 'student', // Default role for new users
            avatar: firebaseUser.photoURL || `https://i.pravatar.cc/150?u=${firebaseUser.uid}`,
          };
          
          await setDoc(userRef, { ...newUserProfile, createdAt: serverTimestamp() });
          
          setUserProfile(newUserProfile);
        }
      } catch (error) {
        console.error("Error fetching/creating user profile:", error);
      } finally {
        setIsUserProfileLoading(false);
      }
    };

    fetchOrCreateUserProfile(user);

  }, [user, isAuthLoading, firestore, auth]);
  
  const loading = isAuthLoading || isUserProfileLoading;

  const value = {
    user,
    userProfile,
    loading,
    isUserProfileLoading,
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
