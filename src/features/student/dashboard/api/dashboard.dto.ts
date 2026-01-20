/**
 * Student Dashboard API DTOs
 * Matches backend API response structure
 */

// API Response Wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

// Dashboard Statistics DTO
export interface DashboardStatsDTO {
  attendancePercentage: number;
  upcomingExamsCount: number;
  unreadNotificationsCount: number;
  overallGPA: number;
  attendanceTrend: 'up' | 'down' | 'stable';
}

// Attendance Statistics DTO
export interface AttendanceStatsDTO {
  overallPercentage: number;
  monthlyData: Array<{
    month: string;
    percentage: number;
    totalDays: number;
    presentDays: number;
  }>;
  recentRecords: Array<{
    date: string; // ISO 8601 format
    status: 'present' | 'absent' | 'late';
    subject: string;
  }>;
  trend: 'up' | 'down' | 'stable';
}

// Academic Summary DTO
export interface AcademicSummaryDTO {
  overallGPA: number;
  overallPercentage: number;
  subjectSummary: Array<{
    subject: string;
    grade: string;
    percentage: number;
    totalMarks: number;
    obtainedMarks: number;
  }>;
  recentGrades: Array<{
    subject: string;
    grade: string;
    percentage: number;
    term: string;
    date: string; // ISO 8601 format
  }>;
}

// Schedule Item DTO
export interface ScheduleItemDTO {
  id: string;
  subject: string;
  teacher: string;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  room?: string;
}

