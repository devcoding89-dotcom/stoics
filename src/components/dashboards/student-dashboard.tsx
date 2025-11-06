'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { User as FirebaseUser } from 'firebase/auth';
import type { User as AppUser, Lesson, Announcement, Homework } from '@/lib/types';
import Link from 'next/link';
import { ArrowRight, BookCopy, Calendar, Megaphone } from 'lucide-react';
import { capitalize } from '@/lib/utils';


// Mock data - in a real app, this would come from Firestore
const upcomingLessons: Lesson[] = [
  { id: '1', title: 'Algebra II', subject: 'Math', teacher: 'Mr. Davison', scheduledDateTime: '2023-10-27T10:00:00Z', teacherId: '' },
  { id: '2', title: 'World History', subject: 'History', teacher: 'Ms. Gable', scheduledDateTime: '2023-10-27T13:00:00Z', teacherId: '' },
  { id: '3', title: 'Creative Writing', subject: 'English', teacher: 'Mr. Poe', scheduledDateTime: '2023-10-28T11:00:00Z', teacherId: '' },
];

const announcements: Announcement[] = [
  { id: '1', title: 'Parent-Teacher Conference', content: 'Sign-ups for the parent-teacher conference are now available.', timestamp: '2023-10-25T09:00:00Z', authorId: 'admin', audience: 'all' },
  { id: '2', title: 'Mid-term Exam Schedule', content: 'The mid-term exam schedule for all classes has been posted.', timestamp: '2023-10-24T14:00:00Z', authorId: 'admin', audience: 'all' },
];

const homeworkData: Homework[] = [
    { id: '1', studentName: 'Alex Doe', subject: 'Math', status: 'completed', submittedDate: '2023-10-26' },
    { id: '2', studentName: 'Alex Doe', subject: 'Science', status: 'pending', submittedDate: '2023-10-27' },
];

interface StudentDashboardProps {
  user: FirebaseUser;
  userProfile: AppUser;
}

export function StudentDashboard({ user, userProfile }: StudentDashboardProps) {
  const welcomeName = userProfile.firstName || user.displayName || 'Student';

  return (
    <>
      <PageHeader
        title="Student Dashboard"
        description={`Welcome back, ${welcomeName}! Here's your overview.`}
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Upcoming Lessons */}
        <Card className="lg:col-span-2">
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
                  <TableHead>Teacher</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingLessons.map(lesson => (
                  <TableRow key={lesson.id}>
                    <TableCell>
                        <div className="font-medium">{lesson.title}</div>
                        <div className="text-sm text-muted-foreground">{lesson.subject}</div>
                    </TableCell>
                    <TableCell>{lesson.teacher}</TableCell>
                    <TableCell>{new Date(lesson.scheduledDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</TableCell>
                  </TableRow>
                ))}
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
            {announcements.map(announcement => (
              <div key={announcement.id} className="border-l-4 border-primary pl-4">
                <p className="font-medium">{announcement.title}</p>
                <p className="text-sm text-muted-foreground">{announcement.content}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Homework Overview */}
        <Card className="lg:col-span-3">
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
                  <TableHead>Due Date / Submitted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {homeworkData.map(hw => (
                  <TableRow key={hw.id}>
                    <TableCell className="font-medium">{hw.subject}</TableCell>
                    <TableCell>
                      <Badge variant={hw.status === 'completed' ? 'default' : 'secondary'} className={hw.status === 'completed' ? 'bg-green-500/80': ''}>{capitalize(hw.status)}</Badge>
                    </TableCell>
                    <TableCell>{hw.submittedDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
