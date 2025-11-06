'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Homework } from '@/lib/types';
import { capitalize } from '@/lib/utils';


const homeworkData: Homework[] = [
    { id: '1', studentName: 'Alex Doe', subject: 'Math', status: 'completed', submittedDate: '2023-10-26' },
    { id: '2', studentName: 'Alex Doe', subject: 'Science', status: 'pending', submittedDate: '2023-10-27' },
    { id: '3', studentName: 'Alex Doe', subject: 'History', status: 'completed', submittedDate: '2023-10-25' },
    { id: '4', studentName: 'Alex Doe', subject: 'English', status: 'pending', submittedDate: '2023-10-28' },
];


export default function HomeworkPage() {
  return (
    <>
      <PageHeader
        title="Homework"
        description="Here is a list of all your homework assignments."
      />
      <Card>
        <CardHeader>
          <CardTitle>All Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {homeworkData.map((hw) => (
                <TableRow key={hw.id}>
                  <TableCell className="font-medium">{hw.subject}</TableCell>
                  <TableCell>
                    <Badge
                      variant={hw.status === 'completed' ? 'default' : 'secondary'}
                      className={hw.status === 'completed' ? 'bg-green-500/80' : ''}
                    >
                      {capitalize(hw.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>{hw.submittedDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
