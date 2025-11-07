
'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { useMemo, type DependencyList } from 'react';

// IMPORTANT: This file is now responsible for initializing Firebase.
// It creates a singleton instance of the Firebase services that is shared
// across the entire application. This is critical to prevent race conditions
// and internal errors from the Firebase SDK, especially in development with hot-reloading.

function initializeFirebase() {
  const apps = getApps();
  if (apps.length > 0) {
    return getSdks(apps[0]); // Return existing app instance
  }
  
  // In a production App Hosting environment, the config is automatically provided.
  // In local dev, we fall back to our explicit config file.
  let app: FirebaseApp;
  try {
     app = initializeApp();
  } catch (e) {
     app = initializeApp(firebaseConfig);
  }

  return getSdks(app);
}

function getSdks(app: FirebaseApp) {
  const firestore = getFirestore(app);
  const auth = getAuth(app);
  return {
    firebaseApp: app,
    auth,
    firestore
  };
}

// Initialize and export the Firebase services as singletons.
export const { firebaseApp, auth, firestore } = initializeFirebase();

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './auth/use-user';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';

// This import was causing a circular dependency. 
// The useSidebar hook is now imported directly in the layout file where it's used.
// export * from '@/components/ui/sidebar';

type MemoFirebase <T> = T & {__memo?: boolean};

export function useMemoFirebase<T>(factory: () => T, deps: DependencyList): T | (MemoFirebase<T>) {
  const memoized = useMemo(factory, deps);
  
  if(typeof memoized !== 'object' || memoized === null) return memoized;
  (memoized as MemoFirebase<T>).__memo = true;
  
  return memoized;
}
