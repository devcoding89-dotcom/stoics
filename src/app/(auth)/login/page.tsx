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
import { doc, getDoc, setDoc, getFirestore, collection, query, where, getDocs, serverTimestamp, updateDoc } from 'firebase/firestore';

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

// In a real app, this would be a backend call to a secure cloud function
async function getCustomTokenForUser(uid: string): Promise<string> {
    // !! SIMULATION ONLY !!
    // This is NOT secure. In a real application, this function would be
    // a server-side Cloud Function that uses the Firebase Admin SDK
    // to create a custom token for the user.
    // The client would call this function, and the function would return
    // the token.
    console.warn("INSECURE: Generating custom token on the client. This is for prototyping only.");
    // In a real app, you would not return the UID as the token.
    // This is a placeholder for the custom token.
    // For the purpose of this prototype, we return the UID to make signInWithCustomToken work,
    // as it expects a valid JWT format, but for this prototype, we're bypassing real token generation.
    // A real implementation requires a backend.
    
    // This is a simplified "fake" token for client-side prototyping.
    const header = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ uid: uid, iat: Math.floor(Date.now() / 1000) }));
    return `${header}.${payload}.`;
}

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
    } catch (error: any) {
      console.error('OTP Send Error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Could not send OTP. Please check if the user exists.',
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
        const usersRef = collection(firestore, 'users');
        const q = query(usersRef, where('email', '==', email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            throw new Error('User with this email does not exist.');
        }
        
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data() as AppUser;
        const now = new Date();

        if (userData.otp !== otp) {
            throw new Error('Invalid OTP. Please try again.');
        }

        if (userData.otpExpiry && new Date(userData.otpExpiry.seconds * 1000) < now) {
            throw new Error('OTP has expired. Please request a new one.');
        }
        
        const customToken = await getCustomTokenForUser(userDoc.id);
        
        await signInWithCustomToken(auth, customToken);

        await updateDoc(userDoc.ref, {
            otp: null,
            otpExpiry: null
        });

        router.push('/dashboard');
    } catch (error: any) {
      console.error('OTP Sign-In Error:', error);
      toast({
        title: 'Sign-in Failed',
        description: error.message || 'An unexpected error occurred.',
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
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or</span>
                </div>
              </div>

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
      {loginStep === 'start' && (
        <p className="mt-4 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Button variant="link" className="p-0 h-auto" asChild>
                <a href="/register">Create one</a>
            </Button>
        </p>
      )}
    </div>
  );
}
