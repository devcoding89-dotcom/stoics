'use client';

import React, { useState, useRef, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUser } from '@/context/user-context';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { BrainCircuit, Send, User } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { homeworkSupport, HomeworkSupportOutput } from '@/ai/flows/homework-support';
import { Skeleton } from '@/components/ui/skeleton';

type Message = {
  id: number;
  isUser: boolean;
  text: string | React.ReactNode;
  avatar: string;
  name: string;
};

export default function AiTutorPage() {
  const { user, userProfile } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [topic, setTopic] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !user || !userProfile) return;

    const userMessage: Message = {
      id: Date.now(),
      isUser: true,
      text: input,
      avatar: user.photoURL || userProfile.avatar || '',
      name: user.displayName || userProfile.firstName,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result: HomeworkSupportOutput = await homeworkSupport({ question: input, topic });
      
      const aiMessage: Message = {
        id: Date.now() + 1,
        isUser: false,
        text: (
          <div>
            <p className="font-semibold mb-2">{result.answer}</p>
            {result.explanation && <p className="text-sm opacity-90">{result.explanation}</p>}
          </div>
        ),
        avatar: '/ai-avatar.png', // Placeholder, ideally a real image
        name: 'AI Tutor',
      };
      setMessages((prev) => [...prev, aiMessage]);

    } catch (error) {
      const errorMessage: Message = {
        id: Date.now() + 1,
        isUser: false,
        text: "Sorry, I encountered an error. Please try again.",
        avatar: '/ai-avatar.png',
        name: 'AI Tutor',
      };
      setMessages((prev) => [...prev, errorMessage]);
      console.error("AI tutor error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!userProfile) {
    return <p>Loading...</p>
  }

  if (userProfile.role !== 'student') {
    return (
      <>
        <PageHeader title="AI Tutor" />
        <Card className="text-center p-8">
          <BrainCircuit className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Access Denied</h3>
          <p className="mt-2 text-sm text-muted-foreground">The AI Tutor is only available for students.</p>
        </Card>
      </>
    );
  }

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      <PageHeader
        title="AI Tutor"
        description="Your personal digital learning companion."
      />
      <Card className="flex-grow flex flex-col">
        <CardContent className="flex-grow overflow-auto p-4 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn("flex items-start gap-3", message.isUser ? "justify-end" : "justify-start")}
            >
              {!message.isUser && (
                <Avatar className="h-9 w-9 border">
                  <div className="bg-primary/10 flex items-center justify-center h-full w-full">
                    <BrainCircuit className="h-5 w-5 text-primary" />
                  </div>
                </Avatar>
              )}
              <div
                className={cn(
                  "rounded-lg px-4 py-3 max-w-lg",
                  message.isUser ? "bg-primary text-primary-foreground" : "bg-muted"
                )}
              >
                <div className="text-sm">{message.text}</div>
              </div>
              {message.isUser && (
                <Avatar className="h-9 w-9">
                  <AvatarImage src={message.avatar} alt={message.name} />
                  <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3 justify-start">
               <Avatar className="h-9 w-9 border">
                  <div className="bg-primary/10 flex items-center justify-center h-full w-full">
                    <BrainCircuit className="h-5 w-5 text-primary" />
                  </div>
                </Avatar>
                <div className="rounded-lg px-4 py-3 bg-muted max-w-lg w-full">
                  <Skeleton className="h-4 w-1/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4 mt-2" />
                </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>
        <div className="p-4 border-t bg-background">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <Select value={topic} onValueChange={setTopic}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Topic" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="math">Math</SelectItem>
                <SelectItem value="science">Science</SelectItem>
              </SelectContent>
            </Select>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a homework question..."
              disabled={isLoading}
              autoComplete="off"
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
