'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/logo';
import {
  BookOpenCheck,
  ClipboardList,
  CreditCard,
  MessagesSquare,
  BrainCircuit,
  Users,
} from 'lucide-react';
import { placeholderImages } from '@/lib/placeholder-images.json';
import { useTranslation } from '@/hooks/use-translation';

const featurePlaceholders = {
  roles: placeholderImages.find(p => p.id === 'feature-roles'),
  lessons: placeholderImages.find(p => p.id === 'feature-lessons'),
  communication: placeholderImages.find(p => p.id === 'feature-communication'),
};

export default function Home() {
  const { t, isLoaded } = useTranslation();
  const heroImage = placeholderImages.find(p => p.id === 'hero-image');

  const features = [
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: t('features.roles.title'),
      description: t('features.roles.description'),
      image: featurePlaceholders?.roles,
    },
    {
      icon: <BookOpenCheck className="h-8 w-8 text-primary" />,
      title: t('features.lessons.title'),
      description: t('features.lessons.description'),
      image: featurePlaceholders?.lessons,
    },
    {
      icon: <ClipboardList className="h-8 w-8 text-primary" />,
      title: t('features.attendance.title'),
      description: t('features.attendance.description'),
    },
    {
      icon: <CreditCard className="h-8 w-8 text-primary" />,
      title: t('features.payments.title'),
      description: t('features.payments.description'),
    },
    {
      icon: <MessagesSquare className="h-8 w-8 text-primary" />,
      title: t('features.communication.title'),
      description: t('features.communication.description'),
      image: featurePlaceholders?.communication,
    },
    {
      icon: <BrainCircuit className="h-8 w-8 text-primary" />,
      title: t('features.aiTutor.title'),
      description: t('features.aiTutor.description'),
    },
  ];

  if (!isLoaded) {
    return null; // Or a loading spinner
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
          <span className="font-bold text-xl font-headline">{t('global.appName')}</span>
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/register">{t('home.registerButton')}</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard">{t('home.loginButton')}</Link>
          </Button>
        </div>
      </header>

      <main className="flex-grow">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tighter">
                {t('home.heroTitle')}
              </h1>
              <p className="text-lg text-muted-foreground">
                {t('home.heroSubtitle')}
              </p>
              <Button size="lg" asChild>
                <Link href="/dashboard">{t('home.getStartedButton')}</Link>
              </Button>
            </div>
            <div className="relative h-64 md:h-96 rounded-lg overflow-hidden shadow-2xl">
              {heroImage && (
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  fill
                  style={{ objectFit: 'cover' }}
                  data-ai-hint={heroImage.imageHint}
                  priority
                />
              )}
            </div>
          </div>
        </section>

        <section id="features" className="bg-card py-20 md:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">{t('home.featuresTitle')}</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('home.featuresSubtitle')}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature) => (
                <Card key={feature.title} className="flex flex-col text-center items-center p-6 border-transparent shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-background/50">
                   <CardHeader className="items-center">
                    <div className="bg-primary/10 p-3 rounded-full mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle className="font-headline">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                    {feature.image && (
                      <div className="relative h-40 w-full mt-4 rounded-md overflow-hidden">
                        <Image 
                          src={feature.image.imageUrl}
                          alt={feature.image.description}
                          fill
                          style={{ objectFit: 'cover' }}
                          data-ai-hint={feature.image.imageHint}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo className="h-5 w-5" />
            <p className="text-sm text-muted-foreground">{t('home.footerRights', { year: new Date().getFullYear() })}</p>
          </div>
          <div className="text-sm text-muted-foreground">
            <Link href="#" className="hover:text-primary transition-colors">{t('home.footerPrivacy')}</Link>
            <span className="mx-2">|</span>
            <Link href="#" className="hover-text-primary transition-colors">{t('home.footerTerms')}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
