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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import type { User as AppUser } from '@/lib/types';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  subject: z.string().min(3, 'Subject must be at least 3 characters.'),
  scheduledDateTime: z.date({
    required_error: 'A date is required.',
  }),
  materials: z.string().optional(),
  resources: z.string().optional(),
  studentIds: z.array(z.string()).optional(),
});

export default function CreateLessonPage() {
  const router = useRouter();
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  // Fetch all student users to populate the multi-select
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
      title: '',
      subject: '',
      materials: '',
      resources: '',
      studentIds: [],
    },
  });
  
  const selectedStudentIds = form.watch('studentIds') || [];

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!user || !firestore) {
      toast({
        title: 'Error',
        description: 'You must be logged in to create a lesson.',
        variant: 'destructive',
      });
      return;
    }
    setIsSubmitting(true);

    const lessonsRef = collection(firestore, 'users', user.uid, 'lessons');
    const lessonData = {
      ...values,
      teacherId: user.uid,
      teacherName: user.displayName || 'Unnamed Teacher',
      scheduledDateTime: values.scheduledDateTime.toISOString(),
      studentIds: values.studentIds || [],
      createdAt: serverTimestamp(),
    };
    
    // We call the non-blocking function but use its returned promise for UI feedback.
    // The function itself handles emitting permission errors internally.
    addDocumentNonBlocking(lessonsRef, lessonData)
      .then((docRef) => {
        toast({
          title: 'Lesson Created',
          description: `The lesson "${values.title}" has been successfully created.`,
        });
        router.push('/dashboard');
      })
      .catch((error) => {
        // This catch block will now only be triggered by non-permission errors,
        // or if we explicitly re-throw a permission error for local handling.
        // The global FirestorePermissionError is already emitted inside addDocumentNonBlocking.
        console.error('Error creating lesson:', error);
        toast({
            title: 'Error creating lesson',
            description: 'An unexpected error occurred. Please check the console and try again.',
            variant: 'destructive',
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <>
      <PageHeader
        title="Create a New Lesson"
        description="Fill out the details below to schedule a new lesson."
      />
      <Card>
        <CardHeader>
          <CardTitle>Lesson Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lesson Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Introduction to Algebra" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Math" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

               <FormField
                  control={form.control}
                  name="scheduledDateTime"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Scheduled Date</FormLabel>
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
                
              <FormField
                control={form.control}
                name="studentIds"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Assign Students</FormLabel>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between h-auto",
                              !field.value?.length && "text-muted-foreground"
                            )}
                          >
                             <div className="flex flex-wrap gap-1">
                                {selectedStudentIds.length > 0 ? (
                                  students?.filter(s => selectedStudentIds.includes(s.id)).map(s => (
                                    <Badge key={s.id} variant="secondary">{`${s.firstName} ${s.lastName}`}</Badge>
                                  ))
                                ) : (
                                  "Select students..."
                                )}
                              </div>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                        <Command>
                          <CommandInput placeholder="Search students..." />
                          <CommandEmpty>No students found.</CommandEmpty>
                          <CommandGroup>
                            {studentsLoading && <CommandItem>Loading...</CommandItem>}
                            {students?.map((student) => (
                              <CommandItem
                                value={`${student.firstName} ${student.lastName}`}
                                key={student.id}
                                onSelect={() => {
                                  const currentIds = field.value || [];
                                  const newIds = currentIds.includes(student.id)
                                      ? currentIds.filter(id => id !== student.id)
                                      : [...currentIds, student.id];
                                  field.onChange(newIds);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value?.includes(student.id)
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {`${student.firstName} ${student.lastName}`}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Select one or more students to enroll in this lesson.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="materials"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Materials</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="List any materials students will need for the lesson."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="resources"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resources</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="List any links or resources for the lesson."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating Lesson...' : 'Create Lesson'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
