'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
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
import { FcGoogle } from 'react-icons/fc';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const auth = getAuth();
  const firestore = getFirestore();
  const { toast } = useToast();

  useEffect(() => {
    if (user && !isUserLoading) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      const userRef = doc(firestore, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        const [firstName, ...lastName] = (firebaseUser.displayName || '').split(' ');
        const newUserProfile: AppUser = {
          id: firebaseUser.uid,
          firstName: firstName || '',
          lastName: lastName.join(' ') || '',
          email: firebaseUser.email || '',
          role: 'student', 
          avatar: firebaseUser.photoURL || '',
          verified: true,
          language: 'en',
        };
        await setDoc(userRef, newUserProfile);
      }

      router.push('/dashboard');
    } catch (error: any) {
      // Don't show an error if the user closes the popup
      if (error.code === 'auth/popup-closed-by-user') {
        setIsSigningIn(false);
        return;
      }
      
      console.error('Google Sign-In Error:', error);
      toast({
        title: 'Sign-in Failed',
        description: 'Could not sign in with Google. Please try again.',
        variant: 'destructive',
      });
      setIsSigningIn(false);
    }
  };
  
  if (isUserLoading || user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <Logo className="h-12 w-12 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mb-8 flex items-center gap-2">
        <Logo className="h-8 w-8" />
        <span className="text-2xl font-bold font-headline">Stoics Educational Institute & Services</span>
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Sign in to access your dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Button
              variant="outline"
              onClick={handleGoogleSignIn}
              disabled={isSigningIn}
              className="w-full"
            >
              {isSigningIn ? (
                'Redirecting...'
              ) : (
                <>
                  <FcGoogle className="mr-2 h-5 w-5" /> Continue with Google
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      <p className="mt-4 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Button variant="link" className="p-0 h-auto" asChild>
              <Link href="/register">Create one</Link>
          </Button>
      </p>
    </div>
  );
}
