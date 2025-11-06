'use client';

import React from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { useUser, useCollection, useMemoFirebase, useFirestore } from '@/firebase';
import { getFirestore, collection, doc, updateDoc } from 'firebase/firestore';
import type { User } from '@/lib/types';
import { capitalize } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function ManageUsersPage() {
  const { userProfile } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const usersQuery = useMemoFirebase(() => {
    if (!firestore || !userProfile) return null;
    return collection(firestore, 'users')
  }, [firestore, userProfile]);
  const { data: users, isLoading } = useCollection<User>(usersQuery);

  if (!userProfile || userProfile.role !== 'admin') {
    return (
      <Card className="text-center p-8">
        <h3 className="mt-4 text-lg font-semibold">Access Denied</h3>
        <p className="mt-2 text-sm text-muted-foreground">This page is only available to administrators.</p>
      </Card>
    );
  }

  const handleVerificationChange = async (userId: string, verified: boolean) => {
    const userRef = doc(firestore, 'users', userId);
    try {
      await updateDoc(userRef, { verified });
      toast({
        title: 'Success',
        description: `User verification status updated.`,
      });
    } catch (error) {
      console.error("Failed to update user verification", error);
      toast({
        title: 'Error',
        description: 'Failed to update user status.',
        variant: 'destructive'
      });
    }
  };

  return (
    <>
      <PageHeader
        title="Manage Users"
        description="View and manage user accounts and verification status."
      />
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-center">Verified</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && <TableRow><TableCell colSpan={4} className="text-center">Loading users...</TableCell></TableRow>}
              {!isLoading && users && users.map(user => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user.avatar} alt={user.firstName} />
                        <AvatarFallback>{user.firstName?.charAt(0) || 'U'}</AvatarFallback>
                      </Avatar>
                      <div className="font-medium">{user.firstName} {user.lastName}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{capitalize(user.role)}</Badge>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={user.verified}
                      onCheckedChange={(checked) => handleVerificationChange(user.id, checked)}
                      aria-label={`Verification status for ${user.firstName}`}
                      disabled={user.id === userProfile.id} // Admin can't un-verify themselves
                    />
                  </TableCell>
                </TableRow>
              ))}
               {!isLoading && (!users || users.length === 0) && <TableRow><TableCell colSpan={4} className="text-center">No users found.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
