/**
 * Student Attendance Utility Functions
 */

import type {
  AttendanceStatus,
  StudentAttendanceRecord,
  AttendanceSummary,
  AttendanceTrend,
} from '../types/attendance.types';

/**
 * Get status color class
 */
export const getStatusColor = (status: AttendanceStatus): string => {
  switch (status) {
    case 'present':
      return 'bg-green-100 text-green-700 border-green-300';
    case 'absent':
      return 'bg-red-100 text-red-700 border-red-300';
    case 'late':
      return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    case 'excused':
      return 'bg-blue-100 text-blue-700 border-blue-300';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-300';
  }
};

/**
 * Get status icon
 */
export const getStatusIcon = (status: AttendanceStatus): string => {
  switch (status) {
    case 'present':
      return 'fa-check-circle';
    case 'absent':
      return 'fa-times-circle';
    case 'late':
      return 'fa-clock';
    case 'excused':
      return 'fa-calendar-check';
    default:
      return 'fa-question-circle';
  }
};

/**
 * Calculate attendance rate
 */
export const calculateAttendanceRate = (summary: AttendanceSummary): number => {
  if (summary.totalDays === 0) return 0;
  return (summary.presentDays + summary.excusedDays) / summary.totalDays * 100;
};

/**
 * Calculate trend from current and previous periods
 */
export const calculateTrend = (
  currentRate: number,
  previousRate: number
): AttendanceTrend => {
  const diff = currentRate - previousRate;
  if (diff > 2) return 'improving';
  if (diff < -2) return 'declining';
  return 'stable';
};

/**
 * Format date to readable string
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

/**
 * Format date to ISO string (YYYY-MM-DD)
 */
export const formatDateISO = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
};

/**
 * Get month name from date
 */
export const getMonthName = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

/**
 * Filter records by status
 */
export const filterRecordsByStatus = (
  records: StudentAttendanceRecord[],
  status: AttendanceStatus
): StudentAttendanceRecord[] => {
  return records.filter(record => record.status === status);
};

/**
 * Filter records by date range
 */
export const filterRecordsByDateRange = (
  records: StudentAttendanceRecord[],
  startDate: Date,
  endDate: Date
): StudentAttendanceRecord[] => {
  return records.filter(record => {
    const recordDate = typeof record.date === 'string' ? new Date(record.date) : record.date;
    return recordDate >= startDate && recordDate <= endDate;
  });
};

/**
 * Group records by month
 */
export const groupRecordsByMonth = (
  records: StudentAttendanceRecord[]
): Record<string, StudentAttendanceRecord[]> => {
  return records.reduce((acc, record) => {
    const date = typeof record.date === 'string' ? new Date(record.date) : record.date;
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(record);
    
    return acc;
  }, {} as Record<string, StudentAttendanceRecord[]>);
};

/**
 * Calculate summary from records
 */
export const calculateSummaryFromRecords = (
  records: StudentAttendanceRecord[]
): AttendanceSummary => {
  const summary: AttendanceSummary = {
    totalDays: records.length,
    presentDays: 0,
    absentDays: 0,
    lateDays: 0,
    excusedDays: 0,
    attendanceRate: 0,
  };

  records.forEach(record => {
    switch (record.status) {
      case 'present':
        summary.presentDays++;
        break;
      case 'absent':
        summary.absentDays++;
        break;
      case 'late':
        summary.lateDays++;
        break;
      case 'excused':
        summary.excusedDays++;
        break;
    }
  });

  summary.attendanceRate = calculateAttendanceRate(summary);
  return summary;
};

/**
 * Get today's date as ISO string
 */
export const getTodayISO = (): string => {
  return formatDateISO(new Date());
};

/**
 * Get start and end of month
 */
export const getMonthRange = (year: number, month: number): { start: Date; end: Date } => {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59, 999);
  return { start, end };
};

