'use client';

import { useUser } from '@/firebase';
import { StudentDashboard } from '@/components/dashboards/student-dashboard';
import { PageHeader } from '@/components/page-header';

export default function DashboardPage() {
  const { user, userProfile } = useUser();

  // This check is important because the layout guarantees user & profile are loaded.
  if (!user || !userProfile) {
    return null;
  }

  // Render different dashboards based on the user's role
  if (userProfile.role === 'student') {
    return <StudentDashboard user={user} userProfile={userProfile} />;
  }

  // Fallback for other roles (teacher, parent, admin)
  const welcomeName = userProfile.firstName || user.displayName || 'User';

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
