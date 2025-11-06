'use client';

import { useUser } from '@/firebase';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  const { user, userProfile } = useUser();

  // This check is important because the layout guarantees user & profile are loaded.
  if (!user || !userProfile) {
    return null; 
  }

  const welcomeName = userProfile.firstName || user.displayName || 'User';

  return (
    <>
      <PageHeader
        title="Dashboard"
        description={`Welcome back, ${welcomeName}! This is your fresh start.`}
      />
      <Card>
        <CardHeader>
          <CardTitle>Welcome!</CardTitle>
        </CardHeader>
        <CardContent>
          <p>You have successfully logged into your new, stable application. From here, you can ask me to build out any features you need.</p>
          <p className="mt-4">Your role is: <strong>{userProfile.role}</strong></p>
        </CardContent>
      </Card>
    </>
  );
}
