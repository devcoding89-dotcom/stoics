import { type User as FirebaseUser } from 'firebase/auth';
import { type Timestamp } from 'firebase/firestore';

export type UserRole = "student" | "teacher" | "admin";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  avatar?: string;
  verified: boolean;
  language: string;
  otp?: string;
  otpExpiry?: Date;
}

export type Lesson = {
  id: string;
  title: string;
  subject: string;
  teacherId: string;
  scheduledDateTime: string;
  studentIds?: string[];
  teacherName?: string;
  materials?: string;
  resources?: string;
};

export type AttendanceStatus = "present" | "absent" | "late";

export type Attendance = {
  id: string; // The doc ID is the attendanceId
  lessonId: string;
  studentId: string;
  attendanceStatus: AttendanceStatus;
  date: string; // The date of the lesson
};

export type Payment = {
  id:string; // The doc ID is the paymentId
  studentId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  transactionId: string;
};

export type Announcement = {
  id: string; // The doc ID is the announcementId
  authorId: string;
  title: string;
  content: string;
  timestamp: string;
  audience: string;
};

export type ChatContact = {
  id: string;
  name: string;
  avatar: string;
  role: UserRole;
  lastMessage: string;
  lastMessageTime: string;
};

export type ChatMessage = {
  id: string; // The doc ID is the messageId
  senderId: string;
  recipientId: string;
  message: string;
  timestamp: Timestamp;
};

export type Homework = {
  id: string;
  studentName: string;
  subject: string;
  status: 'completed' | 'pending';
  submittedDate: string;
};
