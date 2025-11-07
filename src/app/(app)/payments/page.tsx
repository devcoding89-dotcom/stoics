'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import type { Payment, User as AppUser } from '@/lib/types';
import { collection, query, orderBy, collectionGroup } from 'firebase/firestore';
import { format } from 'date-fns';
import { CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PaymentsPage() {
  const { user, userProfile } = useUser();
  const firestore = useFirestore();

  const isStudent = userProfile?.role === 'student';
  const isAdmin = userProfile?.role === 'admin';

  // The query depends on the user's role
  const paymentsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;

    if (isStudent) {
      // Students see only their own payments
      return query(collection(firestore, 'users', user.uid, 'payments'), orderBy('paymentDate', 'desc'));
    }
    if (isAdmin) {
      // Admins see all payments across all users
      return query(collectionGroup(firestore, 'payments'), orderBy('paymentDate', 'desc'));
    }
    return null; // No query for other roles
  }, [firestore, user, isStudent, isAdmin]);

  const { data: payments, isLoading: paymentsLoading } = useCollection<Payment>(paymentsQuery);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };
  
  const pageTitle = isStudent ? 'Your Payment History' : 'All Platform Payments';
  const pageDescription = isStudent ? 'Here is a record of all your payments.' : 'Here is a record of all payments made on the platform.';

  if (!isStudent && !isAdmin) {
    return (
        <div className="flex h-full w-full items-center justify-center">
            <p className="text-muted-foreground">You do not have permission to view this page.</p>
        </div>
    )
  }

  return (
    <>
      <PageHeader
        title={pageTitle}
        description={pageDescription}
        action={isStudent && <Button>Make a Payment</Button>}
      />
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-primary" />
            <CardTitle>Payments</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="hidden sm:table-cell">Payment Method</TableHead>
                <TableHead className="hidden md:table-cell">Transaction ID</TableHead>
                {isAdmin && <TableHead>Student ID</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentsLoading && (
                <TableRow>
                  <TableCell colSpan={isAdmin ? 5 : 4} className="text-center">
                    Loading payments...
                  </TableCell>
                </TableRow>
              )}
              {!paymentsLoading && payments && payments.length > 0 ? (
                payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{format(new Date(payment.paymentDate), 'PPP')}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(payment.amount)}</TableCell>
                    <TableCell className="hidden sm:table-cell">{payment.paymentMethod}</TableCell>
                    <TableCell className="hidden md:table-cell truncate max-w-xs">{payment.transactionId}</TableCell>
                    {isAdmin && <TableCell>{payment.studentId}</TableCell>}
                  </TableRow>
                ))
              ) : (
                !paymentsLoading && (
                  <TableRow>
                    <TableCell colSpan={isAdmin ? 5 : 4} className="text-center">
                      No payments found.
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
