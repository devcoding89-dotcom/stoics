'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Zap, BrainCircuit } from 'lucide-react';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
    const { user, isUserLoading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!isUserLoading && user) {
            router.push('/dashboard');
        }
    }, [user, isUserLoading, router]);

    if (isUserLoading || user) {
        return (
            <div className="flex h-screen w-screen items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Logo className="h-12 w-12 animate-pulse" />
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col">
            <header className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-2">
                    <Logo className="h-8 w-8" />
                    <span className="text-xl font-bold font-headline">Stoics Educational Services</span>
                </div>
                <nav className="flex items-center gap-4">
                    <Button variant="ghost" asChild>
                        <Link href="/login">Log In</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/register">Sign Up</Link>
                    </Button>
                </nav>
            </header>

            <main className="flex-1">
                <section className="container mx-auto flex flex-col items-center justify-center px-4 py-20 text-center md:px-6 md:py-32">
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline">
                        A Digital Learning Companion
                    </h1>
                    <p className="mx-auto mt-4 max-w-[700px] text-lg text-muted-foreground">
                        Empowering students, teachers, and parents with a unified platform for education management and AI-powered support.
                    </p>
                    <Button asChild size="lg" className="mt-8">
                        <Link href="/register">Get Started Today</Link>
                    </Button>
                </section>

                <section className="bg-muted py-20">
                    <div className="container mx-auto grid grid-cols-1 gap-8 px-4 md:grid-cols-3 md:px-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center gap-4">
                                <div className="rounded-full bg-primary/10 p-3">
                                    <CheckCircle className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle>Stable & Secure</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>Built on a reliable foundation with secure Firebase authentication, ensuring your data is always safe and accessible.</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center gap-4">
                                <div className="rounded-full bg-primary/10 p-3">
                                    <Zap className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle>Ready to Scale</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>A clean and minimal starting point, ready for you to build upon. Add features for lessons, payments, and more.</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center gap-4">
                                <div className="rounded-full bg-primary/10 p-3">
                                    <BrainCircuit className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle>AI-Powered</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>Integrated with cutting-edge AI to provide homework assistance, tutor customization, and future innovations.</p>
                            </CardContent>
                        </Card>
                    </div>
                </section>
            </main>

            <footer className="container mx-auto flex items-center justify-center py-6">
                <p className="text-sm text-muted-foreground">© Stoics Educational Services. All rights reserved.</p>
            </footer>
        </div>
    );
}
