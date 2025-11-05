export type UserRole = "student" | "teacher" | "parent" | "admin";

export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
};

export type Lesson = {
  id: string;
  title: string;
  subject: string;
  teacher: string;
  teacherId: string;
  date: string;
  time: string;
  students: { id: string, name: string, avatar: string }[];
};

export type AttendanceStatus = "present" | "absent" | "late";

export type Attendance = {
  lessonId: string;
  studentId: string;
  status: AttendanceStatus;
};

export type Payment = {
  id: string;
  studentName: string;
  amount: number;
  date: string;
  status: "paid" | "pending" | "overdue";
};

export type Announcement = {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  role: 'teacher' | 'admin';
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
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isMe: boolean;
};

export type Homework = {
  id: string;
  studentName: string;
  subject: string;
  status: 'completed' | 'pending';
  submittedDate: string;
};
