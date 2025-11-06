'use client';
import React from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUser, useCollection, useMemoFirebase } from '@/firebase';
import type { Lesson, User } from '@/lib/types';
import { BookPlus, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';
import { collection, query, where, getFirestore, orderBy, collectionGroup, addDoc, getDocs } from 'firebase/firestore';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

function CreateLessonDialog({ user, afterCreate }: { user: User; afterCreate: () => void }) {
  const [title, setTitle] = React.useState('');
  const [subject, setSubject] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();
  const firestore = getFirestore();

  const handleCreateLesson = async () => {
    if (!title || !subject) {
      toast({
        title: 'Missing Information',
        description: 'Please provide a title and subject for the lesson.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    try {
      const lessonsRef = collection(firestore, 'users', user.id, 'lessons');
      
      // Fetch all students to enroll them in the new lesson
      const studentsQuery = query(collection(firestore, 'users'), where('role', '==', 'student'));
      const studentsSnapshot = await getDocs(studentsQuery);
      const studentIds = studentsSnapshot.docs.map(doc => doc.id);

      if (studentIds.length === 0) {
        toast({
            title: 'No Students Found',
            description: 'There are no students in the system to enroll in this lesson.',
            variant: 'default',
        });
      }

      const newLesson: Omit<Lesson, 'id'> = {
        title,
        subject,
        teacherId: user.id,
        scheduledDateTime: new Date().toISOString(),
        studentIds: studentIds, 
        materials: '',
        resources: ''
      };

      await addDoc(lessonsRef, newLesson);
      
      toast({
        title: 'Lesson Created!',
        description: `${title} has been added and all students enrolled.`,
        className: 'bg-accent text-accent-foreground',
      });
      afterCreate(); // Close dialog
    } catch (error) {
      console.error('Error creating lesson:', error);
      toast({
        title: 'Error',
        description: 'Could not create the lesson. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create a New Lesson</DialogTitle>
        <DialogDescription>
          Fill in the details below to schedule a new lesson. All current students will be enrolled.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="title">Lesson Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Introduction to Algebra"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g., Math"
          />
        </div>
      </div>
      <DialogFooter>
        <Button onClick={handleCreateLesson} disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Lesson'}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}


export default function LessonsPage() {
  const { user, userProfile } = useUser();
  const firestore = getFirestore();
  const [isCreateDialogOpen, setCreateDialogOpen] = React.useState(false);


  const lessonsQuery = useMemoFirebase(() => {
    if (!user || !userProfile) return null;
    
    switch(userProfile.role) {
      case 'student':
        return query(collectionGroup(firestore, 'lessons'), where('studentIds', 'array-contains', user.uid), orderBy('scheduledDateTime', 'desc'));
      case 'teacher':
        return query(collection(firestore, 'users', user.uid, 'lessons'), orderBy('scheduledDateTime', 'desc'));
      case 'admin':
         return query(collectionGroup(firestore, 'lessons'), orderBy('scheduledDateTime', 'desc'));
      case 'parent':
        // TODO: This would require linking parents to students. For now, it returns nothing.
        return null; 
      default:
        return null;
    }
  }, [firestore, user, userProfile]);

  const { data: lessons, isLoading } = useCollection<Lesson>(lessonsQuery);

  if (!userProfile || !user) return null;

  const isTeacher = userProfile.role === 'teacher';

  const pageDetails = {
    student: { title: "My Lessons", description: "Here are your upcoming and past lessons." },
    teacher: { title: "Manage Lessons", description: "View, create, and manage your lessons." },
    parent: { title: "Child's Lessons", description: "Here are the upcoming lessons for your child." },
    admin: { title: "All Lessons", description: "An overview of all scheduled lessons in the system." },
  };

  const { title, description } = pageDetails[userProfile.role] || pageDetails.student;

  return (
    <>
      <PageHeader
        title={title}
        description={description}
        action={
          isTeacher && (
            <Dialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <BookPlus className="mr-2 h-4 w-4" />
                  Create Lesson
                </Button>
              </DialogTrigger>
              <CreateLessonDialog user={userProfile} afterCreate={() => setCreateDialogOpen(false)} />
            </Dialog>
          )
        }
      />
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lesson</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">Loading lessons...</TableCell>
                </TableRow>
              ) : lessons && lessons.length > 0 ? (
                lessons.map((lesson) => (
                  <TableRow key={lesson.id}>
                    <TableCell className="font-medium">{lesson.title}</TableCell>
                    <TableCell>{lesson.subject}</TableCell>
                    <TableCell>{lesson.teacherId}</TableCell> {/* TODO: Fetch teacher name */}
                    <TableCell>{format(new Date(lesson.scheduledDateTime), "MM/dd/yyyy h:mm a")}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          {isTeacher && <DropdownMenuItem>Edit Lesson</DropdownMenuItem>}
                          {(isTeacher || userProfile.role === 'admin') && <DropdownMenuItem className="text-destructive">Delete Lesson</DropdownMenuItem>}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No lessons found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
