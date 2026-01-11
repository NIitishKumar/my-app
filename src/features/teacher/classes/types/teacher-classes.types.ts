/**
 * Teacher Classes Domain Types
 */

import type { Class } from '../../../admin/classes/types/classes.types';

// Extended class type for teacher view with additional context
export interface TeacherClass extends Class {
  // Teacher-specific fields
  subject?: string; // Primary subject for this teacher
  attendanceRate?: number; // Overall attendance rate
  lastAttendanceDate?: Date; // Last time attendance was marked
  todaySchedule?: string; // Today's schedule if applicable
}

// Lightweight class summary for lists and cards
export interface ClassSummary {
  id: string;
  className: string;
  grade: string;
  section?: string;
  subject?: string;
  studentCount: number;
  attendanceRate?: number;
  roomNo?: string;
  isActive: boolean;
  lastAttendanceDate?: Date;
}

// API DTOs
export interface TeacherClassDTO {
  _id: string;
  className: string;
  subjects: string[];
  grade: string;
  roomNo: string;
  capacity: number;
  enrolled: number;
  isActive: boolean;
  classHead?: {
    firstName: string;
    lastName: string;
    email: string;
    employeeId: string;
  } | null;
  schedule?: {
    academicYear: string;
    semester: string;
    startDate: string;
    endDate: string;
  } | null;
  students: Array<{
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    studentId: string;
  }>;
  lectures: Array<{
    _id: string;
    title: string;
    subject: string;
  }>;
  createdAt: string;
  updatedAt: string;
  // Teacher-specific fields from backend
  subject?: string;
  attendanceRate?: number;
  lastAttendanceDate?: string;
}

export interface TeacherClassesApiResponse {
  success: boolean;
  count: number;
  data: TeacherClassDTO[];
}

export interface TeacherClassApiResponse {
  success: boolean;
  data: TeacherClassDTO;
}

