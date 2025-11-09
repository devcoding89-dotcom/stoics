import type { User, UserRole, Lesson, Payment, Announcement, ChatContact, ChatMessage, Homework, AttendanceStatus } from './types';
import { Timestamp } from 'firebase/firestore';

// This file contains placeholder data.
// Real data is now fetched from Firebase Firestore.

export const chatContacts: ChatContact[] = [
  {
    id: 'teacher-1',
    name: 'Mr. Anderson',
    avatar: 'https://i.pravatar.cc/150?u=teacher-1',
    role: 'teacher',
    lastMessage: 'Sure, I can help with that. What part are you stuck on?',
    lastMessageTime: '10:42 AM',
  },
  {
    id: 'admin-1',
    name: 'Admin Office',
    avatar: 'https://i.pravatar.cc/150?u=admin-1',
    role: 'admin',
    lastMessage: 'Your payment has been received. Thank you!',
    lastMessageTime: 'Yesterday',
  },
  {
    id: 'teacher-2',
    name: 'Ms. Garcia',
    avatar: 'https://i.pravatar.cc/150?u=teacher-2',
    role: 'teacher',
    lastMessage: 'Don\'t forget about the upcoming test on Friday.',
    lastMessageTime: '3d',
  }
];

export const chatMessages: ChatMessage[] = [
    {
        id: 'msg-1',
        senderId: 'teacher-1',
        recipientId: 'current-user-id',
        message: 'Hello! How are you finding the algebra homework?',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
    },
    {
        id: 'msg-2',
        senderId: 'current-user-id',
        recipientId: 'teacher-1',
        message: 'Hi Mr. Anderson! I\'m struggling a bit with question 3.',
        timestamp: new Date(Date.now() - 1000 * 60 * 4),
    },
    {
        id: 'msg-3',
        senderId: 'teacher-1',
        recipientId: 'current-user-id',
        message: 'Sure, I can help with that. What part are you stuck on?',
        timestamp: new Date(Date.now() - 1000 * 60 * 3),
    },
     {
        id: 'msg-4',
        senderId: 'admin-1',
        recipientId: 'current-user-id',
        message: 'Your payment has been received. Thank you!',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    }
];
