/**
 * Teacher API DTOs
 */

export interface AssignedClassDTO {
  id: string;
  name: string;
  grade: string;
  section: string;
  subject: string;
  student_count: number;
  schedule: string;
}

export interface StudentAttendanceDTO {
  student_id: string;
  student_name: string;
  status: 'present' | 'absent' | 'late';
}

export interface AttendanceRecordDTO {
  id: string;
  class_id: string;
  class_name: string;
  date: string;
  students: StudentAttendanceDTO[];
  submitted_at?: string;
}

export interface MarkAttendanceDTO {
  date: string;
  students: {
    student_id: string;
    status: 'present' | 'absent' | 'late';
  }[];
}

export interface QueryDTO {
  id: string;
  subject: string;
  message: string;
  status: 'pending' | 'resolved' | 'closed';
  created_at: string;
  resolved_at?: string;
  response?: string;
}

export interface CreateQueryDTO {
  subject: string;
  message: string;
}


