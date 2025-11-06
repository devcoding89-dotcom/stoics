'use client';

import { useUser, useCollection, useMemoFirebase } from '@/firebase';
import type { UserRole, Lesson, Announcement, Payment } from '@/lib/types';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  BookOpenCheck,
  ClipboardList,
  DollarSign,
  Megaphone,
  BarChart,
  Users,
  UserCheck
} from 'lucide-react';
import { capitalize } from '@/lib/utils';
import { format } from 'date-fns';
import { collection, query, where, getFirestore, limit, collectionGroup } from 'firebase/firestore';

const StudentDashboard = () => {
  const { user } = useUser();
  const firestore = getFirestore();

  // In a real app, you would have a way to associate students with lessons.
  const lessonsQuery = useMemoFirebase(() => {
    if (!user) return null; 
    // This query is for demonstration. A real implementation would be more robust.
    return query(collectionGroup(firestore, 'lessons'), where('studentIds', 'array-contains', user.uid), limit(1));
  }, [firestore, user]);

  const announcementsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'announcements'), limit(2));
  }, [firestore]);
  
  const paymentsQuery = useMemoFirebase(() => {
    if(!user || !firestore) return null;
    return query(collection(firestore, 'users', user.uid, 'payments'), limit(1));
  }, [firestore, user]);

  const { data: lessons, isLoading: lessonsLoading } = useCollection<Lesson>(lessonsQuery);
  const { data: announcements, isLoading: announcementsLoading } = useCollection<Announcement>(announcementsQuery);
  const { data: payments, isLoading: paymentsLoading } = useCollection<Payment>(paymentsQuery);

  const upcomingLesson = lessons?.[0];
  const recentPayment = payments?.[0];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">Upcoming Lesson</CardTitle>
          <BookOpenCheck className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {lessonsLoading ? <p>Loading...</p> : upcomingLesson ? (
            <>
              <div className="text-2xl font-bold">{upcomingLesson.title}</div>
              <p className="text-xs text-muted-foreground">{upcomingLesson.subject}</p>
              <div className="flex items-center gap-2 mt-4">
                <Avatar className="h-8 w-8">
                  {/* In a real app, you would fetch teacher details based on teacherId */}
                  <AvatarFallback>{upcomingLesson.teacherId.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{upcomingLesson.teacherId}</p>
                  <p className="text-xs text-muted-foreground">{format(new Date(upcomingLesson.scheduledDateTime), "EEEE, MMMM d 'at' h:mm a")}</p>
                </div>
              </div>
            </>
          ) : <p>No upcoming lessons.</p>}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">Recent Payment</CardTitle>
          <DollarSign className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {paymentsLoading ? <p>Loading...</p> : recentPayment ? (
            <>
              <div className="text-2xl font-bold">${recentPayment.amount.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Paid on {format(new Date(recentPayment.paymentDate), "MMMM d, yyyy")}</p>
            </>
          ) : <p>No recent payments.</p>}
        </CardContent>
      </Card>
      <Card className="lg:col-span-3">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Announcements</CardTitle>
            <Megaphone className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            {announcementsLoading ? <p>Loading...</p> : announcements && announcements.length > 0 ? announcements.map((ann) => (
              <div key={ann.id} className="mb-4 last:mb-0">
                <p className="text-sm font-semibold">{ann.title}</p>
                <p className="text-sm text-muted-foreground">{ann.content}</p>
                <p className="text-xs text-muted-foreground mt-1">{format(new Date(ann.timestamp), "MMMM d, yyyy")}</p>
              </div>
            )) : <p>No announcements.</p>}
        </CardContent>
      </Card>
    </div>
  );
};

const TeacherDashboard = () => {
  const { user } = useUser();
  const firestore = getFirestore();

  const lessonsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, 'users', user.uid, 'lessons'));
  }, [firestore, user]);

  const { data: lessons, isLoading: lessonsLoading } = useCollection<Lesson>(lessonsQuery);
  const upcomingLessons = lessons?.filter(l => new Date(l.scheduledDateTime) > new Date()).slice(0, 2) || [];

  const studentCount = lessons?.reduce((acc, l) => acc + (l.studentIds?.length || 0), 0) || '0';

  const stats = [
    { title: "Total Lessons", value: lessons?.length.toString() || '0', icon: BookOpenCheck },
    { title: "Students Taught", value: studentCount, icon: UserCheck },
    { title: "Monthly Earnings", value: "$0", icon: DollarSign }, // Placeholder
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
            <div className="text-2xl font-bold">{lessonsLoading ? '...' : stat.value}</div>
          </CardContent>
        </Card>
      ))}
       <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Upcoming Lessons</CardTitle>
          <CardDescription>Your next scheduled lessons.</CardDescription>
        </CardHeader>
        <CardContent>
          {lessonsLoading ? <p>Loading lessons...</p> : upcomingLessons.length > 0 ? (
           <ul className="space-y-4">
            {upcomingLessons.map(lesson => (
              <li key={lesson.id} className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{lesson.title}</p>
                  <p className="text-sm text-muted-foreground">{lesson.subject} at {format(new Date(lesson.scheduledDateTime), 'h:mm a')}</p>
                </div>
              </li>
            ))}
           </ul>
          ) : <p>No upcoming lessons found.</p>}
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
             {/* This would require knowing the child's ID, which is not in the current data model for parents. */}
            <p className="text-muted-foreground">Feature coming soon.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Recent Payment</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Feature coming soon.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Attendance</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Feature coming soon.</p>
          </CardContent>
        </Card>
    </div>
);

const AdminDashboard = () => {
    const firestore = getFirestore();
    const usersQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return collection(firestore, 'users');
    }, [firestore]);
    // Admin cannot query all nested lessons directly without knowing teacher IDs.
    // This would require a more complex aggregation or a separate top-level collection for all lessons if admins need this view.
    // const lessonsQuery = useMemoFirebase(() => collection(firestore, 'lessons'), [firestore]);
    
    const { data: users, isLoading: usersLoading } = useCollection(usersQuery);
    // const { data: lessons, isLoading: lessonsLoading } = useCollection(lessonsQuery);

    const stats = [
      { title: "Total Students", value: users?.filter(u => u.role === 'student').length.toString() || '0', icon: Users },
      { title: "Total Teachers", value: users?.filter(u => u.role === 'teacher').length.toString() || '0', icon: UserCheck },
      { title: "Total Lessons", value: 'N/A', icon: BookOpenCheck }, // Cannot be calculated with current rules
      { title: "Revenue This Month", value: "$0", icon: DollarSign }, // Placeholder
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
            <div className="text-2xl font-bold">{usersLoading ? '...' : stat.value}</div>
          </CardContent>
        </Card>
      ))}
      <Card className="lg:col-span-4">
        <CardHeader>
          <CardTitle>System Activity</CardTitle>
          <CardDescription>Overview of platform usage.</CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
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
  const { user, userProfile, isUserLoading, isUserProfileLoading } = useUser();
  
  if (isUserLoading || isUserProfileLoading || !userProfile || !user) {
    return null; // Or a loading indicator
  }

  const DashboardComponent = dashboardComponents[userProfile.role];
  const welcomeName = userProfile.firstName || user.displayName || 'User';

  return (
    <>
      <PageHeader
        title="Dashboard"
        description={`Welcome back, ${welcomeName}! Here's your overview for today.`}
      />
      <DashboardComponent />
    </>
  );
}
