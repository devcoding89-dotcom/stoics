'use client';
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
import type { Lesson } from '@/lib/types';
import { BookPlus, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';
import { collection, query, where, getFirestore, orderBy } from 'firebase/firestore';

export default function LessonsPage() {
  const { user, userProfile } = useUser();
  const firestore = getFirestore();

  const lessonsQuery = useMemoFirebase(() => {
    if (!userProfile) return null;
    const coll = collection(firestore, 'lessons');
    
    switch(userProfile.role) {
      case 'student':
        return query(coll, where('studentIds', 'array-contains', userProfile.id), orderBy('scheduledDateTime', 'desc'));
      case 'teacher':
        return query(coll, where('teacherId', '==', userProfile.id), orderBy('scheduledDateTime', 'desc'));
      case 'admin':
         return query(coll, orderBy('scheduledDateTime', 'desc'));
      case 'parent':
        // This requires a more complex data model, e.g. parent having a list of child IDs.
        // For now, we return null to show no lessons.
        return null; 
      default:
        return null;
    }
  }, [firestore, userProfile]);

  const { data: lessons, isLoading } = useCollection<Lesson>(lessonsQuery);

  if (!userProfile) return null;

  const isTeacher = userProfile.role === 'teacher';

  const pageDetails = {
    student: { title: "My Lessons", description: "Here are your upcoming and past lessons." },
    teacher: { title: "Manage Lessons", description: "View, create, and manage your lessons." },
    parent: { title: "Child's Lessons", description: "Here are the upcoming lessons for your child." },
    admin: { title: "All Lessons", description: "An overview of all scheduled lessons in the system." },
  };

  const { title, description } = pageDetails[userProfile.role];

  return (
    <>
      <PageHeader
        title={title}
        description={description}
        action={
          isTeacher && (
            <Button>
              <BookPlus className="mr-2 h-4 w-4" />
              Create Lesson
            </Button>
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
              {isLoading && <TableRow><TableCell colSpan={5} className="text-center">Loading lessons...</TableCell></TableRow>}
              {!isLoading && lessons && lessons.map((lesson) => (
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
              ))}
               {!isLoading && (!lessons || lessons.length === 0) && <TableRow><TableCell colSpan={5} className="text-center">No lessons found.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
