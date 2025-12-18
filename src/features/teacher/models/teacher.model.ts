/**
 * Teacher Domain Models
 */

export interface AssignedClass {
  id: string;
  name: string;
  grade: string;
  section: string;
  subject: string;
  studentCount: number;
  schedule: string;
}

export interface AttendanceRecord {
  id: string;
  classId: string;
  className: string;
  date: Date;
  students: StudentAttendance[];
  submittedAt?: Date;
}

export interface StudentAttendance {
  studentId: string;
  studentName: string;
  status: 'present' | 'absent' | 'late';
}

export interface MarkAttendanceData {
  classId: string;
  date: string;
  students: {
    studentId: string;
    status: 'present' | 'absent' | 'late';
  }[];
}

export interface Query {
  id: string;
  subject: string;
  message: string;
  status: 'pending' | 'resolved' | 'closed';
  createdAt: Date;
  resolvedAt?: Date;
  response?: string;
}

export interface CreateQueryData {
  subject: string;
  message: string;
}


