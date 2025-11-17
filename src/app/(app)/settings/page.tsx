'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUser, useFirestore, updateDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supportedLanguages, supportedLanguageCodes } from '@/lib/languages';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { deleteCurrentUser } from '@/lib/delete-user';
import { ThemeToggle } from '@/components/theme-toggle';

const formSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters.'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters.'),
  language: z.enum(supportedLanguageCodes, {
    required_error: 'Please select your preferred language.',
  }),
});

export default function SettingsPage() {
  const { user, userProfile } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      language: 'en',
    },
  });

  useEffect(() => {
    if (userProfile) {
      form.reset({
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        language: userProfile.language,
      });
    }
  }, [userProfile, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user || !firestore) {
      toast({
        title: 'Error',
        description: 'You are not logged in.',
        variant: 'destructive',
      });
      return;
    }
    setIsSubmitting(true);

    const userRef = doc(firestore, 'users', user.uid);

    try {
      await updateDocumentNonBlocking(userRef, values);
      toast({
        title: 'Profile Updated',
        description: 'Your settings have been successfully saved.',
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Update Failed',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
        setIsSubmitting(false);
    }
  };
  
  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteCurrentUser();
      toast({
        title: 'Account Deleted',
        description: 'Your account has been successfully deleted.',
      });
      router.push('/'); // Redirect to home page after deletion
    } catch (error: any) {
      // Handle specific errors, like re-authentication needed
      if (error.code === 'auth/requires-recent-login') {
        toast({
          title: 'Re-authentication Required',
          description: 'Please sign in again to confirm account deletion. This is a security measure.',
          variant: 'destructive',
        });
        // The deleteCurrentUser function handles the re-auth popup, so we just inform the user.
      } else {
        toast({
          title: 'Account Deletion Failed',
          description: error.message || 'An error occurred while deleting your account.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsDeleting(false);
    }
  }

  if (!userProfile) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-muted-foreground">Loading your profile...</p>
      </div>
    );
  }

  return (
    <>
      <PageHeader title="Settings" description="Manage your account and profile settings." />
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>Update your personal information here.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Language</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {supportedLanguages.map(lang => (
                            <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
        
         <Card>
            <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                Customize the look and feel of the application.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                     <div>
                        <p className="font-medium">Theme</p>
                        <p className="text-sm text-muted-foreground">Select a theme for the dashboard.</p>
                    </div>
                    <ThemeToggle />
                </div>
            </CardContent>
        </Card>

        <Card className="border-destructive">
            <CardHeader>
                <CardTitle className="text-destructive">Account Management</CardTitle>
                <CardDescription>
                Permanent actions that will affect your account and data.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="font-medium">Delete Your Account</p>
                        <p className="text-sm text-muted-foreground">This will permanently delete your account and all associated data. This action cannot be undone.</p>
                    </div>
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" disabled={isDeleting}>
                                {isDeleting ? 'Deleting...' : 'Delete Account'}
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your
                                account and remove your data from our servers.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteAccount} disabled={isDeleting}>
                                Continue
                            </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CardContent>
        </Card>
      </div>
    </>
  );
}
