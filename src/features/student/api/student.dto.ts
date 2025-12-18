/**
 * Student API DTOs
 */

export interface ExamDTO {
  id: string;
  title: string;
  subject: string;
  date: string;
  duration: number;
  total_marks: number;
  obtained_marks?: number;
  status: 'upcoming' | 'completed' | 'graded';
  room?: string;
}

export interface NotificationDTO {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  is_read: boolean;
  created_at: string;
}

export interface AcademicRecordDTO {
  id: string;
  subject: string;
  grade: string;
  marks: number;
  total_marks: number;
  percentage: number;
  term: string;
  year: number;
  remarks?: string;
}

export interface TeacherDTO {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  avatar?: string;
}


