
'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { User as FirebaseUser } from 'firebase/auth';
import type { User as AppUser, UserRole } from '@/lib/types';
import { useCollection, useFirestore, useMemoFirebase, updateDocumentNonBlocking } from '@/firebase';
import { collection, query, orderBy, doc } from 'firebase/firestore';
import { capitalize } from '@/lib/utils';
import { Edit, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface AdminDashboardProps {
  user: FirebaseUser;
  userProfile: AppUser;
}

export function AdminDashboard({ user, userProfile }: AdminDashboardProps) {
  const welcomeName = userProfile.firstName || user.displayName || 'Admin';
  const firestore = useFirestore();
  const { toast } = useToast();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');

  // This query is now safe because the /admin page route guard ensures only admins can access it,
  // and security rules also enforce this.
  const usersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'users'), orderBy('lastName', 'asc'));
  }, [firestore]);
  
  const { data: users, isLoading: usersLoading } = useCollection<AppUser>(usersQuery);

  const handleEditClick = (userToEdit: AppUser) => {
    setSelectedUser(userToEdit);
    setSelectedRole(userToEdit.role);
    setIsEditDialogOpen(true);
  };

  const handleRoleChange = (value: string) => {
    setSelectedRole(value as UserRole);
  };

  const handleSaveChanges = async () => {
    if (!selectedUser || !firestore) return;

    const userRef = doc(firestore, 'users', selectedUser.id);
    try {
      await updateDocumentNonBlocking(userRef, { role: selectedRole });
      toast({
        title: 'User Updated',
        description: `${selectedUser.firstName} ${selectedUser.lastName}'s role has been changed to ${selectedRole}.`,
      });
    } catch (error) {
      console.error("Error updating user role:", error);
      toast({
        title: 'Update Failed',
        description: 'Could not update the user role. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsEditDialogOpen(false);
      setSelectedUser(null);
    }
  };

  return (
    <>
      <PageHeader
        title="Admin Control Panel"
        description={`Welcome, ${welcomeName}. Manage all users and platform settings.`}
      />
      <div className="grid gap-6 md:grid-cols-1">
        <Card>
          <CardHeader>
             <div className="flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                <CardTitle>User Management</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usersLoading && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">Loading users...</TableCell>
                  </TableRow>
                )}
                {!usersLoading && users && users.length > 0 ? (
                  users.map(u => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{`${u.firstName} ${u.lastName}`}</TableCell>
                      <TableCell className="hidden sm:table-cell">{u.email}</TableCell>
                      <TableCell>{capitalize(u.role)}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge variant={u.verified ? 'default' : 'secondary'}>
                          {u.verified ? 'Verified' : 'Unverified'}
                        </Badge>
                      </TableCell>
                       <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleEditClick(u)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit User</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  !usersLoading && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
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

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User Role</DialogTitle>
            <DialogDescription>
              Change the role for {selectedUser?.firstName} {selectedUser?.lastName}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={selectedRole} onValueChange={handleRoleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="teacher">Teacher</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveChanges}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
