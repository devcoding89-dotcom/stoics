'use client';

import { useState, useRef, useEffect } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking } from '@/firebase';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn, capitalize } from '@/lib/utils';
import { Send, Search } from 'lucide-react';
import type { User as AppUser, ChatMessage as AppChatMessage } from '@/lib/types';
import { collection, query, where, orderBy, serverTimestamp } from 'firebase/firestore';

export default function MessagesPage() {
  const { user: currentUser, userProfile: currentUserProfile } = useUser();
  const firestore = useFirestore();
  const [selectedContact, setSelectedContact] = useState<AppUser | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Fetch all users to act as contacts, excluding the current user
  const usersQuery = useMemoFirebase(() => {
    if (!firestore || !currentUser) return null;
    return query(collection(firestore, 'users'), where('id', '!=', currentUser.uid));
  }, [firestore, currentUser]);
  const { data: contacts, isLoading: contactsLoading } = useCollection<AppUser>(usersQuery);

  // Fetch messages for the selected chat
  const messagesQuery = useMemoFirebase(() => {
    if (!firestore || !currentUser || !selectedContact) return null;
    return query(
      collection(firestore, 'chat_messages'),
      where('participantIds', 'array-contains', currentUser.uid),
      orderBy('timestamp', 'asc')
    );
  }, [firestore, currentUser, selectedContact]);

  const { data: allMessages, isLoading: messagesLoading } = useCollection<AppChatMessage>(messagesQuery);
  
  const currentChatMessages = useMemo(() => {
    if (!allMessages || !selectedContact || !currentUser) return [];
    return allMessages.filter(msg => 
      (msg.senderId === currentUser.uid && msg.recipientId === selectedContact.id) ||
      (msg.senderId === selectedContact.id && msg.recipientId === currentUser.uid)
    );
  }, [allMessages, selectedContact, currentUser]);


  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !currentUser || !selectedContact || !firestore) return;

    const messagesRef = collection(firestore, 'chat_messages');
    const messageData = {
      senderId: currentUser.uid,
      recipientId: selectedContact.id,
      participantIds: [currentUser.uid, selectedContact.id], // For easier querying
      message: newMessage,
      timestamp: serverTimestamp(),
    };

    addDocumentNonBlocking(messagesRef, messageData);
    setNewMessage('');
  };
  
    // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
        const scrollable = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (scrollable) {
            scrollable.scrollTop = scrollable.scrollHeight;
        }
    }
  }, [currentChatMessages]);


  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <PageHeader
        title="Messages"
        description="Communicate with teachers, students, and admins."
      />
      <Card className="flex-1 grid grid-cols-1 md:grid-cols-[300px_1fr] h-full overflow-hidden">
        {/* Contact List */}
        <div className="flex flex-col border-r h-full">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">Contacts</h2>
            <div className="relative mt-2">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search contacts..." className="pl-8" disabled />
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="flex flex-col">
              {contactsLoading && <p className="p-4 text-muted-foreground">Loading contacts...</p>}
              {contacts?.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className={cn(
                    'flex items-center gap-3 p-4 text-left hover:bg-muted/50 transition-colors w-full',
                    selectedContact?.id === contact.id && 'bg-muted'
                  )}
                >
                  <Avatar>
                    <AvatarImage src={contact.avatar} alt={contact.firstName} />
                    <AvatarFallback>{contact.firstName?.charAt(0)}{contact.lastName?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 truncate">
                    <p className="font-semibold">{contact.firstName} {contact.lastName}</p>
                    <p className="text-sm text-muted-foreground truncate">{capitalize(contact.role)}</p>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Window */}
        <div className="flex flex-col h-full">
          {selectedContact ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center gap-3 p-4 border-b">
                <Avatar>
                  <AvatarImage src={selectedContact.avatar} alt={selectedContact.firstName} />
                   <AvatarFallback>{selectedContact.firstName?.charAt(0)}{selectedContact.lastName?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{selectedContact.firstName} {selectedContact.lastName}</p>
                  <p className="text-sm text-muted-foreground">{capitalize(selectedContact.role)}</p>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {messagesLoading && <p className="text-muted-foreground text-center">Loading messages...</p>}
                  {currentChatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        'flex items-end gap-2',
                        msg.senderId === currentUser?.uid ? 'justify-end' : 'justify-start'
                      )}
                    >
                      <div
                        className={cn(
                          'max-w-xs lg:max-w-md rounded-lg px-4 py-2 break-words',
                          msg.senderId === currentUser?.uid
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        )}
                      >
                        <p>{msg.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t bg-background">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    autoComplete="off"
                  />
                  <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send</span>
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <p>Select a contact to start messaging</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
