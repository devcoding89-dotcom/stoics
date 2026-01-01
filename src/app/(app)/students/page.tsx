'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { User as AppUser } from '@/lib/types';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { capitalize } from '@/lib/utils';
import { Users, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';

export default function StudentsPage() {
  const firestore = useFirestore();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all users with the 'student' role
  const studentsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'users'),
      where('role', '==', 'student'),
      orderBy('lastName', 'asc')
    );
  }, [firestore]);
  
  const { data: students, isLoading: studentsLoading } = useCollection<AppUser>(studentsQuery);

  const filteredStudents = students?.filter(student =>
    `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.registrationNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRowClick = (studentId: string) => {
    router.push(`/students/${studentId}`);
  };

  return (
    <>
      <PageHeader
        title="Students"
        description="Browse and manage all students on the platform."
      />
      <Card>
        <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Users className="h-6 w-6" />
                    <h3 className="text-xl font-semibold">All Students</h3>
                </div>
                 <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name, email, or Reg. No..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Reg. Number</TableHead>
                  <TableHead className="hidden sm:table-cell">Email</TableHead>
                  <TableHead className="hidden md:table-cell">Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentsLoading && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">Loading students...</TableCell>
                  </TableRow>
                )}
                {!studentsLoading && filteredStudents && filteredStudents.length > 0 ? (
                  filteredStudents.map(student => (
                    <TableRow key={student.id} onClick={() => handleRowClick(student.id)} className="cursor-pointer">
                      <TableCell>
                        <div className="flex items-center gap-3">
                           <Avatar className="h-9 w-9">
                                <AvatarImage src={student.avatar} alt={`${student.firstName} ${student.lastName}`} />
                                <AvatarFallback>{student.firstName?.charAt(0)}{student.lastName?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="font-medium">{`${student.firstName} ${student.lastName}`}</div>
                        </div>
                      </TableCell>
                      <TableCell>{student.registrationNumber || 'N/A'}</TableCell>
                      <TableCell className="hidden sm:table-cell">{student.email}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {student.createdAt ? `${formatDistanceToNow(student.createdAt.toDate())} ago` : 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  !studentsLoading && (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        No students found.
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
        </CardContent>
      </Card>
    </>
  );
}
