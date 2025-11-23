'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { doc } from 'firebase/firestore';
import { useUser, useFirestore, updateDocumentNonBlocking } from '@/firebase';
import { useToast } from '@/hooks/use-toast';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Camera, Check, ShieldCheck } from 'lucide-react';
import { Logo } from '@/components/logo';

export default function VerifyPage() {
  const { user, userProfile } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Request camera permission on component mount
  useEffect(() => {
    async function getCameraPermission() {
      if (typeof navigator.mediaDevices?.getUserMedia !== 'function') {
        setHasCameraPermission(false);
        toast({
          title: 'Unsupported Browser',
          description: 'Your browser does not support video streaming.',
          variant: 'destructive',
        });
        return;
      }
      
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
      }
    }
    getCameraPermission();
    
    // Cleanup function to stop the stream
    return () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }

  }, [toast]);
  
  // Redirect if user is not a teacher or is already verified
  useEffect(() => {
      if (userProfile && (userProfile.role !== 'teacher' || userProfile.verified)) {
          router.push('/dashboard');
      }
  }, [userProfile, router]);


  const handleVerification = () => {
    if (!user || !firestore) {
      toast({ title: 'Error', description: 'User not found.', variant: 'destructive' });
      return;
    }
    setIsVerifying(true);

    const userRef = doc(firestore, 'users', user.uid);
    // The non-blocking update handles emitting permission errors.
    // We can use a .then() here to know when the local cache is updated to give user feedback.
    updateDocumentNonBlocking(userRef, { verified: true })
      .then(() => {
        toast({
          title: 'Verification Complete!',
          description: 'Your account has been verified. Redirecting...',
        });
        
        // Redirect after a short delay to allow the toast to be seen.
        setTimeout(() => {
            router.push('/dashboard');
        }, 2000);
      })
      .catch((error) => {
        // This catch will now only be triggered by non-permission errors,
        // as permission errors are handled globally.
        console.error('An unexpected error occurred during verification:', error);
      })
      .finally(() => {
        setIsVerifying(false);
      });
  };
  
  if (!userProfile) {
    return (
       <div className="flex h-screen w-screen items-center justify-center">
         <div className="flex flex-col items-center gap-4">
           <Logo className="h-12 w-auto animate-pulse" />
           <p className="text-muted-foreground">Loading...</p>
         </div>
       </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <PageHeader
        title="Teacher Verification"
        description="Please complete this one-time verification to access teacher features."
      />
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
             <ShieldCheck className="h-8 w-8 text-primary" />
             <div>
                <CardTitle>Identity Verification (Prototype)</CardTitle>
                <CardDescription>
                    Position your face in the camera frame to simulate verification.
                </CardDescription>
             </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              autoPlay
              muted
              playsInline
            />
            <div className="absolute inset-0 flex items-center justify-center">
                {hasCameraPermission === null && <p className="text-muted-foreground">Requesting camera access...</p>}
                {hasCameraPermission === false && (
                    <div className="flex flex-col items-center gap-2 text-destructive p-4 bg-background/80 rounded-md">
                        <Camera className="h-8 w-8" />
                        <p className="font-semibold">Camera Access Denied</p>
                        <p className="text-center text-sm">Please enable camera permissions in your browser settings.</p>
                    </div>
                )}
            </div>
          </div>
          
          <Button 
            onClick={handleVerification} 
            disabled={!hasCameraPermission || isVerifying} 
            className="w-full"
            size="lg"
          >
            {isVerifying ? (
                'Verifying...'
            ) : (
                <>
                    <Check className="mr-2 h-5 w-5" />
                    Complete Verification
                </>
            )}
          </Button>

          <Alert variant={hasCameraPermission ? 'default' : 'destructive'}>
            <Camera className="h-4 w-4" />
            <AlertTitle>
              {hasCameraPermission ? 'Camera Access Enabled' : 'Camera Access Required'}
            </AlertTitle>
            <AlertDescription>
                {hasCameraPermission ? 
                    'Your camera is active for verification.' : 
                    'This feature requires camera access. Please allow it in your browser.'
                }
            </AlertDescription>
          </Alert>

          <p className="text-xs text-center text-muted-foreground pt-4">
            This is a prototype feature. In a real application, this step would involve a secure, automated face verification process to confirm your identity against a provided document. For this demo, simply enabling your camera and clicking the button is sufficient.
          </p>

        </CardContent>
      </Card>
    </div>
  );
}
