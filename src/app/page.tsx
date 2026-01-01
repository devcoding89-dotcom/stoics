
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { Mic, Presentation, ShieldCheck, ArrowRight, UserPlus, BookOpen, Users, Star, MessageCircleQuestion } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

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
                                We are dedicated to developing confident, articulate speakers and skilled readers. Our institute provides a supportive learning environment for students and learners worldwide who want to improve communication, reading fluency, and self-expression.
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
                             <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">We focus on practical, real-world skills that are essential for academic excellence, professional success, and personal development. Our programs are designed to build a strong foundation for lifelong learning.</p>
                        </div>
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            <Card className="transform transition-transform duration-300 hover:scale-105 hover:shadow-xl flex flex-col">
                                <CardHeader className="items-center text-center p-6">
                                    <div className="bg-primary/10 p-4 rounded-full mb-4">
                                        <Mic className="h-8 w-8 text-primary" />
                                    </div>
                                    <CardTitle>Public Speaking & Debates</CardTitle>
                                </CardHeader>
                                <CardContent className="px-6 pb-6 flex-grow">
                                    <p className="text-center text-muted-foreground">Master the art of persuasion and eloquent expression. We guide students in structuring compelling arguments, articulating ideas with clarity, and engaging any audience with confidence. Our debate program sharpens critical thinking and quick reasoning, preparing learners for academic forums and public stages.</p>
                                </CardContent>
                            </Card>
                            <Card className="transform transition-transform duration-300 hover:scale-105 hover:shadow-xl flex flex-col">
                                <CardHeader className="items-center text-center p-6">
                                    <div className="bg-primary/10 p-4 rounded-full mb-4">
                                        <Presentation className="h-8 w-8 text-primary" />
                                    </div>
                                    <CardTitle>Academic & Professional Communication</CardTitle>
                                </CardHeader>
                                <CardContent className="px-6 pb-6 flex-grow">
                                    <p className="text-center text-muted-foreground">Excel in high-stakes communication scenarios. From classroom presentations and teaching practice to defending a research thesis, we provide the tools to convey complex information effectively. Our curriculum focuses on clarity, professionalism, and audience-centric messaging for success in any academic or professional environment.</p>
                                </CardContent>
                            </Card>
                            <Card className="transform transition-transform duration-300 hover:scale-105 hover:shadow-xl flex flex-col">
                                <CardHeader className="items-center text-center p-6">
                                     <div className="bg-primary/10 p-4 rounded-full mb-4">
                                        <ShieldCheck className="h-8 w-8 text-primary" />
                                    </div>
                                    <CardTitle>Confidence & Leadership</CardTitle>
                                </CardHeader>
                                <CardContent className="px-6 pb-6 flex-grow">
                                    <p className="text-center text-muted-foreground">Develop the unshakable self-confidence that defines effective leaders. Our programs help learners command stage presence, manage public speaking anxiety, and cultivate a communication style that inspires and influences. We believe that true leadership begins with the ability to express oneself with conviction and grace.</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>
                
                <section className="py-20 lg:py-24">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                             <div>
                                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Our Educational Philosophy</h2>
                                <p className="mt-4 text-lg text-muted-foreground">At the Stoics Speech & Reading Institute, we believe that true education transcends rote memorization. Our philosophy is rooted in the timeless principles of critical thinking, personal virtue, and articulate expression. We don't just teach skills; we cultivate habits of mind that empower our students to navigate a complex world with wisdom and resilience.</p>
                                <p className="mt-4 text-muted-foreground">Our curriculum is designed to be interactive and practical. We emphasize learning through doing, with a focus on real-world application. Whether it's through structured debates, presentation workshops, or collaborative reading sessions, our goal is to build a student's confidence from the inside out, so that clear communication becomes second nature.</p>
                                <Button asChild className="mt-6">
                                    <Link href="/register">Learn More & Register</Link>
                                </Button>
                            </div>
                            <div className="hidden md:block">
                                <Image
                                    src="https://picsum.photos/seed/philosophy/600/400"
                                    alt="A library with books, symbolizing knowledge and philosophy"
                                    width={600}
                                    height={400}
                                    className="rounded-lg shadow-xl"
                                    data-ai-hint="library books"
                                />
                            </div>
                        </div>
                    </div>
                </section>
                
                <section className="bg-muted py-20 lg:py-24">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="text-center mb-12">
                             <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How It Works</h2>
                             <p className="mt-4 text-lg text-muted-foreground">Getting started on your journey to confident communication is simple.</p>
                        </div>
                        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 text-center">
                            <div className="flex flex-col items-center gap-4">
                                <div className="bg-primary/10 p-4 rounded-full">
                                    <UserPlus className="h-10 w-10 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold">1. Create Your Account</h3>
                                <p className="text-muted-foreground">Complete our simple registration form in just a few minutes. This gives you immediate access to our digital platform, where you can view course materials, track your progress, and manage your schedule.</p>
                            </div>
                            <div className="flex flex-col items-center gap-4">
                                <div className="bg-primary/10 p-4 rounded-full">
                                    <BookOpen className="h-10 w-10 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold">2. Access Learning Materials</h3>
                                <p className="text-muted-foreground">Once registered, you can explore a rich library of lessons, video tutorials, practice exercises, and reading guides. All materials are designed by expert educators to be engaging and effective.</p>
                            </div>
                            <div className="flex flex-col items-center gap-4">
                                <div className="bg-primary/10 p-4 rounded-full">
                                    <Users className="h-10 w-10 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold">3. Join the Community</h3>
                                <p className="text-muted-foreground">Connect with fellow learners, mentors, and educators in our exclusive WhatsApp forum. It's a place to share insights, ask questions, and practice your skills in a supportive environment.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-20 lg:py-24">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="text-center mb-12">
                             <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">What Our Students Say</h2>
                             <p className="mt-4 text-lg text-muted-foreground">We're proud to have helped learners from all over the world find their voice.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                             <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center mb-4">
                                        <div className="flex text-yellow-400">
                                            <Star className="h-5 w-5 fill-current" /><Star className="h-5 w-5 fill-current" /><Star className="h-5 w-5 fill-current" /><Star className="h-5 w-5 fill-current" /><Star className="h-5 w-5 fill-current" />
                                        </div>
                                    </div>
                                    <blockquote className="text-muted-foreground">"The public speaking module was a game-changer for me. I went from being terrified of presentations to actually enjoying them. The instructors were incredibly supportive."</blockquote>
                                    <p className="font-semibold mt-4">Jane D.</p>
                                    <p className="text-sm text-muted-foreground">University Student</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center mb-4">
                                        <div className="flex text-yellow-400">
                                            <Star className="h-5 w-5 fill-current" /><Star className="h-5 w-5 fill-current" /><Star className="h-5 w-5 fill-current" /><Star className="h-5 w-5 fill-current" /><Star className="h-5 w-5 fill-current" />
                                        </div>
                                    </div>
                                    <blockquote className="text-muted-foreground">"I enrolled my son to help with his reading fluency, and the improvement has been remarkable. He's more confident and engaged in his schoolwork. Highly recommended."</blockquote>
                                    <p className="font-semibold mt-4">Samuel B.</p>
                                    <p className="text-sm text-muted-foreground">Parent</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center mb-4">
                                        <div className="flex text-yellow-400">
                                            <Star className="h-5 w-5 fill-current" /><Star className="h-5 w-5 fill-current" /><Star className="h-5 w-5 fill-current" /><Star className="h-5 w-5 fill-current" /><Star className="h-5 w-5 fill-current" />
                                        </div>
                                    </div>
                                    <blockquote className="text-muted-foreground">"As a professional, clear communication is everything. The skills I learned here have directly contributed to my career advancement. The curriculum is practical and effective."</blockquote>
                                    <p className="font-semibold mt-4">Fatima K.</p>
                                    <p className="text-sm text-muted-foreground">Marketing Manager</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>
                
                 <section className="bg-muted py-20 lg:py-24">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="text-center mb-12">
                             <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
                                <MessageCircleQuestion className="h-10 w-10 text-primary" />
                            </div>
                             <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Frequently Asked Questions</h2>
                             <p className="mt-4 text-lg text-muted-foreground">Have questions? We have answers.</p>
                        </div>
                        <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
                          <AccordionItem value="item-1">
                            <AccordionTrigger>Who is this program for?</AccordionTrigger>
                            <AccordionContent>
                              Our programs are designed for a wide range of learners, including primary and secondary school students, university students, and professionals. Anyone looking to improve their public speaking, reading fluency, and overall communication skills will benefit.
                            </AccordionContent>
                          </AccordionItem>
                          <AccordionItem value="item-2">
                            <AccordionTrigger>Are the classes online or in-person?</AccordionTrigger>
                            <AccordionContent>
                              Currently, our platform provides digital learning materials and access to a supportive online community. While some programs may include live online sessions, our core offering is self-paced with community support.
                            </AccordionContent>
                          </AccordionItem>
                          <AccordionItem value="item-3">
                            <AccordionTrigger>What is the cost of registration?</AccordionTrigger>
                            <AccordionContent>
                              Registration on our platform is free. This gives you access to introductory materials and our community forums. Specific courses, advanced workshops, and one-on-one coaching sessions are available as paid services. You can view payment requests from your teacher in your dashboard.
                            </AccordionContent>
                          </AccordionItem>
                           <AccordionItem value="item-4">
                            <AccordionTrigger>How do I join the WhatsApp community?</AccordionTrigger>
                            <AccordionContent>
                              You can join our global WhatsApp community forum by clicking the "Join WhatsApp Forum" button on our homepage. It's a great place to connect with other learners and get quick answers to questions.
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
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
                <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 py-12 px-4 md:px-6">
                    <div>
                        <h4 className="font-bold text-lg mb-4">About Stoics Institute</h4>
                         <p className="text-sm text-muted-foreground">We are a global institution dedicated to developing confident speakers and skilled readers through practical, principles-based education.</p>
                    </div>
                     <div>
                        <h4 className="font-bold text-lg mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/register" className="text-muted-foreground hover:text-background">Register</Link></li>
                            <li><Link href="/login" className="text-muted-foreground hover:text-background">Login</Link></li>
                            <li><Link href="https://teacher-ashy.vercel.app/login" target="_blank" className="text-muted-foreground hover:text-background">Teacher Portal</Link></li>
                            <li><Link href="#faq" className="text-muted-foreground hover:text-background">FAQ</Link></li>
                        </ul>
                    </div>
                     <div>
                        <h4 className="font-bold text-lg mb-4">Programs</h4>
                        <ul className="space-y-2 text-sm">
                            <li><span className="text-muted-foreground">Public Speaking</span></li>
                            <li><span className="text-muted-foreground">Debate Club</span></li>
                            <li><span className="text-muted-foreground">Reading Fluency</span></li>
                            <li><span className="text-muted-foreground">Academic Writing</span></li>
                        </ul>
                    </div>
                     <div>
                        <h4 className="font-bold text-lg mb-4">Contact Us</h4>
                        <p className="text-sm text-muted-foreground">For inquiries, please join our WhatsApp forum or contact our administration through the platform's messaging system after registration.</p>
                    </div>
                </div>
                <div className="border-t border-gray-700 py-6">
                    <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4 md:px-6 text-center">
                        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Stoics Educational Institute & Services. All rights reserved.</p>
                        <p className="mt-4 md:mt-0 text-sm text-muted-foreground italic max-w-md">"We don’t just teach — we train voices, shape confidence, and inspire greatness."</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
