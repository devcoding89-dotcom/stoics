'use client';
import { useFirebase } from '@/firebase/provider';
import type { User as FirebaseUser } from 'firebase/auth';
import type { User as AppUser } from '@/lib/types';

export interface UseUserHook {
    user: FirebaseUser | null;
    userProfile: AppUser | null;
    isUserLoading: boolean;
}

export function useUser(): UseUserHook {
  const { user, userProfile, isUserLoading } = useFirebase();
  return { user, userProfile, isUserLoading };
};
