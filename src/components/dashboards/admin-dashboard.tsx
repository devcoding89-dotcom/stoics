'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { User as FirebaseUser } from 'firebase/auth';
import type { User as AppUser } from '@/lib/types';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { capitalize } from '@/lib/utils';
import { UserCheck } from 'lucide-react';

interface AdminDashboardProps {
  user: FirebaseUser;
  userProfile: AppUser;
}

export function AdminDashboard({ user, userProfile }: AdminDashboardProps) {
  const welcomeName = userProfile.firstName || user.displayName || 'Admin';
  const firestore = useFirestore();

  // Fetch all users
  const usersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'users'), orderBy('lastName', 'asc'));
  }, [firestore]);
  const { data: users, isLoading: usersLoading } = useCollection<AppUser>(usersQuery);

  return (
    <>
      <PageHeader
        title="Admin Dashboard"
        description={`Welcome, ${welcomeName}. Manage the platform here.`}
      />
      <div className="grid gap-6 md:grid-cols-1">
        <Card>
          <CardHeader>
             <div className="flex items-center gap-2">
                <UserCheck className="h-6 w-6 text-primary" />
                <CardTitle>User Management</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usersLoading && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">Loading users...</TableCell>
                  </TableRow>
                )}
                {!usersLoading && users && users.length > 0 ? (
                  users.map(u => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{`${u.firstName} ${u.lastName}`}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{capitalize(u.role)}</TableCell>
                      <TableCell>
                        <Badge variant={u.verified ? 'default' : 'secondary'}>
                          {u.verified ? 'Verified' : 'Unverified'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  !usersLoading && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        No users found.
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
