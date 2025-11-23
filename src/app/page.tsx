'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { Mic, Presentation, ShieldCheck } from 'lucide-react';

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
                    <Logo className="h-48 w-auto animate-pulse" />
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col">
            <header className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-2">
                    <Logo className="h-8 w-auto" />
                </div>
                <nav className="flex items-center gap-4">
                    <Button variant="ghost" asChild>
                        <Link href="/teacher-portal">Teacher Portal</Link>
                    </Button>
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
                        Stoics Speech & Reading Institute
                    </h1>
                    <p className="mx-auto mt-4 max-w-[700px] text-lg text-muted-foreground">
                        We are committed to building a community of articulate, confident, and intelligent learners. This opportunity is open to serious students from SS1 to SS3, as well as students in tertiary institutions.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row gap-4">
                        <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
                            <Link href="https://chat.whatsapp.com/LVtJEqZXpgBKNHIU2MPj00?mode=ems_copy_t" target="_blank">
                                <FaWhatsapp className="mr-2 h-5 w-5" />
                                Join WhatsApp Forum
                            </Link>
                        </Button>
                        <Button asChild size="lg" variant="secondary">
                            <Link href="/register">Register on Platform</Link>
                        </Button>
                    </div>
                </section>

                <section className="bg-muted py-20">
                    <div className="container mx-auto px-4 md:px-6">
                        <h2 className="text-3xl font-bold text-center mb-12">Improve Your Skills</h2>
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            <Card>
                                <CardHeader className="items-center text-center">
                                    <div className="bg-primary/10 p-4 rounded-full mb-4">
                                        <Mic className="h-8 w-8 text-primary" />
                                    </div>
                                    <CardTitle>Public Speaking & Debates</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-center text-muted-foreground">Master the art of persuasion and eloquent expression in debates and public forums.</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="items-center text-center">
                                    <div className="bg-primary/10 p-4 rounded-full mb-4">
                                        <Presentation className="h-8 w-8 text-primary" />
                                    </div>
                                    <CardTitle>Academic & Professional Communication</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-center text-muted-foreground">Excel in class presentations, teaching practice, academic writing, and research defence.</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="items-center text-center">
                                     <div className="bg-primary/10 p-4 rounded-full mb-4">
                                        <ShieldCheck className="h-8 w-8 text-primary" />
                                    </div>
                                    <CardTitle>Confidence & Leadership</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-center text-muted-foreground">Build unshakable confidence, command stage presence, and develop effective leadership communication.</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>
                <section className="container mx-auto px-4 py-20 text-center md:px-6">
                     <h2 className="text-2xl font-bold tracking-tight">Join a Community of Excellence</h2>
                     <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                        Students are encouraged to invite their friends, while parents are urged to share this information widely. Together, we can nurture excellence in speech, study, and self-expression.
                    </p>
                </section>
            </main>

            <footer className="bg-foreground text-background">
                <div className="container mx-auto flex flex-col items-center justify-center py-10 text-center">
                    <p className="font-semibold text-lg italic max-w-2xl">"At Stoics, we don’t just teach — we train voices, shape confidence, and inspire greatness."</p>
                    <p className="mt-4 text-sm text-muted-foreground">© Stoics Educational Institute & Services. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
