/**
 * Parent Attendance Domain Types
 * Supports multi-child attendance viewing
 */

import type { AttendanceStatus, AttendanceTrend } from '../../../student/attendance/types/attendance.types';

// Re-export common types
export type { AttendanceStatus, AttendanceTrend };

export interface ChildAttendanceSummary {
  childId: string;
  childName: string;
  classId: string;
  className: string;
  summary: {
    totalDays: number;
    presentDays: number;
    absentDays: number;
    lateDays: number;
    excusedDays: number;
    attendanceRate: number;
    trend: AttendanceTrend;
  };
  recentRecords: RecentAttendanceRecord[];
}

export interface RecentAttendanceRecord {
  date: Date;
  status: AttendanceStatus;
  className: string;
}

export interface ChildrenAttendanceOverview {
  children: ChildAttendanceSummary[];
  overallSummary: {
    totalDays: number;
    presentDays: number;
    absentDays: number;
    lateDays: number;
    excusedDays: number;
    averageAttendanceRate: number;
  };
}

// Child-specific attendance (reuses student attendance types)
export interface ChildAttendanceHistory {
  records: ChildAttendanceRecord[];
  summary: AttendanceSummary;
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalRecords: number;
  };
}

export interface ChildAttendanceRecord {
  id: string;
  date: Date;
  classId: string;
  className: string;
  status: AttendanceStatus;
  remarks?: string;
  submittedBy?: string;
  submittedAt?: Date;
}

export interface AttendanceSummary {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  excusedDays: number;
  attendanceRate: number;
}

export interface AttendanceComparison {
  children: ChildComparisonData[];
  average: {
    attendanceRate: number;
    totalDays: number;
    presentDays: number;
  };
}

export interface ChildComparisonData {
  childId: string;
  childName: string;
  attendanceRate: number;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  excusedDays: number;
}

// API DTOs
export interface ChildAttendanceSummaryApiDTO {
  childId: string;
  childName: string;
  classId: string;
  className: string;
  summary: {
    totalDays: number;
    presentDays: number;
    absentDays: number;
    lateDays: number;
    excusedDays: number;
    attendanceRate: number;
    trend: AttendanceTrend;
  };
  recentRecords: Array<{
    date: string;
    status: AttendanceStatus;
    className: string;
  }>;
}

export interface ChildrenAttendanceOverviewApiResponse {
  success: boolean;
  data: {
    children: ChildAttendanceSummaryApiDTO[];
    overallSummary: {
      totalDays: number;
      presentDays: number;
      absentDays: number;
      lateDays: number;
      excusedDays: number;
      averageAttendanceRate: number;
    };
  };
}

export interface ChildAttendanceRecordApiDTO {
  id: string;
  date: string;
  classId: string;
  className: string;
  status: AttendanceStatus;
  remarks?: string;
  submittedBy?: string;
  submittedAt?: string;
}

export interface ChildAttendanceHistoryApiResponse {
  success: boolean;
  data: {
    records: ChildAttendanceRecordApiDTO[];
    summary: AttendanceSummary;
    pagination: {
      page: number;
      limit: number;
      totalPages: number;
      totalRecords: number;
    };
  };
}

export interface AttendanceComparisonApiResponse {
  success: boolean;
  data: AttendanceComparison;
}

