
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
  isUserLoading: boolean; // Combined loading state for both Auth and Firestore user
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
  const [isUserLoading, setIsUserLoading] = useState(true); // Single loading state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in, fetch profile
        const userRef = doc(firestore, 'users', firebaseUser.uid);
        try {
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setUserProfile({ ...userSnap.data(), id: userSnap.id } as AppUser);
          } else {
            // This can happen if user is created in Auth but not Firestore yet.
            console.warn(`No Firestore profile found for user ${firebaseUser.uid}.`);
            setUserProfile(null); 
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setUserProfile(null);
        } finally {
            setUser(firebaseUser);
            setIsUserLoading(false); // Loading is complete after auth check and profile fetch attempt
        }
      } else {
        // No user is signed in
        setUser(null);
        setUserProfile(null);
        setIsUserLoading(false); // Loading is complete
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
  }), [firebaseApp, firestore, auth, user, userProfile, isUserLoading]);

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
  const { user, userProfile, isUserLoading } = useFirebase();
  // We no longer need isUserProfileLoading as it's combined into isUserLoading
  const isUserProfileLoading = isUserLoading; 
  return { user, userProfile, isUserLoading, isUserProfileLoading };
};
