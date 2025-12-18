/**
 * Student Domain Models
 */

export interface Exam {
  id: string;
  title: string;
  subject: string;
  date: Date;
  duration: number;
  totalMarks: number;
  obtainedMarks?: number;
  status: 'upcoming' | 'completed' | 'graded';
  room?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  isRead: boolean;
  createdAt: Date;
}

export interface AcademicRecord {
  id: string;
  subject: string;
  grade: string;
  marks: number;
  totalMarks: number;
  percentage: number;
  term: string;
  year: number;
  remarks?: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  avatar?: string;
}


