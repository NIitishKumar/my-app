/**
 * Parent Domain Models
 */

export interface Child {
  id: string;
  name: string;
  grade: string;
  section: string;
  rollNumber: string;
  className: string;
  avatar?: string;
}

export interface ChildAttendance {
  childId: string;
  childName: string;
  records: AttendanceRecord[];
  summary: {
    totalDays: number;
    presentDays: number;
    absentDays: number;
    percentage: number;
  };
}

export interface AttendanceRecord {
  date: Date;
  status: 'present' | 'absent' | 'late';
}

export interface ChildRecord {
  childId: string;
  childName: string;
  records: AcademicRecord[];
  overallPerformance: {
    totalSubjects: number;
    averagePercentage: number;
    grade: string;
  };
}

export interface AcademicRecord {
  subject: string;
  marks: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  term: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  avatar?: string;
}

export interface Query {
  id: string;
  childId?: string;
  subject: string;
  message: string;
  status: 'pending' | 'resolved' | 'closed';
  createdAt: Date;
  resolvedAt?: Date;
  response?: string;
}

export interface CreateQueryData {
  childId?: string;
  subject: string;
  message: string;
}


