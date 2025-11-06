'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  User as FirebaseUser,
  signInWithCustomToken,
} from 'firebase/auth';
import { doc, getDoc, setDoc, getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/logo';
import { useUser } from '@/firebase';
import type { User as AppUser } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import { FcGoogle } from 'react-icons/fc';
import { useToast } from '@/hooks/use-toast';
import { sendOtp } from '@/ai/flows/send-otp';

type LoginStep = 'start' | 'otp';

export default function LoginPage() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [loginStep, setLoginStep] = useState<LoginStep>('start');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const auth = getAuth();
  const firestore = getFirestore();
  const { toast } = useToast();

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
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      toast({
        title: 'Sign-in Failed',
        description: 'Could not sign in with Google. Please try again.',
        variant: 'destructive',
      });
      setIsSigningIn(false);
    }
  };

  const handleEmailContinue = async () => {
    if (!email) {
      toast({ title: 'Email is required', variant: 'destructive' });
      return;
    }
    setIsSigningIn(true);
    try {
      await sendOtp({ email });
      setLoginStep('otp');
      toast({ title: 'OTP Sent', description: 'Check your console for the OTP.' });
    } catch (error) {
      console.error('OTP Send Error:', error);
      toast({
        title: 'Error',
        description: 'Could not send OTP. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSigningIn(false);
    }
  };
  
  const handleOtpSignIn = async () => {
    if (!otp) {
      toast({ title: 'OTP is required', variant: 'destructive' });
      return;
    }
    setIsSigningIn(true);
    try {
      // In a real app, you would have a backend flow that verifies the OTP
      // and returns a custom token. Here we simulate that.
      // This is insecure and for demonstration ONLY.
      const usersRef = collection(firestore, 'users');
      const q = query(usersRef, where('email', '==', email), where('otp', '==', otp));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error('Invalid OTP or email.');
      }
      
      const userDoc = querySnapshot.docs[0];
      // This part should be a secure backend call that returns a custom token
      const customToken = userDoc.id; // !!INSECURE!! SIMULATING TOKEN = UID

      // In a real app, you'd get this token from your secure backend
      // For the prototype, we are using a simplified, insecure method.
      // We will assume the custom token is the user's UID.
      // A secure implementation requires a Cloud Function.
      
      // Let's find the user by email to get their UID for the "custom token".
      const userQuery = query(collection(firestore, "users"), where("email", "==", email));
      const userQuerySnapshot = await getDocs(userQuery);

      if (userQuerySnapshot.empty) {
          throw new Error("User not found.");
      }
      const userUid = userQuerySnapshot.docs[0].id;
      
      // In a real app, you would generate a real custom token. For now, we simulate this.
      // This is NOT secure and for prototyping only.
      await signInWithCustomToken(auth, userUid);


      router.push('/dashboard');
    } catch (error: any) {
      console.error('OTP Sign-In Error:', error);
      toast({
        title: 'Sign-in Failed',
        description: error.message || 'Invalid OTP. Please try again.',
        variant: 'destructive',
      });
    } finally {
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
        <span className="text-2xl font-bold font-headline">Stoics Educational Services</span>
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {loginStep === 'start' ? 'Welcome Back' : 'Enter Your Code'}
          </CardTitle>
          <CardDescription>
            {loginStep === 'start'
              ? 'Sign in to access your dashboard.'
              : `We sent a code to ${email}. Check your console.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loginStep === 'start' ? (
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

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSigningIn}
                />
              </div>
              <Button onClick={handleEmailContinue} disabled={isSigningIn || !email}>
                {isSigningIn ? 'Sending...' : 'Continue with Email'}
              </Button>

              <Separator />

              <Button onClick={() => router.push('/register')} variant="secondary">
                Create an Account
              </Button>
            </div>
          ) : (
             <div className="flex flex-col gap-4">
                <div className="space-y-2">
                    <Label htmlFor="otp">One-Time Password</Label>
                    <Input 
                        id="otp"
                        type="text"
                        inputMode="numeric"
                        placeholder="123456"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        disabled={isSigningIn}
                    />
                </div>
                <Button onClick={handleOtpSignIn} disabled={isSigningIn || !otp}>
                    {isSigningIn ? 'Verifying...' : 'Sign In'}
                </Button>
                <Button variant="link" onClick={() => setLoginStep('start')}>
                    Use a different email
                </Button>
             </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
