import type { User, UserRole, Lesson, Payment, Announcement, ChatContact, ChatMessage, Homework, AttendanceStatus } from './types';

// This file contains mock data for the application.
// In a real application, this data would come from a database.

export const allMockUsers: User[] = [
  { id: 'user-student-1', firstName: 'Alex', lastName: 'Johnson', email: 'alex.j@example.com', avatar: 'https://i.pravatar.cc/150?u=alex', role: 'student', verified: true },
  { id: 'user-teacher-1', firstName: 'Evelyn', lastName: 'Reed', email: 'e.reed@example.com', avatar: 'https://i.pravatar.cc/150?u=evelyn', role: 'teacher', verified: true },
  { id: 'user-parent-1', firstName: 'Maria', lastName: 'Garcia', email: 'm.garcia@example.com', avatar: 'https://i.pravatar.cc/150?u=maria', role: 'parent', verified: true },
  { id: 'user-admin-1', firstName: 'Samuel', lastName: 'Green', email: 's.green@example.com', avatar: 'https://i.pravatar.cc/150?u=samuel', role: 'admin', verified: true },
  { id: 'user-student-2', firstName: 'Ben', lastName: 'Carter', email: 'ben.c@example.com', avatar: 'https://i.pravatar.cc/150?u=ben', role: 'student', verified: false },
  { id: 'user-teacher-2', firstName: 'David', lastName: 'Lee', email: 'david.lee@example.com', avatar: 'https://i.pravatar.cc/150?u=david', role: 'teacher', verified: false },
  { id: 'user-student-3', firstName: 'Chloe', lastName: 'White', email: 'chloe.w@example.com', avatar: 'https://i.pravatar.cc/150?u=chloe', role: 'student', verified: true },
  { id: 'user-parent-2', firstName: 'James', lastName: 'Taylor', email: 'j.taylor@example.com', avatar: 'https://i.pravatar.cc/150?u=james', role: 'parent', verified: false },
];

export const mockUsers: Record<UserRole, User> = {
  student: allMockUsers.find(u => u.role === 'student' && u.verified)!,
  teacher: allMockUsers.find(u => u.role === 'teacher' && u.verified)!,
  parent: allMockUsers.find(u => u.role === 'parent' && u.verified)!,
  admin: allMockUsers.find(u => u.role === 'admin')!,
};

const students = [
  { id: 's1', name: 'Liam Smith', avatar: 'https://i.pravatar.cc/150?u=liam' },
  { id: 's2', name: 'Olivia Brown', avatar: 'https://i.pravatar.cc/150?u=olivia' },
  { id: 's3', name: 'Noah Wilson', avatar: 'https://i.pravatar.cc/150?u=noah' },
  { id: 's4', name: 'Emma Jones', avatar: 'https://i.pravatar.cc/150?u=emma' },
  { id: 's5', name: 'Alex Johnson', avatar: 'https://i.pravatar.cc/150?u=alex' },
];

export const mockLessons: Lesson[] = [
  { id: 'lesson-1', title: 'Introduction to Algebra', subject: 'Mathematics', teacher: 'Dr. Evelyn Reed', teacherId: 'user-teacher-1', date: '2024-08-15', time: '10:00 AM', students: students },
  { id: 'lesson-2', title: 'The World of Photosynthesis', subject: 'Science', teacher: 'Dr. Evelyn Reed', teacherId: 'user-teacher-1', date: '2024-08-15', time: '01:00 PM', students: students.slice(0, 3) },
  { id: 'lesson-3', title: 'Shakespearean Sonnets', subject: 'Literature', teacher: 'Dr. Evelyn Reed', teacherId: 'user-teacher-1', date: '2024-08-16', time: '11:00 AM', students: students.slice(2) },
  { id: 'lesson-4', title: 'Basics of Programming', subject: 'Computer Science', teacher: 'Dr. Evelyn Reed', teacherId: 'user-teacher-1', date: '2024-08-17', time: '09:00 AM', students: [students[0], students[2], students[4]] },
];

export const mockAttendance: Record<string, Record<string, AttendanceStatus>> = {
  'lesson-1': {
    's1': 'present', 's2': 'present', 's3': 'absent', 's4': 'present', 's5': 'late'
  }
};


export const mockPayments: Payment[] = [
  { id: 'payment-1', studentName: 'Alex Johnson', amount: 250.00, date: '2024-08-01', status: 'paid' },
  { id: 'payment-2', studentName: 'Liam Smith', amount: 250.00, date: '2024-08-01', status: 'paid' },
  { id: 'payment-3', studentName: 'Olivia Brown', amount: 250.00, date: '2024-09-01', status: 'pending' },
  { id: 'payment-4', studentName: 'Emma Jones', amount: 250.00, date: '2024-07-01', status: 'overdue' },
];

export const mockAnnouncements: Announcement[] = [
  { id: 'ann-1', title: 'Welcome Back to School!', content: 'We are excited to start the new academic year. Please check your schedules and be prepared for your first classes.', author: 'Samuel Green', date: '2024-08-10', role: 'admin' },
  { id: 'ann-2', title: 'Math Homework for Aug 15', content: 'Please complete exercises 1-10 from chapter 1. The solutions will be discussed in our next session.', author: 'Dr. Evelyn Reed', date: '2024-08-15', role: 'teacher' },
];

export const mockContacts: ChatContact[] = [
  { id: 'contact-1', name: 'Dr. Evelyn Reed', avatar: 'https://i.pravatar.cc/150?u=evelyn', role: 'teacher', lastMessage: 'See you in class tomorrow!', lastMessageTime: '3:45 PM' },
  { id: 'contact-2', name: 'Maria Garcia', avatar: 'https://i.pravatar.cc/150?u=maria', role: 'parent', lastMessage: 'About Alex\'s progress...', lastMessageTime: '1:20 PM' },
  { id: 'contact-3', name: 'Samuel Green', avatar: 'https://i.pravatar.cc/150?u=samuel', role: 'admin', lastMessage: 'The new school policy is...', lastMessageTime: 'Yesterday' },
  { id: 'contact-4', name: 'Liam Smith', avatar: 'https://i.pravatar.cc/150?u=liam', role: 'student', lastMessage: 'Did you get the notes?', lastMessageTime: 'Yesterday' },
];

export const mockMessages: Record<string, ChatMessage[]> = {
  'contact-1': [
    { id: 'msg-1-1', sender: 'Dr. Evelyn Reed', content: 'Hi Alex, how are you preparing for the test?', timestamp: '3:40 PM', isMe: false },
    { id: 'msg-1-2', sender: 'Alex Johnson', content: 'I\'m doing well, Dr. Reed. Just reviewing the last chapter.', timestamp: '3:42 PM', isMe: true },
    { id: 'msg-1-3', sender: 'Dr. Evelyn Reed', content: 'Great. Let me know if you have any questions. See you in class tomorrow!', timestamp: '3:45 PM', isMe: false },
  ],
  'contact-2': [
    { id: 'msg-2-1', sender: 'Maria Garcia', content: 'Hello, I wanted to ask about Alex\'s progress in Math.', timestamp: '1:20 PM', isMe: false },
  ],
  'contact-3': [
     { id: 'msg-3-1', sender: 'Samuel Green', content: 'The new school policy is effective from next Monday.', timestamp: 'Yesterday', isMe: false },
  ],
  'contact-4': [
     { id: 'msg-4-1', sender: 'Liam Smith', content: 'Hey! Did you get the notes from the science class?', timestamp: 'Yesterday', isMe: false },
  ]
};

export const mockHomework: Homework[] = [
    { id: 'hw-1', studentName: 'Alex Johnson', subject: 'Algebra', status: 'completed', submittedDate: '2024-08-14' },
    { id: 'hw-2', studentName: 'Alex Johnson', subject: 'Photosynthesis', status: 'pending', submittedDate: '-' },
];