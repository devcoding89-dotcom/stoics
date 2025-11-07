'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { collection, serverTimestamp, query, where, orderBy } from 'firebase/firestore';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { FirestorePermissionError } from '@/firebase/errors';
import type { User as AppUser } from '@/lib/types';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  studentId: z.string().min(1, 'You must select a student.'),
  amount: z.coerce.number().positive('Amount must be a positive number.'),
  description: z.string().min(3, 'Description must be at least 3 characters.'),
  dueDate: z.date({
    required_error: 'A due date is required.',
  }),
});

export default function SchedulePaymentPage() {
  const router = useRouter();
  const firestore = useFirestore();
  const { user, userProfile } = useUser();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  // Redirect if not a teacher
  useEffect(() => {
    if (userProfile && userProfile.role !== 'teacher') {
      router.push('/dashboard');
    }
  }, [userProfile, router]);


  // Fetch all student users to populate the select dropdown
  const studentsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'users'), 
      where('role', '==', 'student'),
      orderBy('lastName', 'asc')
    );
  }, [firestore]);
  const { data: students, isLoading: studentsLoading } = useCollection<AppUser>(studentsQuery);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!user || !firestore) {
      toast({
        title: 'Error',
        description: 'You must be logged in to schedule a payment.',
        variant: 'destructive',
      });
      return;
    }
    setIsSubmitting(true);

    // Payments are stored in a subcollection under the *student's* user document
    const paymentsRef = collection(firestore, 'users', values.studentId, 'payments');
    const paymentData = {
      ...values,
      teacherId: user.uid,
      dueDate: values.dueDate.toISOString(),
      status: 'pending',
      createdAt: serverTimestamp(),
    };
    
    addDocumentNonBlocking(paymentsRef, paymentData)
      .then((docRef) => {
        toast({
          title: 'Payment Scheduled',
          description: `The payment has been successfully scheduled for the student.`,
        });
        router.push('/dashboard');
      })
      .catch((error) => {
        console.error('Error scheduling payment:', error);
        if (!(error instanceof FirestorePermissionError)) {
            toast({
                title: 'Error scheduling payment',
                description: error.message || 'An unexpected error occurred. Please try again.',
                variant: 'destructive',
            });
        }
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  if (!userProfile || userProfile.role !== 'teacher') {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-muted-foreground">Verifying access...</p>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Schedule a Payment"
        description="Create a payment request for a student."
      />
      <Card>
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="studentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={studentsLoading}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a student to bill" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {studentsLoading && <SelectItem value="loading" disabled>Loading students...</SelectItem>}
                        {students?.map((student) => (
                          <SelectItem key={student.id} value={student.id}>
                            {`${student.firstName} ${student.lastName}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount (USD)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 50.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Due Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date(new Date().setHours(0, 0, 0, 0))
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Tutoring session for May"
                        {...field}
                      />
                    </FormControl>
                     <FormDescription>
                      This will be visible to the student and parent.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Scheduling...' : 'Schedule Payment'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
