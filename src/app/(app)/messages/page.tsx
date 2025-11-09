'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Send, Search } from 'lucide-react';
import { chatContacts, chatMessages } from '@/lib/data';
import type { ChatContact, ChatMessage } from '@/lib/types';

export default function MessagesPage() {
  const [selectedContact, setSelectedContact] = useState<ChatContact>(chatContacts[0]);
  const [messages, setMessages] = useState<ChatMessage[]>(chatMessages);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'current-user-id', // This would be the logged-in user's ID
      recipientId: selectedContact.id,
      message: newMessage,
      timestamp: new Date(),
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  // Filter messages for the selected contact
  const currentChatMessages = messages.filter(
    (msg) =>
      (msg.senderId === selectedContact.id && msg.recipientId === 'current-user-id') ||
      (msg.senderId === 'current-user-id' && msg.recipientId === selectedContact.id)
  );

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
              <Input placeholder="Search contacts..." className="pl-8" />
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="flex flex-col">
              {chatContacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className={cn(
                    'flex items-center gap-3 p-4 text-left hover:bg-muted/50 transition-colors w-full',
                    selectedContact.id === contact.id && 'bg-muted'
                  )}
                >
                  <Avatar>
                    <AvatarImage src={contact.avatar} alt={contact.name} />
                    <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 truncate">
                    <p className="font-semibold">{contact.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{contact.lastMessage}</p>
                  </div>
                  <time className="text-xs text-muted-foreground">{contact.lastMessageTime}</time>
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
                  <AvatarImage src={selectedContact.avatar} alt={selectedContact.name} />
                  <AvatarFallback>{selectedContact.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{selectedContact.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedContact.role}</p>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {currentChatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        'flex items-end gap-2',
                        msg.senderId === 'current-user-id' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      <div
                        className={cn(
                          'max-w-xs lg:max-w-md rounded-lg px-4 py-2',
                          msg.senderId === 'current-user-id'
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
