'use client';

import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, addDoc, serverTimestamp, or } from 'firebase/firestore';
import type { User as AppUser, ChatMessage } from '@/lib/types';

export default function MessagesPage() {
    const { user, userProfile } = useUser();
    const firestore = useFirestore();
    const [selectedContact, setSelectedContact] = useState<AppUser | null>(null);
    const [message, setMessage] = useState('');

    // Fetch all users to act as contacts, excluding the current user
    const usersQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'users'));
    }, [firestore]);
    const { data: users, isLoading: usersLoading } = useCollection<AppUser>(usersQuery);

    const contacts = useMemo(() => {
        if (!users || !user) return [];
        return users.filter(u => u.id !== user.uid);
    }, [users, user]);

    // Set the first contact as selected by default
    useState(() => {
        if (!selectedContact && contacts.length > 0) {
            setSelectedContact(contacts[0]);
        }
    });
     
    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useMemo(() => {
        if (!selectedContact && contacts.length > 0) {
            setSelectedContact(contacts[0]);
        }
    }, [contacts]);


    // Fetch messages between the current user and the selected contact
    const messagesQuery = useMemoFirebase(() => {
        if (!firestore || !user || !selectedContact) return null;
        const chatMessagesRef = collection(firestore, 'chat_messages');
        return query(
            chatMessagesRef,
            or(
                where('senderId', '==', user.uid),
                where('senderId', '==', selectedContact.id)
            ),
            orderBy('timestamp', 'asc')
        );
    }, [firestore, user, selectedContact]);

    const { data: rawMessages, isLoading: messagesLoading } = useCollection<ChatMessage>(messagesQuery);
    
    const messages = useMemo(() => {
        if (!rawMessages || !user || !selectedContact) return [];
         return rawMessages.filter(m => 
            (m.senderId === user.uid && m.recipientId === selectedContact.id) ||
            (m.senderId === selectedContact.id && m.recipientId === user.uid)
        );

    }, [rawMessages, user, selectedContact]);

    const handleSendMessage = async () => {
        if (!message.trim() || !user || !selectedContact || !firestore) return;

        const chatMessagesRef = collection(firestore, 'chat_messages');
        await addDoc(chatMessagesRef, {
            senderId: user.uid,
            recipientId: selectedContact.id,
            message: message,
            timestamp: serverTimestamp(),
        });
        setMessage('');
    };

    const handleContactSelect = (contact: AppUser) => {
        setSelectedContact(contact);
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col">
            <PageHeader
                title="Messages"
                description="Communicate with others in the system."
            />
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
                <Card className="md:col-span-1 h-full flex flex-col">
                    <CardHeader>
                        <CardTitle>Contacts</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 p-0">
                        <ScrollArea className="h-full">
                            <div className="space-y-1 p-2">
                                {usersLoading && <p className="p-2 text-muted-foreground">Loading contacts...</p>}
                                {!usersLoading && contacts.map(contact => (
                                    <div 
                                        key={contact.id} 
                                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-muted ${selectedContact?.id === contact.id ? 'bg-muted' : ''}`}
                                        onClick={() => handleContactSelect(contact)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleContactSelect(contact)}
                                        role="button"
                                        tabIndex={0}
                                    >
                                        <Avatar>
                                            <AvatarImage src={contact.avatar} />
                                            <AvatarFallback>{contact.firstName?.charAt(0)}{contact.lastName?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <p className="font-semibold">{contact.firstName} {contact.lastName}</p>
                                            <p className="text-sm text-muted-foreground truncate capitalize">{contact.role}</p>
                                        </div>
                                    </div>
                                ))}
                                {!usersLoading && contacts.length === 0 && <p className="p-2 text-muted-foreground">No contacts found.</p>}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
                <Card className="md:col-span-2 h-full flex flex-col">
                     {selectedContact ? (
                        <>
                            <CardHeader className="flex flex-row items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={selectedContact.avatar} />
                                    <AvatarFallback>{selectedContact.firstName?.charAt(0)}{selectedContact.lastName?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle>{selectedContact.firstName} {selectedContact.lastName}</CardTitle>
                                    <p className="text-sm text-muted-foreground capitalize">{selectedContact.role}</p>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col gap-4">
                                <ScrollArea className="flex-1 h-full p-4 border rounded-lg">
                                <div className="space-y-4">
                                    {messagesLoading && <p className="text-center text-muted-foreground">Loading messages...</p>}
                                    {!messagesLoading && messages.map(msg => (
                                        <div key={msg.id} className={`flex ${msg.senderId === user?.uid ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`p-3 rounded-lg max-w-xs lg:max-w-md ${msg.senderId === user?.uid ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                                <p>{msg.message}</p>
                                                {msg.timestamp && (
                                                    <p className={`text-xs mt-1 ${msg.senderId === user?.uid ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                                                        {new Date(msg.timestamp.seconds * 1000).toLocaleTimeString()}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {!messagesLoading && messages.length === 0 && (
                                        <p className="text-center text-muted-foreground">No messages yet. Start the conversation!</p>
                                    )}
                                </div>
                                </ScrollArea>
                                <div className="flex items-center gap-2">
                                    <Input 
                                        placeholder="Type your message..." 
                                        className="flex-1" 
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                    />
                                    <Button onClick={handleSendMessage} disabled={!message.trim()}>Send</Button>
                                </div>
                            </CardContent>
                        </>
                     ) : (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                            <p>Select a contact to start chatting</p>
                        </div>
                     )}
                </Card>
            </div>
        </div>
    )
}
