
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

export default function TeacherPortalPage() {
    const { user, isUserLoading, userProfile } = useUser();
    const router = useRouter();

    useEffect(() => {
        // If user is loaded and is a teacher, redirect to the main dashboard
        if (!isUserLoading && user && userProfile?.role === 'teacher') {
            router.push('/dashboard');
        }
    }, [user, isUserLoading, userProfile, router]);

    // Show a loading state while checking user status
    if (isUserLoading || (user && userProfile?.role === 'teacher')) {
        return (
            <div className="flex h-screen w-screen items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Logo className="h-48 w-auto animate-pulse" />
                    <p className="text-muted-foreground">Accessing Teacher Portal...</p>
                </div>
            </div>
        );
    }
    
    // If not logged in as a teacher, show the portal entry page
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
            <div className="mb-8 flex items-center gap-2">
                <Logo className="h-10 w-auto" />
                <span className="text-2xl font-bold font-headline">Stoics Educational Institute & Services</span>
            </div>
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Teacher Portal</CardTitle>
                    <CardDescription>
                        Welcome. Please proceed to the teacher login page to access your dashboard.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild className="w-full">
                        <Link href="https://your-teacher-app.example.com" target="_blank">
                            Go to Teacher Workspace
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                     <p className="mt-4 text-center text-sm text-muted-foreground">
                        Not a teacher?{' '}
                        <Button variant="link" className="p-0 h-auto" asChild>
                            <Link href="/">Return to Main Site</Link>
                        </Button>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
