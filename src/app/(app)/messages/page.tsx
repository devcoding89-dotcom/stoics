'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

export default function MessagesPage() {
  return (
    <div className="h-full flex flex-col">
      <PageHeader
        title="Messages"
        description="Communicate with others in the system."
      />
      <Card className="flex-1">
        <CardContent className="h-full flex flex-col items-center justify-center text-muted-foreground gap-4 p-6">
          <MessageSquare className="h-16 w-16" />
          <div className="text-center">
            <h2 className="text-xl font-semibold">Messaging is Coming Soon</h2>
            <p>This feature is currently under construction. Check back later!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
