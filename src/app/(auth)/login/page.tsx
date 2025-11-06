'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc, getFirestore } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Logo } from '@/components/logo';
import { useUser } from '@/firebase';
import type { User as AppUser } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import { FcGoogle } from 'react-icons/fc';

export default function LoginPage() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const auth = getAuth();
  const firestore = getFirestore();

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      // Check if user exists in Firestore, if not, create a new entry
      const userRef = doc(firestore, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        const [firstName, ...lastName] = (firebaseUser.displayName || '').split(' ');
        const newUserProfile: AppUser = {
          id: firebaseUser.uid,
          firstName: firstName || '',
          lastName: lastName.join(' ') || '',
          email: firebaseUser.email || '',
          role: 'student', // Default role
          avatar: firebaseUser.photoURL || '',
          verified: true, // Auto-verified with Google
          language: 'en', // Default language
        };
        await setDoc(userRef, newUserProfile);
      }

      router.push('/dashboard');
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      setIsSigningIn(false);
    }
  };
  
  if (isUserLoading || user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <Logo className="h-12 w-12 animate-pulse" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mb-8 flex items-center gap-2">
        <Logo className="h-8 w-8" />
        <span className="text-2xl font-bold font-headline">Stoics Educational Services</span>
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to access your dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Button
              variant="outline"
              onClick={handleGoogleSignIn}
              disabled={isSigningIn}
              className="w-full"
            >
              {isSigningIn ? (
                'Signing in...'
              ) : (
                <>
                  <FcGoogle className="mr-2 h-5 w-5" /> Continue with Google
                </>
              )}
            </Button>
            
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or</span>
                </div>
            </div>

            <Button onClick={() => router.push('/register')} variant="secondary">
              Create an Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

    