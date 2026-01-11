'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/logo';
import { useUser } from '@/firebase';
import { FcGoogle } from 'react-icons/fc';
import { useToast } from '@/hooks/use-toast';
import { sendOtp } from '@/ai/flows/send-otp-flow';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
});

export default function LoginPage() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);
  const auth = getAuth();
  const firestore = getFirestore();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  useEffect(() => {
    if (user && !isUserLoading) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleGoogleSignIn = async () => {
    setIsGoogleSigningIn(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // After successful sign-in, the onAuthStateChanged listener in FirebaseProvider
      // will handle fetching the user profile or determining if it's a new user.
      // The AppLayout will then redirect to the appropriate page (/dashboard or /register/role).
      router.push('/dashboard');

    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        // User closed the popup, do nothing.
        return;
      }
      
      console.error('Google Sign-In Error:', error);
      toast({
        title: 'Sign-in Failed',
        description: 'Could not sign in with Google. Please try again.',
        variant: 'destructive',
      });
    } finally {
        setIsGoogleSigningIn(false);
    }
  };
  
  const onEmailSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSigningIn(true);
    try {
        const usersRef = collection(firestore, 'users');
        const q = query(usersRef, where('email', '==', values.email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            toast({
                title: 'No Account Found',
                description: 'This email is not registered. Please create an account.',
                variant: 'destructive',
            });
            return;
        }
      
      // In a real app, this would send an email. For now, it logs to console.
      await sendOtp({ email: values.email });
      
      toast({
        title: 'Check your console for the OTP',
        description: `We've sent a One-Time Password to the server logs.`,
      });

      // Redirect to the OTP entry page, passing the email as a query parameter
      router.push(`/login/otp?email=${encodeURIComponent(values.email)}`);

    } catch (error: any) {
      console.error('OTP Send Error:', error);
      toast({
        title: 'Failed to Send OTP',
        description: error.message || 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSigningIn(false);
    }
  };

  if (isUserLoading || user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <Logo className="h-12 w-auto animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mb-8 flex items-center gap-2">
        <Logo className="h-8 w-auto" />
        <span className="text-2xl font-bold font-headline">Stoics Educational Institute & Services</span>
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Sign in with Google or your email.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onEmailSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john.doe@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSigningIn}>
                {isSigningIn ? 'Sending OTP...' : 'Continue with Email'}
              </Button>
            </form>
          </Form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={handleGoogleSignIn}
            disabled={isGoogleSigningIn}
            className="w-full"
          >
            {isGoogleSigningIn ? (
              'Redirecting...'
            ) : (
              <>
                <FcGoogle className="mr-2 h-5 w-5" /> Continue with Google
              </>
            )}
          </Button>
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
