
'use client';

import React, { createContext, useContext, ReactNode, useMemo, useState, useEffect } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore, doc, getDoc } from 'firebase/firestore';
import { Auth, User, onAuthStateChanged } from 'firebase/auth';
import type { User as AppUser } from '@/lib/types';

interface FirebaseProviderProps {
  children: ReactNode;
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
}

// This interface defines the shape of the entire context, including services and user state.
export interface FirebaseContextState {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
  user: User | null; // Firebase Auth User
  userProfile: AppUser | null; // Firestore User Profile
  isUserLoading: boolean; // Loading state for Firebase Auth user
  isUserProfileLoading: boolean; // Loading state for Firestore profile
}

// React Context
export const FirebaseContext = createContext<FirebaseContextState | undefined>(undefined);

/**
 * Manages and provides Firebase services and combined user authentication/profile state.
 */
export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({
  children,
  firebaseApp,
  firestore,
  auth,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<AppUser | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true); // For Auth user
  const [isUserProfileLoading, setIsUserProfileLoading] = useState(true); // For Firestore profile

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setIsUserLoading(false); // Auth check is complete

      if (firebaseUser) {
        setIsUserProfileLoading(true);
        const userRef = doc(firestore, 'users', firebaseUser.uid);
        try {
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setUserProfile({ ...userSnap.data(), id: userSnap.id } as AppUser);
          } else {
            // This case can happen if the user record is created in Auth but not in Firestore yet.
            // Or if the user is deleted from Firestore but not Auth.
            console.warn(`No Firestore profile found for user ${firebaseUser.uid}.`);
            setUserProfile(null); 
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setUserProfile(null);
        } finally {
          setIsUserProfileLoading(false); // Profile fetch attempt is complete
        }
      } else {
        // No auth user, so no profile to fetch. Clear all user state.
        setUserProfile(null);
        setIsUserProfileLoading(false); // No profile loading needed.
      }
    });

    return () => unsubscribe(); // Cleanup subscription on component unmount
  }, [auth, firestore]);

  // Memoize the context value to prevent unnecessary re-renders of consuming components
  const contextValue = useMemo((): FirebaseContextState => ({
    firebaseApp,
    firestore,
    auth,
    user,
    userProfile,
    isUserLoading,
    isUserProfileLoading,
  }), [firebaseApp, firestore, auth, user, userProfile, isUserLoading, isUserProfileLoading]);

  return (
    <FirebaseContext.Provider value={contextValue}>
      {children}
    </FirebaseContext.Provider>
  );
};

// Hook to access the entire context state.
export const useFirebase = (): FirebaseContextState => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider.');
  }
  return context;
};

/** Hook to access Firebase Auth instance. */
export const useAuth = (): Auth => {
  const { auth } = useFirebase();
  return auth;
};

/** Hook to access Firestore instance. */
export const useFirestore = (): Firestore => {
  const { firestore } = useFirebase();
  return firestore;
};

/** Hook to access Firebase App instance. */
export const useFirebaseApp = (): FirebaseApp => {
  const { firebaseApp } = useFirebase();
  return firebaseApp;
};

/**
 * Hook specifically for accessing user state (both Auth and Firestore profile).
 * This is the primary hook components should use to get user information.
 */
export const useUser = () => {
  const { user, userProfile, isUserLoading, isUserProfileLoading } = useFirebase();
  return { user, userProfile, isUserLoading, isUserProfileLoading };
};
