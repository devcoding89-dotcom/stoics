'use client';

import { useUser } from '@/context/user-context';
import type { UserRole } from '@/lib/types';
import { PageHeader } from '@/components/page-header';
import { mockLessons, mockAnnouncements, mockHomework, mockPayments } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  BookOpenCheck,
  ClipboardCheck,
  DollarSign,
  Megaphone,
  BarChart,
  Users,
  Activity,
  UserCheck
} from 'lucide-react';
import { capitalize } from '@/lib/utils';
import { format } from 'date-fns';

const StudentDashboard = () => {
  const upcomingLesson = mockLessons[0];
  const recentHomework = mockHomework[0];
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">Upcoming Lesson</CardTitle>
          <BookOpenCheck className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{upcomingLesson.title}</div>
          <p className="text-xs text-muted-foreground">{upcomingLesson.subject}</p>
          <div className="flex items-center gap-2 mt-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src={`https://i.pravatar.cc/150?u=evelyn`} alt={upcomingLesson.teacher} />
              <AvatarFallback>{upcomingLesson.teacher.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{upcomingLesson.teacher}</p>
              <p className="text-xs text-muted-foreground">{format(new Date(upcomingLesson.date), "EEEE, MMMM d")} at {upcomingLesson.time}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">Recent Homework</CardTitle>
          <ClipboardCheck className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{recentHomework.subject}</div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant={recentHomework.status === 'completed' ? 'default' : 'secondary'} className="bg-accent text-accent-foreground">{capitalize(recentHomework.status)}</Badge>
            <p className="text-xs text-muted-foreground">Submitted: {recentHomework.submittedDate}</p>
          </div>
        </CardContent>
      </Card>
      <Card className="lg:col-span-3">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Announcements</CardTitle>
            <Megaphone className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            {mockAnnouncements.slice(0, 2).map((ann) => (
              <div key={ann.id} className="mb-4 last:mb-0">
                <p className="text-sm font-semibold">{ann.title}</p>
                <p className="text-sm text-muted-foreground">{ann.content}</p>
                <p className="text-xs text-muted-foreground mt-1">{ann.author} - {ann.date}</p>
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
};

const TeacherDashboard = () => {
  const stats = [
    { title: "Today's Lessons", value: "3", icon: BookOpenCheck },
    { title: "Pending Attendance", value: "1", icon: UserCheck },
    { title: "Monthly Earnings", value: "$2,450", icon: DollarSign },
  ]
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {stats.map(stat => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
       <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Upcoming Lessons</CardTitle>
          <CardDescription>Your scheduled lessons for the rest of the day.</CardDescription>
        </CardHeader>
        <CardContent>
           <ul className="space-y-4">
            {mockLessons.slice(0,2).map(lesson => (
              <li key={lesson.id} className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{lesson.title}</p>
                  <p className="text-sm text-muted-foreground">{lesson.subject} at {lesson.time}</p>
                </div>
                <div className="flex -space-x-2 overflow-hidden">
                  {lesson.students.slice(0,3).map(student => (
                    <Avatar key={student.id} className="inline-block h-8 w-8 rounded-full ring-2 ring-background">
                      <AvatarImage src={student.avatar} />
                      <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ))}
                  {lesson.students.length > 3 && <Avatar className="h-8 w-8 border-2 border-background bg-muted text-muted-foreground"><AvatarFallback>+{lesson.students.length - 3}</AvatarFallback></Avatar>}
                </div>
              </li>
            ))}
           </ul>
        </CardContent>
      </Card>
    </div>
  );
};

const ParentDashboard = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Child's Upcoming Lesson</CardTitle>
            <BookOpenCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockLessons[0].title}</div>
            <p className="text-xs text-muted-foreground">{mockLessons[0].subject} - Today at {mockLessons[0].time}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Recent Payment</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${mockPayments[0].amount}</div>
            <p className="text-xs text-muted-foreground">Paid on {mockPayments[0].date}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Attendance</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100%</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
    </div>
);

const AdminDashboard = () => {
    const stats = [
    { title: "Total Students", value: "150", icon: Users },
    { title: "Total Teachers", value: "12", icon: UserCheck },
    { title: "Total Lessons Today", value: "25", icon: BookOpenCheck },
    { title: "Revenue This Month", value: "$12,500", icon: DollarSign },
  ]
  return (
     <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map(stat => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
      <Card className="lg:col-span-4">
        <CardHeader>
          <CardTitle>System Activity</CardTitle>
          <CardDescription>Overview of platform usage.</CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
           {/* A chart would go here. For now, a placeholder */}
           <div className="h-[350px] w-full flex items-center justify-center bg-secondary/50 rounded-lg">
             <BarChart className="h-16 w-16 text-muted-foreground/50"/>
           </div>
        </CardContent>
      </Card>
    </div>
  );
};

const dashboardComponents: Record<UserRole, React.ComponentType> = {
  student: StudentDashboard,
  teacher: TeacherDashboard,
  parent: ParentDashboard,
  admin: AdminDashboard,
};

export default function DashboardPage() {
  const { user } = useUser();
  const DashboardComponent = dashboardComponents[user.role];

  return (
    <>
      <PageHeader
        title="Dashboard"
        description={`Welcome back, ${user.name}! Here's your overview for today.`}
      />
      <DashboardComponent />
    </>
  );
}
