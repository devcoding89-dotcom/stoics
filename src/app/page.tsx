'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/logo';
import { BookOpenCheck, BrainCircuit, Users } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
          <span className="font-bold text-xl font-headline">Stoics Educational Services</span>
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/register">Register</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard">Login</Link>
          </Button>
        </div>
      </header>

      <main className="flex-grow">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 text-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tighter">
              A New Beginning for Your App
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Welcome to your clean, stable, and refreshed application, ready for your next great idea.
            </p>
            <Button size="lg" asChild>
              <Link href="/dashboard">Get Started</Link>
            </Button>
          </div>
        </section>

        <section id="features" className="bg-card py-20 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="flex flex-col text-center items-center p-6 border-transparent shadow-lg bg-background/50">
                <CardHeader className="items-center">
                  <div className="bg-primary/10 p-3 rounded-full mb-4">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="font-headline">Solid Authentication</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Reliable user login and registration powered by Firebase.</p>
                </CardContent>
              </Card>
              <Card className="flex flex-col text-center items-center p-6 border-transparent shadow-lg bg-background/50">
                <CardHeader className="items-center">
                  <div className="bg-primary/10 p-3 rounded-full mb-4">
                    <BookOpenCheck className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="font-headline">Stable Foundation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">A minimal, robust codebase to build upon without issues.</p>
                </CardContent>
              </Card>
              <Card className="flex flex-col text-center items-center p-6 border-transparent shadow-lg bg-background/50">
                <CardHeader className="items-center">
                  <div className="bg-primary/10 p-3 rounded-full mb-4">
                    <BrainCircuit className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="font-headline">Ready for Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Your AI partner is ready to help you build what's next.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo className="h-5 w-5" />
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Stoics Educational Services. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
