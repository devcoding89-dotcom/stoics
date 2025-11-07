
'use client';
import { useUser } from '@/firebase';
import { AdminDashboard } from '@/components/dashboards/admin-dashboard';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { PageHeader } from '@/components/page-header';

export default function AdminPage() {
  const { user, userProfile, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // If loading is done and there's no user or the user is not an admin, redirect
    if (!isUserLoading && (!user || userProfile?.role !== 'admin')) {
      router.push('/dashboard');
    }
  }, [user, userProfile, isUserLoading, router]);

  // While loading or if user is not an admin yet, show a loading or unauthorized state
  if (isUserLoading || !userProfile || userProfile.role !== 'admin') {
     return (
       <div className="flex h-full w-full items-center justify-center">
         <div className="flex flex-col items-center gap-4">
           <p className="text-muted-foreground">Verifying access...</p>
         </div>
       </div>
    );
  }

  return <AdminDashboard user={user} userProfile={userProfile} isStandalonePage={true} />;
}
