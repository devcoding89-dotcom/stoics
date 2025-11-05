'use client';

import React from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { mockContacts, mockMessages, mockAnnouncements } from '@/lib/data';
import type { ChatContact, ChatMessage } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Send, Megaphone, PlusCircle } from 'lucide-react';
import { useUser } from '@/context/user-context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


export default function CommunicationPage() {
  const { user } = useUser();
  const [selectedContact, setSelectedContact] = React.useState<ChatContact>(mockContacts[0]);
  const messages = mockMessages[selectedContact.id] || [];
  const canAnnounce = user.role === 'teacher' || user.role === 'admin';

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
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 h-full">
            <Card className="col-span-1 flex flex-col">
              <CardHeader>
                <CardTitle>Contacts</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow overflow-auto p-2">
                <div className="flex flex-col gap-1">
                  {mockContacts.map(contact => (
                    <button
                      key={contact.id}
                      onClick={() => setSelectedContact(contact)}
                      className={cn(
                        "flex items-center gap-3 p-2 rounded-lg text-left w-full transition-colors",
                        selectedContact.id === contact.id ? "bg-muted" : "hover:bg-muted/50"
                      )}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={contact.avatar} alt={contact.name} />
                        <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-grow overflow-hidden">
                        <p className="font-semibold truncate">{contact.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{contact.lastMessage}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col h-full">
              <CardHeader className="flex flex-row items-center gap-3 border-b">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedContact.avatar} alt={selectedContact.name} />
                  <AvatarFallback>{selectedContact.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{selectedContact.name}</CardTitle>
                  <CardDescription>{selectedContact.role}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex-grow overflow-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex items-end gap-2 max-w-xs",
                      message.isMe ? "ml-auto flex-row-reverse" : "mr-auto"
                    )}
                  >
                    <div
                      className={cn(
                        "rounded-lg px-3 py-2",
                        message.isMe ? "bg-primary text-primary-foreground" : "bg-muted"
                      )}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
              <div className="p-4 border-t">
                <div className="relative">
                  <Input placeholder="Type a message..." className="pr-12" />
                  <Button size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="announcements" className="flex-grow mt-4">
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
              <div className="space-y-6">
                {mockAnnouncements.map((ann) => (
                  <div key={ann.id} className="flex items-start gap-4">
                     <div className="bg-primary/10 p-3 rounded-full">
                        <Megaphone className="h-6 w-6 text-primary" />
                     </div>
                     <div>
                      <p className="font-semibold">{ann.title}</p>
                      <p className="text-sm text-muted-foreground">{ann.content}</p>
                      <p className="text-xs text-muted-foreground mt-1">{ann.author} ({ann.role}) - {ann.date}</p>
                     </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
