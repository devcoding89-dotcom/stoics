'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuth, useFirestore, useUser as useFirebaseAuthUser } from '@/firebase';
import { doc, getDoc, setDoc, DocumentData, serverTimestamp } from 'firebase/firestore';
import type { User as AppUser, UserRole } from '@/lib/types';
import type { User as FirebaseUser } from 'firebase/auth';

interface UserContextType {
  user: FirebaseUser | null;
  userProfile: AppUser | null;
  loading: boolean;
  switchUser: (role: UserRole) => void; // Will be a no-op in real auth
  isUserProfileLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// A mapping from the first user of a certain role to a specific user ID.
// This is a temporary solution to allow role switching in a demo environment with real auth.
// In a real production app, a user would have one and only one role.
const roleToFixedUserId: Record<UserRole, string> = {
  student: 'user-student-1',
  teacher: 'user-teacher-1',
  parent: 'user-parent-1',
  admin: 'user-admin-1',
};


export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isUserLoading: isAuthLoading, userError } = useFirebaseAuthUser();
  const firestore = useFirestore();
  const auth = useAuth();
  
  const [userProfile, setUserProfile] = useState<AppUser | null>(null);
  const [isUserProfileLoading, setIsUserProfileLoading] = useState(true);
  
  // This state will track the "assumed" role for the demo.
  const [assumedRole, setAssumedRole] = useState<UserRole>('student');

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
          const profile = docSnap.data() as AppUser;
          // Set the assumed role from the stored profile on first load
          setAssumedRole(profile.role);
          setUserProfile(profile);
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
          setAssumedRole(newUserProfile.role);
        }
      } catch (error) {
        console.error("Error fetching/creating user profile:", error);
        // Handle error appropriately
      } finally {
        setIsUserProfileLoading(false);
      }
    };

    fetchOrCreateUserProfile(user);

  }, [user, isAuthLoading, firestore, auth]);

  const switchUser = useCallback((role: UserRole) => {
    if (userProfile) {
        // In a real app, you wouldn't switch roles like this.
        // This is a demo-specific feature.
        // We'll update the role in the user's profile for this session.
        setUserProfile(prev => prev ? { ...prev, role } : null);
        setAssumedRole(role);
    }
  }, [userProfile]);
  
  const loading = isAuthLoading || isUserProfileLoading;

  // We modify the userProfile to reflect the assumed role for the demo
  const displayedProfile = userProfile ? { ...userProfile, role: assumedRole } : null;

  const value = {
    user,
    userProfile: displayedProfile,
    loading,
    isUserProfileLoading,
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
