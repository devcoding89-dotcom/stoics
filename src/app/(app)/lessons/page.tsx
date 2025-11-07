'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import type { Lesson, Payment } from '@/lib/types';
import { collection, query, orderBy, collectionGroup, where } from 'firebase/firestore';
import { format } from 'date-fns';
import { BookOpen, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function LessonsPage() {
  const { user, userProfile } = useUser();
  const firestore = useFirestore();

  // Fetch payments to check for overdue status
  const paymentsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'users', user.uid, 'payments'), where('status', '==', 'overdue'));
  }, [firestore, user]);
  const { data: overduePayments } = useCollection<Payment>(paymentsQuery);

  const hasOverduePayments = overduePayments && overduePayments.length > 0;

  // Fetch lessons where the student is enrolled
  const lessonsQuery = useMemoFirebase(() => {
    if (!firestore || !user || hasOverduePayments) return null;
    return query(
      collectionGroup(firestore, 'lessons'),
      where('studentIds', 'array-contains', user.uid),
      orderBy('scheduledDateTime', 'desc')
    );
  }, [firestore, user, hasOverduePayments]);
  const { data: lessons, isLoading: lessonsLoading } = useCollection<Lesson>(lessonsQuery);

  if (userProfile?.role !== 'student') {
    return (
        <div className="flex h-full w-full items-center justify-center">
            <p className="text-muted-foreground">You do not have permission to view this page.</p>
        </div>
    )
  }

  if (hasOverduePayments) {
    return (
        <>
        <PageHeader
            title="My Lessons"
            description="Your access to lessons is currently restricted."
        />
        <Card className="mb-6 bg-destructive/10 border-destructive">
          <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <AlertTriangle className="h-8 w-8 text-destructive" />
            <div>
                <CardTitle className="text-destructive">Payment Required</CardTitle>
                <p className="text-destructive/80">You have overdue payments. Please settle them to regain access to your lessons.</p>
            </div>
          </CardHeader>
           <CardContent>
             <Button asChild>
                <Link href="/payments">View and Pay Now</Link>
            </Button>
          </CardContent>
        </Card>
        </>
    );
  }

  return (
    <>
      <PageHeader
        title="My Lessons"
        description="Here are all your scheduled lessons."
      />
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <CardTitle>All Lessons</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lesson</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead className="hidden sm:table-cell">Teacher</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lessonsLoading && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Loading your lessons...
                  </TableCell>
                </TableRow>
              )}
              {!lessonsLoading && lessons && lessons.length > 0 ? (
                lessons.map((lesson) => (
                  <TableRow key={lesson.id}>
                    <TableCell className="font-medium">{lesson.title}</TableCell>
                    <TableCell>{lesson.subject}</TableCell>
                    <TableCell className="hidden sm:table-cell">{lesson.teacherName}</TableCell>
                    <TableCell>{format(new Date(lesson.scheduledDateTime), 'PPP')}</TableCell>
                  </TableRow>
                ))
              ) : (
                !lessonsLoading && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      You are not enrolled in any lessons.
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
