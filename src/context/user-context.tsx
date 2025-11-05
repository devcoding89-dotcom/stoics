'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, ReactNode } from 'react';
import { useAuth, useFirestore } from '@/firebase';
import { User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import type { User } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface UserContextType {
  user: FirebaseUser | null;
  userProfile: User | null;
  loading: boolean;
  error: Error | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const auth = useAuth();
  const firestore = useFirestore();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!auth || !firestore) return;

    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        setUser(firebaseUser);
        const userRef = doc(firestore, 'users', firebaseUser.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          setUserProfile(docSnap.data() as User);
        } else {
          // Create a new user profile if it doesn't exist
          const [firstName, ...lastName] = (firebaseUser.displayName || 'New User').split(' ');
          const newUserProfile: User = {
            id: firebaseUser.uid,
            firstName: firstName,
            lastName: lastName.join(' '),
            email: firebaseUser.email || '',
            role: 'student', // Default role
            avatar: firebaseUser.photoURL || `https://i.pravatar.cc/150?u=${firebaseUser.uid}`,
          };
          try {
            await setDoc(userRef, newUserProfile);
            setUserProfile(newUserProfile);
          } catch (e) {
             console.error("Error creating user profile:", e);
             setError(e as Error);
          }
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    }, (error) => {
      console.error("Auth state change error:", error);
      setError(error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, firestore, router]);

  const value = useMemo(() => ({
    user,
    userProfile,
    loading,
    error,
  }), [user, userProfile, loading, error]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
