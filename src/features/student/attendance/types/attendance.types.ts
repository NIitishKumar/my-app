/**
 * Student Attendance Domain Types
 */

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export type AttendanceTrend = 'improving' | 'declining' | 'stable';

export interface StudentAttendanceRecord {
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

export interface AttendanceRecordsResponse {
  records: StudentAttendanceRecord[];
  summary: AttendanceSummary;
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalRecords: number;
  };
}

export interface MonthlyBreakdown {
  month: string; // YYYY-MM format
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  excusedDays: number;
  attendanceRate: number;
}

export interface ClassWiseBreakdown {
  classId: string;
  className: string;
  totalDays: number;
  presentDays: number;
  attendanceRate: number;
}

export interface AttendanceStatistics {
  overall: AttendanceSummary & {
    trend: AttendanceTrend;
  };
  monthlyBreakdown: MonthlyBreakdown[];
  classWiseBreakdown: ClassWiseBreakdown[];
}

export interface CalendarDay {
  date: Date;
  status: AttendanceStatus | 'holiday' | 'no_class';
  classId?: string;
  className?: string;
  remarks?: string;
}

export interface AttendanceCalendar {
  year: number;
  month: number;
  days: CalendarDay[];
}

export interface AttendanceFilters {
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
  classId?: string;
  status?: AttendanceStatus;
  page?: number;
  limit?: number;
}

// API DTOs
export interface StudentAttendanceRecordApiDTO {
  id: string;
  date: string;
  classId: string;
  className: string;
  status: AttendanceStatus;
  remarks?: string;
  submittedBy?: string;
  submittedAt?: string;
}

export interface AttendanceSummaryApiDTO {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  excusedDays: number;
  attendanceRate: number;
}

export interface AttendanceRecordsApiResponse {
  success: boolean;
  data: {
    records: StudentAttendanceRecordApiDTO[];
    summary: AttendanceSummaryApiDTO;
    pagination: {
      page: number;
      limit: number;
      totalPages: number;
      totalRecords: number;
    };
  };
}

export interface AttendanceStatisticsApiResponse {
  success: boolean;
  data: {
    overall: AttendanceSummaryApiDTO & {
      trend: AttendanceTrend;
    };
    monthlyBreakdown: MonthlyBreakdown[];
    classWiseBreakdown: ClassWiseBreakdown[];
  };
}

export interface CalendarDayApiDTO {
  date: string;
  status: AttendanceStatus | 'holiday' | 'no_class';
  classId?: string;
  className?: string;
  remarks?: string;
}

export interface AttendanceCalendarApiResponse {
  success: boolean;
  data: {
    year: number;
    month: number;
    days: CalendarDayApiDTO[];
  };
}

