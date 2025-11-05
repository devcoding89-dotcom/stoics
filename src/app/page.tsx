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

const featurePlaceholders = {
  roles: placeholderImages.find(p => p.id === 'feature-roles'),
  lessons: placeholderImages.find(p => p.id === 'feature-lessons'),
  communication: placeholderImages.find(p => p.id === 'feature-communication'),
}

const features = [
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: 'User Roles',
    description: 'Role-based access for students, teachers, parents, and admins for a tailored experience.',
    image: featurePlaceholders?.roles,
  },
  {
    icon: <BookOpenCheck className="h-8 w-8 text-primary" />,
    title: 'Lesson Management',
    description: 'Teachers can easily schedule lessons, and share materials and resources with students.',
    image: featurePlaceholders?.lessons,
  },
  {
    icon: <ClipboardList className="h-8 w-8 text-primary" />,
    title: 'Attendance Tracking',
    description: 'Simple and efficient attendance recording for teachers and administrators.',
  },
  {
    icon: <CreditCard className="h-8 w-8 text-primary" />,
    title: 'Payment Processing',
    description: 'Integrated and secure payment gateway with detailed payment history for all parties.',
  },
  {
    icon: <MessagesSquare className="h-8 w-8 text-primary" />,
    title: 'Communication Hub',
    description: 'Real-time chat and announcements to keep everyone connected and informed.',
    image: featurePlaceholders?.communication,
  },
  {
    icon: <BrainCircuit className="h-8 w-8 text-primary" />,
    title: 'AI Tutoring Tool',
    description: 'A smart digital companion to help students with homework anytime.',
  },
];

export default function Home() {
  const heroImage = placeholderImages.find(p => p.id === 'hero-image');

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
          <span className="font-bold text-xl font-headline">Stoics Educational Services</span>
        </Link>
        <Button asChild>
          <Link href="/dashboard">Login</Link>
        </Button>
      </header>

      <main className="flex-grow">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tighter">
                The Future of Education, Connected.
              </h1>
              <p className="text-lg text-muted-foreground">
                Stoics Educational Services is an all-in-one platform designed to streamline communication and management for educational institutions, bringing students, teachers, and parents closer together.
              </p>
              <Button size="lg" asChild>
                <Link href="/dashboard">Get Started</Link>
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
              <h2 className="text-3xl md:text-4xl font-bold font-headline">Everything You Need in One Place</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover the powerful features that make Stoics Educational Services the perfect solution for modern learning environments.
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
            <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Stoics Educational Services. All rights reserved.</p>
          </div>
          <div className="text-sm text-muted-foreground">
            <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <span className="mx-2">|</span>
            <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
