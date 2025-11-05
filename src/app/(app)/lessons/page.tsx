'use client';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUser } from '@/context/user-context';
import { mockLessons } from '@/lib/data';
import { BookPlus, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';

export default function LessonsPage() {
  const { userProfile } = useUser();

  if (!userProfile) return null;

  const isTeacher = userProfile.role === 'teacher';

  const pageDetails = {
    student: { title: "My Lessons", description: "Here are your upcoming lessons." },
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
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockLessons.map((lesson) => (
                <TableRow key={lesson.id}>
                  <TableCell className="font-medium">{lesson.title}</TableCell>
                  <TableCell>{lesson.subject}</TableCell>
                  <TableCell>{lesson.teacher}</TableCell>
                  <TableCell>{format(new Date(lesson.date), "MM/dd/yyyy")}</TableCell>
                  <TableCell>{lesson.time}</TableCell>
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
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
