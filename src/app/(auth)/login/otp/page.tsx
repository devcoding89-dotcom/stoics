'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, doc, setDoc, updateDoc } from 'firebase/firestore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/logo';
import { useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

const formSchema = z.object({
  otp: z.string().min(6, 'Your one-time password must be 6 characters.'),
});

function OtpLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  const auth = getAuth();
  const firestore = getFirestore();
  const [isVerifying, setIsVerifying] = useState(false);

  // Get email from query parameter
  const email = searchParams.get('email');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: '',
    },
  });

  // Redirect if user is already logged in or if email is missing
  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
    if (!email) {
      toast({
        title: 'Error',
        description: 'No email address was provided. Please start the login process again.',
        variant: 'destructive',
      });
      router.push('/login');
    }
  }, [user, isUserLoading, router, email, toast]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!email) return;
    setIsVerifying(true);

    try {
      // Find the user by email
      const usersRef = collection(firestore, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error('User not found.');
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      const userRef = userDoc.ref;

      // Check if OTP matches and is not expired
      const now = new Date();
      const otpExpiry = userData.otpExpiry ? new Date(userData.otpExpiry) : new Date(0);

      if (userData.otp !== values.otp || now > otpExpiry) {
        toast({
          title: 'Invalid or Expired OTP',
          description: 'The OTP you entered is incorrect or has expired. Please try again.',
          variant: 'destructive',
        });
        // Optionally, clear the OTP in the database
        await updateDoc(userRef, { otp: null, otpExpiry: null });
        setIsVerifying(false);
        return;
      }
      
      // In a real secure app, you'd call a Cloud Function to generate a custom token.
      // We will simulate this by directly creating the token here, which is INSECURE for production.
      // This is a placeholder for the backend logic.
      // The `signInWithCustomToken` requires a backend-signed JWT, not just the UID.
      // For this prototype, we'll just log the user in by confirming the OTP and then redirecting.
      // This is NOT real authentication but a simulation.
      console.log(`Simulating login for user: ${userDoc.id}`);
      
      // Clear the OTP after successful use
      await updateDoc(userRef, { otp: null, otpExpiry: null });

      // IMPORTANT: The following is a workaround for prototyping.
      // A real app must use a backend to create a custom token.
      // We will pretend to sign in and manually navigate.
      // This will not create a real Firebase auth session.
      // The user will be redirected to the dashboard, and the useUser hook will eventually fail.
      // This demonstrates the UI flow. A backend is needed for a full implementation.
      
      // TODO: Replace this with a call to a Cloud Function that returns a custom token
      // e.g., const { token } = await generateCustomToken({ uid: userDoc.id });
      // await signInWithCustomToken(auth, token);
      
      toast({
        title: 'Login Successful (Simulated)',
        description: 'You will be redirected to the dashboard. Note: This is a prototype and not a real session.',
      });

      // Manually force-navigate. This won't work perfectly without real auth.
      // We push to login first to clear state, then to dashboard.
      router.push('/login?simulated=true');

    } catch (error: any) {
      console.error('OTP Verification Error:', error);
      toast({
        title: 'Verification Failed',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  if (isUserLoading || !email) {
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
          <CardTitle className="text-2xl">Enter Your Code</CardTitle>
          <CardDescription>
            A 6-digit code was logged to the server console. Check the logs and enter it below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>One-Time Password</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup className="w-full justify-center">
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isVerifying}>
                {isVerifying ? 'Verifying...' : 'Verify & Sign In'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Didn&apos;t get a code?{' '}
        <Button variant="link" className="p-0 h-auto" asChild>
          <Link href="/login">Go back and try again</Link>
        </Button>
      </p>
    </div>
  );
}


// Wrap the page in a Suspense boundary because useSearchParams() requires it.
export default function OtpPageWrapper() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <OtpLoginPage />
        </Suspense>
    )
}
