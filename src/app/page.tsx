
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { Mic, Presentation, ShieldCheck, ArrowRight } from 'lucide-react';
import Image from 'next/image';
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
            <div className="flex h-screen w-screen items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <Logo className="h-24 w-auto animate-pulse" />
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }
    
    const collaborativeLearningImage = PlaceHolderImages.find(p => p.id === 'collaborative-learning');

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
                <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
                    <Link href="/" className="flex items-center gap-2">
                        <Logo className="h-8 w-auto" />
                        <span className="font-bold text-lg hidden sm:inline-block">Stoics Institute</span>
                    </Link>
                    <nav className="flex items-center gap-2">
                        <Button variant="ghost" asChild>
                            <Link href="https://teacher-ashy.vercel.app/login" target="_blank">Teacher Portal</Link>
                        </Button>
                        <Button variant="ghost" asChild>
                            <Link href="/login">Log In</Link>
                        </Button>
                        <Button asChild>
                            <Link href="/register">Sign Up</Link>
                        </Button>
                    </nav>
                </div>
            </header>

            <main className="flex-1">
                <section className="relative py-24 md:py-32 lg:py-40">
                     <div className="absolute inset-0 bg-gradient-to-b from-background to-transparent z-10"></div>
                     <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10"></div>
                    <div className="container mx-auto px-4 md:px-6 text-center z-20 relative">
                        <div className="flex flex-col items-center">
                            <Logo className="h-24 w-auto mb-6" />
                            <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-headline">
                                Stoics Speech & Reading Institute
                            </h1>
                            <p className="mx-auto mt-6 max-w-[700px] text-lg text-muted-foreground md:text-xl">
                                We are committed to building a community of articulate, confident, and intelligent learners. This opportunity is open to serious students from SS1 to SS3, as well as students in tertiary institutions.
                            </p>
                            <div className="mt-8 flex flex-col sm:flex-row gap-4">
                                <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                                    <Link href="https://chat.whatsapp.com/LVtJEqZXpgBKNHIU2MPj00?mode=ems_copy_t" target="_blank">
                                        <FaWhatsapp className="mr-2 h-5 w-5" />
                                        Join WhatsApp Forum
                                    </Link>
                                </Button>
                                <Button asChild size="lg" variant="secondary">
                                    <Link href="/register">
                                        Register on Platform
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-muted py-20 lg:py-24">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="text-center mb-12">
                             <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Improve Your Essential Skills</h2>
                             <p className="mt-4 text-lg text-muted-foreground">We focus on practical skills for academic and professional success.</p>
                        </div>
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            <Card className="transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                                <CardHeader className="items-center text-center p-6">
                                    <div className="bg-primary/10 p-4 rounded-full mb-4">
                                        <Mic className="h-8 w-8 text-primary" />
                                    </div>
                                    <CardTitle>Public Speaking & Debates</CardTitle>
                                </CardHeader>
                                <CardContent className="px-6 pb-6">
                                    <p className="text-center text-muted-foreground">Master the art of persuasion and eloquent expression in debates and public forums.</p>
                                </CardContent>
                            </Card>
                            <Card className="transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                                <CardHeader className="items-center text-center p-6">
                                    <div className="bg-primary/10 p-4 rounded-full mb-4">
                                        <Presentation className="h-8 w-8 text-primary" />
                                    </div>
                                    <CardTitle>Academic & Professional Communication</CardTitle>
                                </CardHeader>
                                <CardContent className="px-6 pb-6">
                                    <p className="text-center text-muted-foreground">Excel in class presentations, teaching practice, academic writing, and research defence.</p>
                                </CardContent>
                            </Card>
                            <Card className="transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                                <CardHeader className="items-center text-center p-6">
                                     <div className="bg-primary/10 p-4 rounded-full mb-4">
                                        <ShieldCheck className="h-8 w-8 text-primary" />
                                    </div>
                                    <CardTitle>Confidence & Leadership</CardTitle>
                                </CardHeader>
                                <CardContent className="px-6 pb-6">
                                    <p className="text-center text-muted-foreground">Build unshakable confidence, command stage presence, and develop effective leadership communication.</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>
                
                 <section className="relative py-20 lg:py-32">
                    {collaborativeLearningImage && (
                         <Image
                            src={collaborativeLearningImage.imageUrl}
                            alt={collaborativeLearningImage.description}
                            fill
                            className="object-cover"
                            data-ai-hint={collaborativeLearningImage.imageHint}
                        />
                    )}
                    <div className="absolute inset-0 bg-black/60"></div>
                    <div className="container relative mx-auto px-4 md:px-6 text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Join a Community of Excellence</h2>
                        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-200">
                            Students are encouraged to invite their friends, while parents are urged to share this information widely. Together, we can nurture excellence in speech, study, and self-expression.
                        </p>
                         <div className="mt-8">
                             <Button asChild size="lg">
                                <Link href="/register">Get Started Today</Link>
                            </Button>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-foreground text-background">
                <div className="container mx-auto flex flex-col items-center justify-center py-10 px-4 text-center">
                    <p className="font-semibold text-lg italic max-w-2xl">"At Stoics, we don’t just teach — we train voices, shape confidence, and inspire greatness."</p>
                    <p className="mt-4 text-sm text-muted-foreground">© {new Date().getFullYear()} Stoics Educational Institute & Services. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
