'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { User as FirebaseUser } from 'firebase/auth';
import type { User as AppUser, Lesson, Announcement, Homework, Payment } from '@/lib/types';
import Link from 'next/link';
import { ArrowRight, BookCopy, Calendar, Megaphone, AlertTriangle } from 'lucide-react';
import { capitalize } from '@/lib/utils';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, limit, collectionGroup } from 'firebase/firestore';
import { format } from 'date-fns';

interface StudentDashboardProps {
  user: FirebaseUser;
  userProfile: AppUser;
}

export function StudentDashboard({ user, userProfile }: StudentDashboardProps) {
  const welcomeName = userProfile.firstName || user.displayName || 'Student';
  const firestore = useFirestore();

  // Fetch announcements
  const announcementsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
        collection(firestore, 'announcements'), 
        orderBy('timestamp', 'desc'), 
        limit(2)
    );
  }, [firestore]);
  const { data: announcements, isLoading: announcementsLoading } = useCollection<Announcement>(announcementsQuery);

  // Fetch lessons where the student is enrolled
  const lessonsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collectionGroup(firestore, 'lessons'),
      where('studentIds', 'array-contains', user.uid),
      orderBy('scheduledDateTime', 'desc'),
      limit(5)
    );
  }, [firestore, user]);
  const { data: upcomingLessons, isLoading: lessonsLoading } = useCollection<Lesson>(lessonsQuery);
  
  // Fetch payments to check for overdue status
  const paymentsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'users', user.uid, 'payments'), where('status', 'in', ['pending', 'overdue']));
  }, [firestore, user]);
  const { data: pendingPayments } = useCollection<Payment>(paymentsQuery);

  const hasOverduePayments = pendingPayments?.some(p => p.status === 'overdue');

  // Homework data - will be empty for now
  const homeworkData: Homework[] = [];

  return (
    <>
      <PageHeader
        title="Student Dashboard"
        description={`Welcome back, ${welcomeName}! Here's your overview.`}
      />
       {hasOverduePayments && (
        <Card className="mb-6 bg-destructive/10 border-destructive">
          <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <AlertTriangle className="h-6 w-6 text-destructive" />
            <div >
                <CardTitle className="text-destructive">Action Required: Overdue Payments</CardTitle>
                <p className="text-sm text-destructive/80">You have overdue payments that require your attention. Access to new lessons may be restricted until they are paid.</p>
            </div>
          </CardHeader>
           <CardContent>
             <Button asChild>
                <Link href="/payments">View and Pay Now</Link>
            </Button>
          </CardContent>
        </Card>
      )}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {/* Upcoming Lessons */}
        <Card className="md:col-span-2 lg:col-span-1 xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
                <Calendar className="h-6 w-6 text-primary" />
                <CardTitle>Upcoming Lessons</CardTitle>
            </div>
            <Button variant="ghost" size="sm" asChild>
                <Link href="#">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lesson</TableHead>
                  <TableHead className="hidden sm:table-cell">Teacher</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lessonsLoading && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">Loading your lessons...</TableCell>
                  </TableRow>
                )}
                {!lessonsLoading && upcomingLessons && upcomingLessons.length > 0 ? (
                  upcomingLessons.map(lesson => (
                    <TableRow key={lesson.id}>
                        <TableCell className="font-medium">{lesson.title}</TableCell>
                        <TableCell className="hidden sm:table-cell">{lesson.teacherName}</TableCell>
                        <TableCell>{format(new Date(lesson.scheduledDateTime), 'PPP')}</TableCell>
                    </TableRow>
                  ))
                ) : (
                    !lessonsLoading && <TableRow><TableCell colSpan={3} className="text-center">You are not enrolled in any upcoming lessons.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Announcements */}
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
                 <Megaphone className="h-6 w-6 text-primary" />
                <CardTitle>Announcements</CardTitle>
            </div>
             <Button variant="ghost" size="sm" asChild>
                <Link href="#">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
             {announcementsLoading && <p className="text-muted-foreground">Loading announcements...</p>}
            {!announcementsLoading && announcements && announcements.length > 0 ? (
              announcements.map(announcement => (
                <div key={announcement.id} className="border-l-4 border-primary pl-4">
                  <p className="font-medium">{announcement.title}</p>
                  <p className="text-sm text-muted-foreground">{announcement.content}</p>
                </div>
              ))
            ) : (
                !announcementsLoading && <p className="text-muted-foreground">No recent announcements.</p>
            )}
          </CardContent>
        </Card>

        {/* Homework Overview */}
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
             <div className="flex items-center gap-2">
                <BookCopy className="h-6 w-6 text-primary" />
                <CardTitle>Homework Overview</CardTitle>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/homework">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Due Date / Submitted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {homeworkData.length > 0 ? (
                    homeworkData.map(hw => (
                    <TableRow key={hw.id}>
                        <TableCell className="font-medium">{hw.subject}</TableCell>
                        <TableCell>
                        <Badge variant={hw.status === 'completed' ? 'default' : 'secondary'} className={hw.status === 'completed' ? 'bg-green-500/80': ''}>{capitalize(hw.status)}</Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">{hw.submittedDate}</TableCell>
                    </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={3} className="text-center">No homework assignments to display.</TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
