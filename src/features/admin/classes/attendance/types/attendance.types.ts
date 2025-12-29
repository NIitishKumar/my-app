/**
 * Attendance Domain Types
 */

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface StudentAttendance {
  studentId: string;
  studentName: string;
  status: AttendanceStatus;
  remarks?: string;
}

export interface AttendanceRecord {
  id: string;
  classId: string;
  className?: string;
  date: Date;
  lectureId?: string;
  lectureTitle?: string;
  students: StudentAttendance[];
  submittedBy?: string;
  submittedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AttendanceStats {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  excusedDays: number;
  percentage: number;
}

export interface StudentAttendanceStats {
  studentId: string;
  studentName: string;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  excusedDays: number;
  percentage: number;
}

export interface MarkAttendanceData {
  classId: string;
  date: string; // ISO date string
  lectureId?: string;
  students: {
    studentId: string;
    status: AttendanceStatus;
    remarks?: string;
  }[];
}

export interface UpdateAttendanceData extends Partial<MarkAttendanceData> {
  recordId: string;
}

export interface AttendanceFilters {
  startDate?: Date;
  endDate?: Date;
  lectureId?: string;
  status?: AttendanceStatus;
}

// API DTOs (snake_case for request/response)
export interface StudentAttendanceDTO {
  student_id: string;
  student_name: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  remarks?: string;
}

export interface AttendanceRecordDTO {
  id: string;
  class_id: string;
  class_name?: string;
  date: string;
  lecture_id?: string;
  lecture_title?: string;
  students: StudentAttendanceDTO[];
  submitted_by?: string;
  submitted_at?: string;
  created_at: string;
  updated_at: string;
}

export interface MarkAttendanceDTO {
  class_id: string;
  date: string;
  lecture_id?: string;
  students: {
    student_id: string;
    status: 'present' | 'absent' | 'late' | 'excused';
    remarks?: string;
  }[];
}

// Actual API Response Types (camelCase with _id)
export interface StudentAttendanceApiDTO {
  studentId: string;
  studentName: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  remarks?: string;
}

export interface AttendanceRecordApiDTO {
  _id: string;
  classId: string;
  className?: string;
  date: string;
  lectureId?: string;
  lectureTitle?: string;
  students: StudentAttendanceApiDTO[];
  submittedBy?: string;
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceRecordsApiResponse {
  success: boolean;
  count: number;
  data: AttendanceRecordApiDTO[];
}

export interface AttendanceRecordApiResponse {
  success: boolean;
  data: AttendanceRecordApiDTO;
}

export interface MarkAttendanceApiResponse {
  success: boolean;
  message: string;
  data: AttendanceRecordApiDTO;
}

