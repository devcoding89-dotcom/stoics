'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCollection, useFirestore, useMemoFirebase, useUser, updateDocumentNonBlocking } from '@/firebase';
import type { Payment } from '@/lib/types';
import { collection, query, orderBy, collectionGroup, doc } from 'firebase/firestore';
import { format } from 'date-fns';
import { CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { capitalize } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export default function PaymentsPage() {
  const { user, userProfile } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [payingId, setPayingId] = useState<string | null>(null);

  const isStudent = userProfile?.role === 'student';
  const isAdmin = userProfile?.role === 'admin';

  // The query depends on the user's role
  const paymentsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;

    if (isStudent) {
      // Students see only their own payments, ordered by due date
      return query(collection(firestore, 'users', user.uid, 'payments'), orderBy('dueDate', 'desc'));
    }
    if (isAdmin) {
      // Admins see all payments across all users, ordered by due date
      return query(collectionGroup(firestore, 'payments'), orderBy('dueDate', 'desc'));
    }
    return null; // No query for other roles
  }, [firestore, user, isStudent, isAdmin]);

  const { data: payments, isLoading: paymentsLoading } = useCollection<Payment>(paymentsQuery);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };
  
  const handlePayNow = async (payment: Payment) => {
    if (!user || !firestore) return;
    setPayingId(payment.id);
    
    const paymentRef = doc(firestore, 'users', user.uid, 'payments', payment.id);
    const updatedData = {
      status: 'paid' as const,
      paymentDate: new Date().toISOString(),
    };

    try {
      await updateDocumentNonBlocking(paymentRef, updatedData);
      toast({
        title: 'Payment Successful',
        description: 'Your payment has been recorded.',
      });
    } catch (error) {
       console.error("Payment Error: ", error);
       toast({
        title: 'Payment Failed',
        description: 'Could not process your payment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setPayingId(null);
    }
  };

  const pageTitle = isStudent ? 'Your Payments' : 'All Platform Payments';
  const pageDescription = isStudent ? 'A record of your scheduled and completed payments.' : 'A record of all payments made on the platform.';

  if (!isStudent && !isAdmin) {
    return (
        <div className="flex h-full w-full items-center justify-center">
            <p className="text-muted-foreground">You do not have permission to view this page.</p>
        </div>
    )
  }

  const getStatusVariant = (status: 'pending' | 'paid' | 'overdue') => {
    switch (status) {
      case 'paid':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'overdue':
        return 'destructive';
      default:
        return 'outline';
    }
  }

  return (
    <>
      <PageHeader
        title={pageTitle}
        description={pageDescription}
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
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                {isAdmin && <TableHead>Student ID</TableHead>}
                {isStudent && <TableHead className="text-right">Action</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentsLoading && (
                <TableRow>
                  <TableCell colSpan={isStudent ? 5 : 4} className="text-center">
                    Loading payments...
                  </TableCell>
                </TableRow>
              )}
              {!paymentsLoading && payments && payments.length > 0 ? (
                payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.description}</TableCell>
                    <TableCell>{formatCurrency(payment.amount)}</TableCell>
                    <TableCell>{format(new Date(payment.dueDate), 'PPP')}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(payment.status)}>
                        {capitalize(payment.status)}
                      </Badge>
                    </TableCell>
                    {isAdmin && <TableCell>{payment.studentId}</TableCell>}
                    {isStudent && (
                      <TableCell className="text-right">
                        {payment.status === 'pending' || payment.status === 'overdue' ? (
                          <Button 
                            size="sm" 
                            onClick={() => handlePayNow(payment)}
                            disabled={payingId === payment.id}
                          >
                            {payingId === payment.id ? 'Processing...' : 'Pay Now'}
                          </Button>
                        ) : (
                          <span className="text-sm text-muted-foreground">Paid on {payment.paymentDate ? format(new Date(payment.paymentDate), 'PPP') : '-'}</span>
                        )}
                      </TableCell>
                    )}
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
