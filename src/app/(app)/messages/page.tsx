'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { ChatContact, ChatMessage } from '@/lib/types';

const contacts: ChatContact[] = [
    { id: 'teacher-1', name: 'Dr. Evelyn Reed', avatar: 'https://i.pravatar.cc/150?u=teacher1', role: 'teacher', lastMessage: 'Please submit your assignment.', lastMessageTime: '10:42 AM' },
    { id: 'parent-1', name: 'John Doe', avatar: 'https://i.pravatar.cc/150?u=parent1', role: 'parent', lastMessage: 'How is Alex performing?', lastMessageTime: 'Yesterday' },
];

const messages: ChatMessage[] = [
    { id: '1', senderId: 'teacher-1', recipientId: 'student-1', message: 'Hello Alex, how are you preparing for the test?', timestamp: '10:30 AM' },
    { id: '2', senderId: 'student-1', recipientId: 'teacher-1', message: 'I\'m doing well, Dr. Reed. Just reviewing the notes.', timestamp: '10:32 AM' },
    { id: '3', senderId: 'teacher-1', recipientId: 'student-1', message: 'Great! Let me know if you have any questions.', timestamp: '10:33 AM' },
    { id: '4', senderId: 'teacher-1', recipientId: 'student-1', message: 'Please submit your assignment.', timestamp: '10:42 AM' },
];


export default function MessagesPage() {
    const selectedContact = contacts[0];

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col">
            <PageHeader
                title="Messages"
                description="Communicate with your teachers and parents."
            />
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
                <Card className="md:col-span-1 h-full flex flex-col">
                    <CardHeader>
                        <CardTitle>Contacts</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 p-0">
                        <ScrollArea className="h-full">
                            <div className="space-y-2 p-2">
                                {contacts.map(contact => (
                                    <div key={contact.id} className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-muted bg-muted">
                                        <Avatar>
                                            <AvatarImage src={contact.avatar} />
                                            <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <p className="font-semibold">{contact.name}</p>
                                            <p className="text-sm text-muted-foreground truncate">{contact.lastMessage}</p>
                                        </div>
                                        <span className="text-xs text-muted-foreground">{contact.lastMessageTime}</span>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
                <Card className="md:col-span-2 h-full flex flex-col">
                     <CardHeader className="flex flex-row items-center gap-3">
                        <Avatar>
                            <AvatarImage src={selectedContact.avatar} />
                            <AvatarFallback>{selectedContact.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle>{selectedContact.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{selectedContact.role}</p>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col gap-4">
                        <ScrollArea className="flex-1 h-full p-4 border rounded-lg">
                           <div className="space-y-4">
                                {messages.map(msg => (
                                    <div key={msg.id} className={`flex ${msg.senderId === 'student-1' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`p-3 rounded-lg max-w-xs ${msg.senderId === 'student-1' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                            <p>{msg.message}</p>
                                            <p className={`text-xs mt-1 ${msg.senderId === 'student-1' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{msg.timestamp}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                         <div className="flex items-center gap-2">
                            <Input placeholder="Type your message..." className="flex-1" />
                            <Button>Send</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
