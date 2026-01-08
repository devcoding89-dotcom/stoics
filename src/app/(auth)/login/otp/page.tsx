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
import { useUser, updateDocumentNonBlocking, errorEmitter, FirestorePermissionError } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

const formSchema = z.object({
  otp: z.string().min(6, 'Your one-time password must be 6 characters.'),
});

// In a real app, this function would be a secure Cloud Function.
// For this prototype, it's an insecure client-side function.
// It finds a user by email, verifies the OTP, and returns a "custom token" (just the UID).
async function verifyOtpAndGetToken(firestore: any, email: string, otp: string): Promise<string> {
    const usersRef = collection(firestore, 'users');
    const q = query(usersRef, where('email', '==', email));
    
    let querySnapshot;
    try {
        querySnapshot = await getDocs(q);
    } catch (serverError) {
        const permissionError = new FirestorePermissionError({
            path: 'users',
            operation: 'list' // This is a query, so it's a 'list' operation.
        });
        errorEmitter.emit('permission-error', permissionError);
        // Re-throw to be caught by the calling function's catch block
        throw permissionError;
    }


    if (querySnapshot.empty) {
        throw new Error('User not found.');
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();
    const userRef = userDoc.ref;

    const now = new Date();
    const otpExpiry = userData.otpExpiry ? new Date(userData.otpExpiry) : new Date(0);

    if (userData.otp !== otp || now > otpExpiry) {
        // Clear the OTP in the database for security
        await updateDocumentNonBlocking(userRef, { otp: null, otpExpiry: null });
        throw new Error('Invalid or Expired OTP. Please try again.');
    }

    // Clear the OTP after successful use
    await updateDocumentNonBlocking(userRef, { otp: null, otpExpiry: null });

    // In a real app, a Cloud Function would generate a JWT. Here, we just return the UID.
    // THIS IS INSECURE FOR PRODUCTION.
    return userDoc.id;
}


function OtpLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  const auth = getAuth();
  const firestore = getFirestore();
  const [isVerifying, setIsVerifying] = useState(false);
  const [loginStatus, setLoginStatus] = useState<'idle' | 'failed' | 'success'>('idle');


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
    setLoginStatus('idle');

    try {
        // This is a placeholder for what would be a Cloud Function call.
        const customToken = await verifyOtpAndGetToken(firestore, email, values.otp);

        // This will fail in production without a backend to generate a real token.
        await signInWithCustomToken(auth, customToken);
        
        // If it somehow succeeds, treat it as a success
        setLoginStatus('success');
        router.push('/dashboard');

    } catch (error: any) {
        if (error.code === 'auth/invalid-custom-token') {
             console.error("signInWithCustomToken failed. This is expected without a real backend token service.", error);
             setLoginStatus('failed');
        } else if (!(error instanceof FirestorePermissionError)) {
            console.error('OTP Verification Error:', error);
            toast({
                title: 'Verification Failed',
                description: error.message || 'An unexpected error occurred.',
                variant: 'destructive',
            });
      }
    } finally {
      setIsVerifying(false);
    }
  };
  
  const renderContent = () => {
    if (loginStatus === 'failed') {
        return (
             <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle>Prototype Feature Notice</AlertTitle>
                <AlertDescription>
                    The email/OTP login is a demonstration feature. In a production app, this step would be handled by a secure backend. For now, please use the primary Google Sign-In method.
                    <Button variant="link" asChild className="p-0 h-auto mt-2">
                        <Link href="/login">Return to Login</Link>
                    </Button>
                </AlertDescription>
            </Alert>
        )
    }
    
    return (
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
    );
  }

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
            {renderContent()}
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
