
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
  if (getApps().length > 0) {
    return getSdks(getApp());
  }

  let firebaseApp;
  try {
    // This will work in production with Firebase App Hosting.
    firebaseApp = initializeApp();
  } catch (e) {
    // This is the fallback for local development.
    firebaseApp = initializeApp(firebaseConfig);
  }
  
  return getSdks(firebaseApp);
}

function getSdks(firebaseApp: FirebaseApp) {
  const firestore = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp);
  return {
    firebaseApp,
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

type MemoFirebase <T> = T & {__memo?: boolean};

export function useMemoFirebase<T>(factory: () => T, deps: DependencyList): T | (MemoFirebase<T>) {
  const memoized = useMemo(factory, deps);
  
  if(typeof memoized !== 'object' || memoized === null) return memoized;
  (memoized as MemoFirebase<T>).__memo = true;
  
  return memoized;
}
