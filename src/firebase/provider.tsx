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

export interface FirebaseContextState {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
  user: User | null;
  userProfile: AppUser | null;
  isUserLoading: boolean; // Tracks Firebase Auth state loading
  isUserProfileLoading: boolean; // Tracks Firestore profile loading
}

export const FirebaseContext = createContext<FirebaseContextState | undefined>(undefined);

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({
  children,
  firebaseApp,
  firestore,
  auth,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<AppUser | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true); // Auth loading
  const [isUserProfileLoading, setIsUserProfileLoading] = useState(true); // Profile loading

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsUserLoading(true); // Start auth loading
      setIsUserProfileLoading(true); // Start profile loading

      if (firebaseUser) {
        setUser(firebaseUser);
        const userRef = doc(firestore, 'users', firebaseUser.uid);
        try {
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setUserProfile({ ...userSnap.data(), id: userSnap.id } as AppUser);
          } else {
            console.warn(`No Firestore profile found for user ${firebaseUser.uid}.`);
            setUserProfile(null); 
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setUserProfile(null);
        } finally {
            setIsUserProfileLoading(false); // Profile loading finished
        }
      } else {
        setUser(null);
        setUserProfile(null);
        setIsUserProfileLoading(false); // No profile to load
      }
      setIsUserLoading(false); // Auth loading finished
    });

    return () => unsubscribe();
  }, [auth, firestore]);

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

export const useFirebase = (): FirebaseContextState => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider.');
  }
  return context;
};

export const useAuth = (): Auth => {
  const { auth } = useFirebase();
  return auth;
};

export const useFirestore = (): Firestore => {
  const { firestore } = useFirebase();
  return firestore;
};

export const useFirebaseApp = (): FirebaseApp => {
  const { firebaseApp } = useFirebase();
  return firebaseApp;
};

export const useUser = () => {
  const { user, userProfile, isUserLoading, isUserProfileLoading } = useFirebase();
  return { user, userProfile, isUserLoading, isUserProfileLoading };
};
