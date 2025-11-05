'use client';

import React from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
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
import { useUser } from '@/context/user-context';
import { mockPayments } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { CreditCard, DollarSign } from 'lucide-react';
import { capitalize } from '@/lib/utils';

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
            Enter payment details below. Click submit when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Cardholder Name
            </Label>
            <Input id="name" defaultValue="Maria Garcia" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="card-number" className="text-right">
              Card Number
            </Label>
            <Input id="card-number" placeholder="**** **** **** 1234" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="expiry" className="text-right">
              Expiry
            </Label>
            <Input id="expiry" placeholder="MM/YY" className="col-span-3" />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="cvc" className="text-right">
              CVC
            </Label>
            <Input id="cvc" placeholder="123" className="col-span-3" />
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
  const { user } = useUser();
  const canMakePayment = user.role === 'parent' || user.role === 'admin';

  const pageDetails = {
    student: { title: "My Payments", description: "Here is your payment history." },
    teacher: { title: "My Earnings", description: "An overview of your payments received." },
    parent: { title: "Manage Payments", description: "Manage and view payment history for your child." },
    admin: { title: "All Payments", description: "An overview of all payments in the system." },
  };

  const { title, description } = pageDetails[user.role];

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
                <TableHead>Student</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-mono text-xs">{payment.id}</TableCell>
                  <TableCell className="font-medium">{payment.studentName}</TableCell>
                  <TableCell>${payment.amount.toFixed(2)}</TableCell>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell>
                    <Badge variant={payment.status === 'paid' ? 'default' : 'secondary'}
                      className={
                        payment.status === 'paid' ? 'bg-green-100 text-green-800' :
                        payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                      }
                    >
                      {capitalize(payment.status)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
