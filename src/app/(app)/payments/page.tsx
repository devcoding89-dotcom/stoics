
'use client';

import React from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUser, useCollection, useMemoFirebase, useFirestore } from '@/firebase';
import type { Payment } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { DollarSign } from 'lucide-react';
import { capitalize } from '@/lib/utils';
import { format } from 'date-fns';
import { collection, query, orderBy, collectionGroup } from 'firebase/firestore';

function PaymentDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <DollarSign className="mr-2 h-4 w-4" />
          Make Payment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Make a Payment</DialogTitle>
          <DialogDescription>
            This is a mock payment form. No real transaction will be made.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Cardholder Name
            </Label>
            <Input id="name" defaultValue="Jane Doe" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="card-number" className="text-right">
              Card Number
            </Label>
            <Input id="card-number" placeholder="**** **** **** 1234" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Submit Payment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function PaymentsPage() {
  const { user, userProfile } = useUser();
  const firestore = useFirestore();

  const paymentsQuery = useMemoFirebase(() => {
    if (!user || !userProfile || !firestore) return null;
    
    // Admins see all payments. Students/parents see their own. Teachers don't see this collection directly.
    if (userProfile.role === 'admin') {
      return query(collectionGroup(firestore, 'payments'), orderBy('paymentDate', 'desc'));
    }
    if (userProfile.role === 'student' || userProfile.role === 'parent') {
      return query(collection(firestore, 'users', user.uid, 'payments'), orderBy('paymentDate', 'desc'));
    }
    return null;
  }, [firestore, user, userProfile]);

  const { data: payments, isLoading } = useCollection<Payment>(paymentsQuery);

  if (!userProfile) return null;

  const canMakePayment = userProfile.role === 'parent' || userProfile.role === 'student';

  const pageDetails = {
    student: { title: "My Payments", description: "Here is your payment history." },
    teacher: { title: "My Earnings", description: "An overview of your payments received." },
    parent: { title: "Manage Payments", description: "Manage and view payment history for your child." },
    admin: { title: "All Payments", description: "An overview of all payments in the system." },
  };

  const { title, description } = pageDetails[userProfile.role];

  if (userProfile.role === 'teacher') {
    return (
      <>
        <PageHeader title={title} description={description} />
        <Card>
          <CardContent className="pt-6">
            <p>Teacher earnings are not yet implemented.</p>
          </CardContent>
        </Card>
      </>
    )
  }

  return (
    <>
      <PageHeader
        title={title}
        description={description}
        action={canMakePayment && <PaymentDialog />}
      />
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Student ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && <TableRow><TableCell colSpan={5} className="text-center">Loading payments...</TableCell></TableRow>}
              {!isLoading && payments && payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-mono text-xs">{payment.transactionId}</TableCell>
                  <TableCell className="font-medium">{payment.studentId}</TableCell>
                  <TableCell>${payment.amount.toFixed(2)}</TableCell>
                  <TableCell>{format(new Date(payment.paymentDate), "MM/dd/yyyy")}</TableCell>
                  <TableCell>
                    <Badge>Paid</Badge>
                  </TableCell>
                </TableRow>
              ))}
              {!isLoading && (!payments || payments.length === 0) && <TableRow><TableCell colSpan={5} className="text-center">No payments found.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
