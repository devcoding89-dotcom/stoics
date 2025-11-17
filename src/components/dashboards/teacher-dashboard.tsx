'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { User as FirebaseUser } from 'firebase/auth';
import type { User as AppUser, Lesson } from '@/lib/types';
import Link from 'next/link';
import { ArrowRight, BookOpen, PlusCircle } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { format } from 'date-fns';

interface TeacherDashboardProps {
  user: FirebaseUser;
  userProfile: AppUser;
}

export function TeacherDashboard({ user, userProfile }: TeacherDashboardProps) {
  const welcomeName = userProfile.firstName || user.displayName || 'Teacher';
  const firestore = useFirestore();

  // Fetch lessons created by this teacher
  const lessonsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, 'users', user.uid, 'lessons'),
      orderBy('scheduledDateTime', 'desc'),
      limit(5)
    );
  }, [firestore, user]);
  const { data: lessons, isLoading: lessonsLoading } = useCollection<Lesson>(lessonsQuery);

  return (
    <>
      <PageHeader
        title="Teacher Dashboard"
        description={`Welcome back, ${welcomeName}! Manage your lessons and students.`}
        action={
          <Button asChild>
            <Link href="/lessons/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Lesson
            </Link>
          </Button>
        }
      />
      <div className="grid gap-6 md:grid-cols-1">
        {/* Your Lessons */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <CardTitle>Your Recent Lessons</CardTitle>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/lessons">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lesson Title</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Scheduled Date</TableHead>
                  <TableHead>Students</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lessonsLoading && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">Loading your lessons...</TableCell>
                  </TableRow>
                )}
                {!lessonsLoading && lessons && lessons.length > 0 ? (
                  lessons.map(lesson => (
                    <TableRow key={lesson.id}>
                      <TableCell className="font-medium">{lesson.title}</TableCell>
                      <TableCell>{lesson.subject}</TableCell>
                      <TableCell>{format(new Date(lesson.scheduledDateTime), 'PPP')}</TableCell>
                      <TableCell>{lesson.studentIds?.length || 0}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  !lessonsLoading && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        You haven't created any lessons yet.
                         <Button variant="link" asChild className="p-1">
                            <Link href="/lessons/create">Create one now</Link>
                         </Button>
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
