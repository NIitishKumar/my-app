/**
 * Teacher Attendance Domain Types
 * Independent implementation following backend API specification
 */

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export type AttendanceType = 'date' | 'lecture';

export type AttendanceTrend = 'improving' | 'declining' | 'stable';

export interface StudentAttendance {
  studentId: string;
  studentName: string;
  studentIdNumber?: string;
  status: AttendanceStatus;
  remarks?: string;
  markedAt?: Date;
  markedBy?: string; // Teacher ID
}

export interface AttendanceRecord {
  id: string;
  classId: string;
  className: string;
  date: Date;
  lectureId?: string;
  lectureTitle?: string;
  type: AttendanceType;
  students: StudentAttendance[];
  submittedBy?: string; // Teacher ID
  submittedAt?: Date;
  isLocked: boolean;
  lockedAt?: Date;
  lockedBy?: string; // Admin ID
  createdAt: Date;
  updatedAt: Date;
  version?: number; // For optimistic locking
}

export interface AttendanceDashboardData {
  totalClasses: number;
  pendingAttendance: number;
  todayAttendance: number;
  recentActivity: RecentActivityItem[];
  upcomingClasses: UpcomingClassItem[];
}

export interface RecentActivityItem {
  classId: string;
  className: string;
  date: string;
  studentsCount: number;
  markedAt: string;
}

export interface UpcomingClassItem {
  classId: string;
  className: string;
  scheduledTime: string;
  hasAttendance: boolean;
}

export interface AttendanceStatistics {
  classId: string;
  className: string;
  period: {
    startDate: string;
    endDate: string;
  };
  overall: {
    totalDays: number;
    presentDays: number;
    absentDays: number;
    lateDays: number;
    excusedDays: number;
    attendanceRate: number; // percentage
  };
  studentStats: StudentAttendanceStatistics[];
  dailyBreakdown: DailyBreakdownItem[];
}

export interface StudentAttendanceStatistics {
  studentId: string;
  studentName: string;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  excusedDays: number;
  attendanceRate: number;
  trend: AttendanceTrend;
}

export interface DailyBreakdownItem {
  date: string;
  present: number;
  absent: number;
  late: number;
  excused: number;
}

export interface StudentAttendanceHistory {
  studentId: string;
  studentName: string;
  records: StudentAttendanceRecord[];
  summary: {
    totalDays: number;
    presentDays: number;
    absentDays: number;
    lateDays: number;
    excusedDays: number;
    attendanceRate: number;
  };
}

export interface StudentAttendanceRecord {
  date: string;
  classId: string;
  className: string;
  status: AttendanceStatus;
  remarks?: string;
  submittedBy: string;
  submittedAt: string;
}

export interface MarkAttendanceData {
  classId: string;
  date: string; // ISO date string (YYYY-MM-DD)
  lectureId?: string;
  type?: AttendanceType;
  students: {
    studentId: string;
    status: AttendanceStatus;
    remarks?: string;
  }[];
}

export interface UpdateAttendanceData extends Partial<MarkAttendanceData> {
  recordId: string;
  classId: string;
  version?: number;
}

export interface AttendanceFilters {
  classId?: string;
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
  lectureId?: string;
  status?: AttendanceStatus;
  teacherId?: string; // For admin filtering
  page?: number;
  limit?: number;
}

export interface AttendanceRecordsResponse {
  success: boolean;
  count: number;
  page: number;
  totalPages: number;
  data: AttendanceRecord[];
}

export interface AttendanceQueryParams {
  classId?: string;
  startDate?: string;
  endDate?: string;
  lectureId?: string;
  status?: AttendanceStatus;
  page?: number;
  limit?: number;
}

export interface StatisticsQueryParams {
  startDate?: string;
  endDate?: string;
}

export interface StudentHistoryQueryParams {
  classId?: string;
  startDate?: string;
  endDate?: string;
}

export interface DashboardQueryParams {
  startDate?: string;
  endDate?: string;
}

export interface ExportQueryParams {
  classId?: string;
  startDate: string;
  endDate: string;
  format: 'excel' | 'csv';
}

// API DTOs (matching backend response structure)
export interface StudentAttendanceApiDTO {
  studentId: string;
  studentName: string;
  studentIdNumber?: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  remarks?: string;
  markedAt?: string;
  markedBy?: string;
}

export interface AttendanceRecordApiDTO {
  _id: string;
  classId: string;
  className: string;
  date: string;
  lectureId?: string;
  lectureTitle?: string;
  type: 'date' | 'lecture';
  students: StudentAttendanceApiDTO[];
  submittedBy?: string;
  submittedAt?: string;
  isLocked: boolean;
  lockedAt?: string;
  lockedBy?: string;
  createdAt: string;
  updatedAt: string;
  version?: number;
}

export interface AttendanceRecordsApiResponse {
  success: boolean;
  count: number;
  page: number;
  totalPages: number;
  data: AttendanceRecordApiDTO[];
}

export interface AttendanceRecordApiResponse {
  success: boolean;
  data: AttendanceRecordApiDTO | null;
}

export interface MarkAttendanceApiResponse {
  success: boolean;
  message: string;
  data: AttendanceRecordApiDTO;
}

export interface AttendanceDashboardApiResponse {
  success: boolean;
  data: {
    totalClasses: number;
    pendingAttendance: number;
    todayAttendance: number;
    recentActivity: Array<{
      classId: string;
      className: string;
      date: string;
      studentsCount: number;
      markedAt: string;
    }>;
    upcomingClasses: Array<{
      classId: string;
      className: string;
      scheduledTime: string;
      hasAttendance: boolean;
    }>;
  };
}

export interface AttendanceStatisticsApiResponse {
  success: boolean;
  data: {
    classId: string;
    className: string;
    period: {
      startDate: string;
      endDate: string;
    };
    overall: {
      totalDays: number;
      presentDays: number;
      absentDays: number;
      lateDays: number;
      excusedDays: number;
      attendanceRate: number;
    };
    studentStats: Array<{
      studentId: string;
      studentName: string;
      totalDays: number;
      presentDays: number;
      absentDays: number;
      lateDays: number;
      excusedDays: number;
      attendanceRate: number;
      trend: 'improving' | 'declining' | 'stable';
    }>;
    dailyBreakdown: Array<{
      date: string;
      present: number;
      absent: number;
      late: number;
      excused: number;
    }>;
  };
}

export interface StudentAttendanceHistoryApiResponse {
  success: boolean;
  data: {
    studentId: string;
    studentName: string;
    records: Array<{
      date: string;
      classId: string;
      className: string;
      status: 'present' | 'absent' | 'late' | 'excused';
      remarks?: string;
      submittedBy: string;
      submittedAt: string;
    }>;
    summary: {
      totalDays: number;
      presentDays: number;
      absentDays: number;
      lateDays: number;
      excusedDays: number;
      attendanceRate: number;
    };
  };
}

// Request DTOs (for API calls)
export interface MarkAttendanceRequestDTO {
  date: string;
  lectureId?: string;
  students: Array<{
    studentId: string;
    status: 'present' | 'absent' | 'late' | 'excused';
    remarks?: string;
  }>;
}

export interface UpdateAttendanceRequestDTO {
  date?: string;
  lectureId?: string;
  students?: Array<{
    studentId: string;
    status: 'present' | 'absent' | 'late' | 'excused';
    remarks?: string;
  }>;
}

