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
import { getFirestore, collection, query, where, documentId } from 'firebase/firestore';
import type { Lesson, Attendance, User } from '@/lib/types';
import React from 'react';

const StudentListForLesson = ({ studentIds }: { studentIds: string[] }) => {
  const firestore = getFirestore();

  const studentsQuery = useMemoFirebase(() => {
    if (!studentIds || studentIds.length === 0) return null;
    return query(collection(firestore, 'users'), where(documentId(), 'in', studentIds));
  }, [firestore, studentIds]);
  
  const { data: students, isLoading: studentsLoading } = useCollection<User>(studentsQuery);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Student</TableHead>
          <TableHead className="text-right">Attendance Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {studentsLoading ? (
          <TableRow><TableCell colSpan={2} className="text-center">Loading students...</TableCell></TableRow>
        ) : students && students.length > 0 ? (
          students.map(student => (
            <TableRow key={student.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={student.avatar} alt={student.firstName} />
                    <AvatarFallback>{student.firstName?.charAt(0) || 'S'}</AvatarFallback>
                  </Avatar>
                  <div className="font-medium">{student.firstName} {student.lastName}</div>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <RadioGroup defaultValue="present" className="flex justify-end gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="present" id={`present-${student.id}`} />
                    <Label htmlFor={`present-${student.id}`}>Present</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="absent" id={`absent-${student.id}`} />
                    <Label htmlFor={`absent-${student.id}`}>Absent</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="late" id={`late-${student.id}`} />
                    <Label htmlFor={`late-${student.id}`}>Late</Label>
                  </div>
                </RadioGroup>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow><TableCell colSpan={2} className="text-center">No students enrolled in this lesson.</TableCell></TableRow>
        )}
      </TableBody>
    </Table>
  );
};


const TeacherAttendance = () => {
  const { user } = useUser();
  const firestore = getFirestore();
  const [selectedLessonId, setSelectedLessonId] = React.useState<string | undefined>();

  const lessonsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(firestore, 'users', user.uid, 'lessons'));
  }, [firestore, user]);
  const { data: lessons, isLoading: lessonsLoading } = useCollection<Lesson>(lessonsQuery);

  const lesson = lessons?.find(l => l.id === selectedLessonId);

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
            {lesson.studentIds && lesson.studentIds.length > 0 ? (
              <StudentListForLesson studentIds={lesson.studentIds} />
            ) : (
              <p className="text-center text-muted-foreground py-8">No students are enrolled in this lesson yet.</p>
            )}
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
