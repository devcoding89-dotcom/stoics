'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { doc, setDoc, getFirestore } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Logo } from '@/components/logo';
import { useToast } from '@/hooks/use-toast';
import { useUser, FirestorePermissionError, errorEmitter } from '@/firebase';
import type { User as AppUser, UserRole } from '@/lib/types';
import { generateRegistrationNumber } from '@/lib/registration';

const formSchema = z.object({
  role: z.enum(['student', 'teacher'], {
    required_error: 'You need to select a role.',
  }),
});

export default function SelectRolePage() {
  const router = useRouter();
  const { toast } = useToast();
  const firestore = getFirestore();
  const { user, isUserLoading } = useUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        role: 'student'
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You are not logged in. Please log in again.',
        variant: 'destructive',
      });
      router.push('/login');
      return;
    }
    
    try {
      const registrationNumber = await generateRegistrationNumber(firestore);
      const userRef = doc(firestore, 'users', user.uid);
      
      const [firstName, ...lastName] = (user.displayName || 'New User').split(' ');
      const newUserProfile: AppUser = {
        id: user.uid,
        firstName: firstName,
        lastName: lastName.join(' ') || '',
        email: user.email || '',
        role: values.role,
        avatar: user.photoURL || '',
        verified: true, // Google accounts are considered verified
        language: 'en',
        registrationNumber,
      };
      await setDoc(userRef, newUserProfile);

      toast({
        title: 'Registration Complete',
        description: `Welcome, ${newUserProfile.firstName}! Your role has been set.`,
      });

      router.push('/dashboard');
    } catch (error: any) {
        if (error instanceof FirestorePermissionError) {
          errorEmitter.emit('permission-error', error);
          return; // Stop execution
        }

        console.error('Role selection error:', error);
        toast({
          title: 'Registration Failed',
          description: 'Could not save your role. Please try again.',
          variant: 'destructive',
        });
    }
  };

  if (isUserLoading || !user) {
     return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <Logo className="h-12 w-auto animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mb-8 flex items-center gap-2">
        <Logo className="h-8 w-auto" />
        <span className="text-2xl font-bold font-headline text-center">Stoics Educational Institute & Services</span>
      </div>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">One Last Step</CardTitle>
          <CardDescription>
            Please select your role to complete your registration.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>I am a...</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="teacher" disabled>Teacher (Requires Admin Approval)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Saving...' : 'Complete Registration'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
