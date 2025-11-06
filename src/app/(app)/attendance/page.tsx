'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useUser, useCollection, useMemoFirebase } from '@/firebase';
import { Badge } from '@/components/ui/badge';
import { capitalize } from '@/lib/utils';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { getFirestore, collection, query, where } from 'firebase/firestore';
import type { Lesson, Attendance } from '@/lib/types';
import React from 'react';

const TeacherAttendance = () => {
  const { user } = useUser();
  const firestore = getFirestore();
  const [selectedLessonId, setSelectedLessonId] = React.useState<string | undefined>();

  const lessonsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(firestore, 'lessons'), where('teacherId', '==', user.uid));
  }, [firestore, user]);
  const { data: lessons, isLoading: lessonsLoading } = useCollection<Lesson>(lessonsQuery);

  const lesson = lessons?.find(l => l.id === selectedLessonId);
  // In a real app, you would fetch attendance and student details for the selected lesson.
  // This remains a simplified demonstration.

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <Label htmlFor="lesson-select">Select Lesson:</Label>
          <Select value={selectedLessonId} onValueChange={setSelectedLessonId}>
            <SelectTrigger id="lesson-select" className="w-[300px]">
              <SelectValue placeholder="Select a lesson" />
            </SelectTrigger>
            <SelectContent>
              {lessonsLoading ? <SelectItem value="loading" disabled>Loading...</SelectItem> :
               lessons && lessons.map(l => (
                <SelectItem key={l.id} value={l.id}>{l.title} - {format(new Date(l.scheduledDateTime), "MM/dd/yyyy")}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button>Save Attendance</Button>
      </div>

      {lesson ? (
        <Card>
          <CardHeader>
            <CardTitle>Attendance for: {lesson.title}</CardTitle>
            <CardDescription>
              {lesson.subject} on {format(new Date(lesson.scheduledDateTime), "EEEE, MMMM d 'at' h:mm a")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Attendance taking UI would go here. This requires fetching student details for the lesson.</p>
            {/* Full implementation requires fetching student profiles based on lesson.studentIds */}
          </CardContent>
        </Card>
      ) : <p className='text-center text-muted-foreground'>Please select a lesson to view attendance.</p> }
    </>
  );
};

const ParentOrStudentAttendance = () => {
  const { user } = useUser();
  const firestore = getFirestore();

  const attendanceQuery = useMemoFirebase(() => {
    if (!user) return null;
    // This path is based on the student's own attendance records.
    return query(collection(firestore, 'users', user.uid, 'attendances'));
  }, [firestore, user]);

  const { data: attendance, isLoading } = useCollection<Attendance>(attendanceQuery);

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Attendance History</CardTitle>
        <CardDescription>A record of attendance for all lessons.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Lesson ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableRow><TableCell colSpan={3} className="text-center">Loading...</TableCell></TableRow>}
            {!isLoading && attendance && attendance.map(att => (
                <TableRow key={att.id}>
                  <TableCell className="font-medium">{att.lessonId}</TableCell>
                  <TableCell>{format(new Date(att.date), "MM/dd/yyyy")}</TableCell>
                  <TableCell>
                    <Badge variant={att.attendanceStatus === 'absent' ? 'destructive' : 'secondary'}>
                      {capitalize(att.attendanceStatus)}
                    </Badge>
                  </TableCell>
                </TableRow>
            ))}
            {!isLoading && (!attendance || attendance.length === 0) && <TableRow><TableCell colSpan={3} className="text-center">No attendance records found.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default function AttendancePage() {
  const { userProfile } = useUser();

  if (!userProfile) {
    return null; // Or a loading indicator
  }

  const isTeacherOrAdmin = userProfile.role === 'teacher' || userProfile.role === 'admin';
  const isParent = userProfile.role === 'parent';
  const isStudent = userProfile.role === 'student';

  const pageDetails = {
    teacher: { title: "Track Attendance", description: "Mark student attendance for your lessons." },
    admin: { title: "Track Attendance", description: "View and manage attendance records for all lessons." },
    parent: { title: "Child's Attendance", description: "View your child's attendance history." },
    student: { title: "My Attendance", description: "View your attendance history." },
  };

  const { title, description } = pageDetails[userProfile.role] || pageDetails.student;

  return (
    <>
      <PageHeader title={title} description={description} />
      {isTeacherOrAdmin && <TeacherAttendance />}
      {isStudent && <ParentOrStudentAttendance />}
      {isParent && <Card><CardContent className="pt-6"><p>Viewing attendance for a child is not yet implemented. This requires linking parent and student accounts.</p></CardContent></Card>}
    </>
  );
}
