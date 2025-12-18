/**
 * Parent API DTOs
 */

export interface ChildDTO {
  id: string;
  name: string;
  grade: string;
  section: string;
  roll_number: string;
  class_name: string;
  avatar?: string;
}

export interface AttendanceRecordDTO {
  date: string;
  status: 'present' | 'absent' | 'late';
}

export interface ChildAttendanceDTO {
  child_id: string;
  child_name: string;
  records: AttendanceRecordDTO[];
  summary: {
    total_days: number;
    present_days: number;
    absent_days: number;
    percentage: number;
  };
}

export interface AcademicRecordDTO {
  subject: string;
  marks: number;
  total_marks: number;
  percentage: number;
  grade: string;
  term: string;
}

export interface ChildRecordDTO {
  child_id: string;
  child_name: string;
  records: AcademicRecordDTO[];
  overall_performance: {
    total_subjects: number;
    average_percentage: number;
    grade: string;
  };
}

export interface TeacherDTO {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  avatar?: string;
}

export interface QueryDTO {
  id: string;
  child_id?: string;
  subject: string;
  message: string;
  status: 'pending' | 'resolved' | 'closed';
  created_at: string;
  resolved_at?: string;
  response?: string;
}

export interface CreateQueryDTO {
  child_id?: string;
  subject: string;
  message: string;
}


