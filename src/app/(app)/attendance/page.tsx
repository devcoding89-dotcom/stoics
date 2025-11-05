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
import { useUser } from '@/context/user-context';
import { mockLessons, mockAttendance } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { capitalize } from '@/lib/utils';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const TeacherAttendance = () => {
  const lesson = mockLessons[0];
  const attendanceData = mockAttendance[lesson.id] || {};
  
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <Label htmlFor="lesson-select">Select Lesson:</Label>
          <Select defaultValue={lesson.id}>
            <SelectTrigger id="lesson-select" className="w-[300px]">
              <SelectValue placeholder="Select a lesson" />
            </SelectTrigger>
            <SelectContent>
              {mockLessons.map(l => (
                <SelectItem key={l.id} value={l.id}>{l.title} - {format(new Date(l.date), "MM/dd/yyyy")}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button>Save Attendance</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance for: {lesson.title}</CardTitle>
          <CardDescription>
            {lesson.subject} on {format(new Date(lesson.date), "EEEE, MMMM d")} at {lesson.time}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Student</TableHead>
                <TableHead className="text-center">Present</TableHead>
                <TableHead className="text-center">Absent</TableHead>
                <TableHead className="text-center">Late</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lesson.students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={student.avatar} alt={student.name} />
                        <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {student.name}
                    </div>
                  </TableCell>
                  <TableCell colSpan={3}>
                    <RadioGroup defaultValue={attendanceData[student.id] || 'present'} className="grid grid-cols-3">
                      <div className="flex items-center justify-center">
                        <RadioGroupItem value="present" id={`present-${student.id}`} />
                      </div>
                      <div className="flex items-center justify-center">
                        <RadioGroupItem value="absent" id={`absent-${student.id}`} />
                      </div>
                      <div className="flex items-center justify-center">
                        <RadioGroupItem value="late" id={`late-${student.id}`} />
                      </div>
                    </RadioGroup>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
};

const ParentAttendance = () => {
  const studentId = 's5'; // Alex Johnson
  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance History for Alex Johnson</CardTitle>
        <CardDescription>A record of attendance for all lessons.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Lesson</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockLessons.map(lesson => {
              const attendanceRecord = mockAttendance[lesson.id];
              const status = attendanceRecord ? attendanceRecord[studentId] : 'present';
              if (!attendanceRecord) return null;

              return (
                <TableRow key={lesson.id}>
                  <TableCell className="font-medium">{lesson.title}</TableCell>
                  <TableCell>{format(new Date(lesson.date), "MM/dd/yyyy")}</TableCell>
                  <TableCell>
                    <Badge variant={status === 'absent' ? 'destructive' : 'secondary'} className={
                      status === 'present' ? 'bg-green-100 text-green-800' :
                      status === 'late' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }>
                      {capitalize(status)}
                    </Badge>
                  </TableCell>
                </TableRow>
              )
            })}
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
      {(isParent || userProfile.role === 'student') && <ParentAttendance />}
    </>
  );
}
