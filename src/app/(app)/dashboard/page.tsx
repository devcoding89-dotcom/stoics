'use client';

import { useUser } from '@/firebase';
import { StudentDashboard } from '@/components/dashboards/student-dashboard';
import { TeacherDashboard } from '@/components/dashboards/teacher-dashboard';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  const { user, userProfile } = useUser();

  // This check is important because the layout guarantees user & profile are loaded.
  if (!user || !userProfile) {
    return null;
  }
  
  const welcomeName = userProfile.firstName || user.displayName || 'User';

  // Render different dashboards based on the user's role
  if (userProfile.role === 'student') {
    return <StudentDashboard user={user} userProfile={userProfile} />;
  }

  if (userProfile.role === 'teacher') {
    return <TeacherDashboard user={user} userProfile={userProfile} />;
  }

  if (userProfile.role === 'admin') {
    return (
        <>
            <PageHeader
                title="Admin Dashboard"
                description={`Welcome back, ${welcomeName}!`}
            />
             <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <p>Manage users, settings, and view platform-wide data.</p>
                        <Button asChild>
                            <Link href="/admin">
                                Go to Admin Panel
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </>
    );
  }

  // Fallback for other roles (e.g., parent)
  return (
    <>
      <PageHeader
        title="Dashboard"
        description={`Welcome back, ${welcomeName}!`}
      />
      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Welcome!</h2>
        <p>Your personalized dashboard is under construction. More features are coming soon!</p>
        <p className="mt-4">Your role is: <strong>{userProfile.role}</strong></p>
      </div>
    </>
  );
}
