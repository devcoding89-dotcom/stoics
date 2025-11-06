'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { ChatContact, ChatMessage, Announcement, User as AppUser } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Send, Megaphone, PlusCircle, MessagesSquare } from 'lucide-react';
import { useUser, useCollection, useMemoFirebase } from '@/firebase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getFirestore, collection, query, orderBy } from 'firebase/firestore';
import { format } from 'date-fns';

const Announcements = () => {
  const { userProfile } = useUser();
  const firestore = getFirestore();
  const announcementsQuery = useMemoFirebase(() => query(collection(firestore, 'announcements'), orderBy('timestamp', 'desc')), [firestore]);
  const { data: announcements, isLoading } = useCollection<Announcement>(announcementsQuery);
  const canAnnounce = userProfile?.role === 'teacher' || userProfile?.role === 'admin';
  
  return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle>Announcements</CardTitle>
            <CardDescription>Important updates for everyone.</CardDescription>
          </div>
          {canAnnounce && (
             <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Announcement
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {isLoading && <p>Loading announcements...</p>}
          <div className="space-y-6">
            {!isLoading && announcements && announcements.map((ann) => (
              <div key={ann.id} className="flex items-start gap-4">
                 <div className="bg-primary/10 p-3 rounded-full">
                    <Megaphone className="h-6 w-6 text-primary" />
                 </div>
                 <div>
                  <p className="font-semibold">{ann.title}</p>
                  <p className="text-sm text-muted-foreground">{ann.content}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {/* TODO: Fetch author name */}
                    {ann.authorId} - {format(new Date(ann.timestamp), 'MMMM d, yyyy')}
                  </p>
                 </div>
              </div>
            ))}
            {!isLoading && (!announcements || announcements.length === 0) && <p>No announcements.</p>}
          </div>
        </CardContent>
      </Card>
  )
}

const Chat = () => {
  const { userProfile } = useUser();
  const firestore = getFirestore();
  
  const usersQuery = useMemoFirebase(() => {
    if (userProfile?.role !== 'admin') return null; // Only admins can list all users
    return query(collection(firestore, 'users'));
  }, [firestore, userProfile]);

  const { data: users, isLoading: usersLoading } = useCollection<AppUser>(usersQuery);
  const [selectedContact, setSelectedContact] = React.useState<AppUser | null>(null);

  // Chat messages would be fetched based on selectedContact
  // e.g., collection(firestore, 'chats', chatId, 'messages')

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 h-full">
      <Card className="col-span-1 flex flex-col">
        <CardHeader>
          <CardTitle>Contacts</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow overflow-auto p-2">
          {usersLoading && <p>Loading contacts...</p>}
          <div className="flex flex-col gap-1">
            {!usersLoading && users && users.map(user => (
              <button
                key={user.id}
                onClick={() => setSelectedContact(user)}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-lg text-left w-full transition-colors",
                  selectedContact?.id === user.id ? "bg-muted" : "hover:bg-muted/50"
                )}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar} alt={user.firstName} />
                  <AvatarFallback>{user.firstName?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-grow overflow-hidden">
                  <p className="font-semibold truncate">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.role}</p>
                </div>
              </button>
            ))}
            {!usersLoading && userProfile?.role !== 'admin' && (
              <p className="p-2 text-xs text-muted-foreground">User list is only available to admins.</p>
            )}
          </div>
        </CardContent>
      </Card>
      <Card className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col h-full">
        {selectedContact ? (
          <>
            <CardHeader className="flex flex-row items-center gap-3 border-b">
              <Avatar className="h-10 w-10">
                <AvatarImage src={selectedContact.avatar} alt={selectedContact.firstName} />
                <AvatarFallback>{selectedContact.firstName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{selectedContact.firstName} {selectedContact.lastName}</CardTitle>
                <CardDescription>{selectedContact.role}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex-grow overflow-auto p-4 space-y-4">
              <p>Chat messages would appear here. This feature is not fully implemented.</p>
            </CardContent>
            <div className="p-4 border-t">
              <div className="relative">
                <Input placeholder="Type a message..." className="pr-12" />
                <Button size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <MessagesSquare className="h-12 w-12 mb-4" />
            <p>Select a contact to start chatting.</p>
          </div>
        )}
      </Card>
    </div>
  )
}

export default function CommunicationPage() {
  const { userProfile } = useUser();
  if (!userProfile) return null;

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      <PageHeader
        title="Communication Hub"
        description="Connect with teachers, students, and parents."
      />
      <Tabs defaultValue="chat" className="flex-grow flex flex-col">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
        </TabsList>
        <TabsContent value="chat" className="flex-grow mt-4">
          <Chat />
        </TabsContent>
        <TabsContent value="announcements" className="flex-grow mt-4">
          <Announcements />
        </TabsContent>
      </Tabs>
    </div>
  );
}
