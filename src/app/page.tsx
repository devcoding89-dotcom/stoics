'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

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
                    <Logo className="h-12 w-auto animate-pulse" />
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }
    
    const collaborativeLearningImage = PlaceHolderImages.find(p => p.id === 'collaborative-learning');
    const unifiedPlatformImage = PlaceHolderImages.find(p => p.id === 'unified-platform');
    const aiPoweredSupportImage = PlaceHolderImages.find(p => p.id === 'ai-powered-support');

    return (
        <div className="flex min-h-screen flex-col">
            <header className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-2">
                    <Logo className="h-8 w-auto" />
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
                    <Logo className="h-48 w-auto mb-6" />
                    <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl font-headline">
                        Stoics Educational Institute & Services
                    </h1>
                    <p className="mx-auto mt-4 max-w-[700px] text-lg text-muted-foreground">
                        A unified platform for students, teachers, and parents to collaborate, learn, and grow together.
                    </p>
                    <Button asChild size="lg" className="mt-8">
                        <Link href="/register">Join Our Community</Link>
                    </Button>
                </section>

                <section className="bg-muted py-20">
                    <div className="container mx-auto grid grid-cols-1 gap-8 px-4 md:grid-cols-3 md:px-6">
                        <Card className="overflow-hidden">
                            {collaborativeLearningImage && (
                                <Image
                                    src={collaborativeLearningImage.imageUrl}
                                    alt="Students collaborating"
                                    width={600}
                                    height={400}
                                    className="w-full h-48 object-cover"
                                    data-ai-hint={collaborativeLearningImage.imageHint}
                                />
                            )}
                            <CardHeader>
                                <CardTitle>Collaborative Learning</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>Engage in a shared learning environment where teachers can create lessons, and students can access materials anytime.</p>
                            </CardContent>
                        </Card>
                        <Card className="overflow-hidden">
                             {unifiedPlatformImage && (
                                <Image
                                    src={unifiedPlatformImage.imageUrl}
                                    alt="Dashboard view"
                                    width={600}
                                    height={400}
                                    className="w-full h-48 object-cover"
                                    data-ai-hint={unifiedPlatformImage.imageHint}
                                />
                            )}
                            <CardHeader>
                                <CardTitle>Unified Platform</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>A single, reliable place for parents to track attendance, manage payments, and communicate with teachers seamlessly.</p>
                            </CardContent>
                        </Card>
                        <Card className="overflow-hidden">
                            {aiPoweredSupportImage && (
                                <Image
                                    src={aiPoweredSupportImage.imageUrl}
                                    alt="AI bot illustration"
                                    width={600}
                                    height={400}
                                    className="w-full h-48 object-cover"
                                    data-ai-hint={aiPoweredSupportImage.imageHint}
                                />
                            )}
                            <CardHeader>
                                <CardTitle>AI-Powered Support</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>Leverage cutting-edge AI for homework help and personalized tutoring, with customizable teacher-led instructions.</p>
                            </CardContent>
                        </Card>
                    </div>
                </section>
            </main>

            <footer className="container mx-auto flex items-center justify-center py-6">
                <p className="text-sm text-muted-foreground">© Stoics Educational Institute & Services. All rights reserved.</p>
            </footer>
        </div>
    );
}
