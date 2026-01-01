'use client';

import { useParams } from 'next/navigation';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import type { User as AppUser } from '@/lib/types';
import { doc } from 'firebase/firestore';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Mail, Phone, Calendar, User, Hash } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function StudentProfilePage() {
  const params = useParams();
  const firestore = useFirestore();
  const studentId = params.id as string;

  const studentDocRef = useMemoFirebase(() => {
    if (!firestore || !studentId) return null;
    return doc(firestore, 'users', studentId);
  }, [firestore, studentId]);

  const { data: student, isLoading: studentLoading } = useDoc<AppUser>(studentDocRef);

  const renderLoadingSkeleton = () => (
    <div className="space-y-6">
        <div className="flex items-center gap-6">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-6 w-64" />
            </div>
        </div>
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-2/3" />
            </CardContent>
        </Card>
    </div>
  );

  const renderProfile = () => {
    if (!student) {
      return <div className="text-center text-muted-foreground">Student not found.</div>;
    }
    
    // Safely create a Date object from the Firestore Timestamp
    const joinedDate = student.createdAt ? new Date(student.createdAt.seconds * 1000) : null;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
                <CardContent className="p-6 flex flex-col items-center text-center">
                     <Avatar className="h-24 w-24 mb-4">
                        <AvatarImage src={student.avatar} alt={`${student.firstName} ${student.lastName}`} />
                        <AvatarFallback className="text-3xl">{student.firstName?.charAt(0)}{student.lastName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h2 className="text-2xl font-bold">{`${student.firstName} ${student.lastName}`}</h2>
                    <p className="text-muted-foreground">{student.email}</p>
                     <div className="mt-4 space-y-2 text-sm text-left w-full">
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>Role: <strong>{student.role}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Hash className="h-4 w-4 text-muted-foreground" />
                            <span>Reg. No: <strong>{student.registrationNumber || 'N/A'}</strong></span>
                        </div>
                         {joinedDate && (
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>Joined: {format(joinedDate, 'PPP')}</span>
                            </div>
                        )}
                     </div>
                </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <p className="text-muted-foreground">Student's recent activity will be displayed here.</p>
                         {/* Placeholder for activity feed */}
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Enrolled Lessons</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <p className="text-muted-foreground">A list of lessons the student is enrolled in will be shown here.</p>
                         {/* Placeholder for lesson list */}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
  };
  
  return (
    <>
      <PageHeader
        title={studentLoading ? 'Loading Profile...' : `Student Profile`}
        description={studentLoading ? '' : `Details for ${student?.firstName || 'Student'}`}
      />
      {studentLoading ? renderLoadingSkeleton() : renderProfile()}
    </>
  );
}
