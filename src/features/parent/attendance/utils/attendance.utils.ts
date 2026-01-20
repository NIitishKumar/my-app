/**
 * Parent Attendance Utility Functions
 */

import type { ChildAttendanceSummary } from '../types/attendance.types';

/**
 * Format attendance rate
 */
export const formatAttendanceRate = (rate: number): string => {
  return `${rate.toFixed(1)}%`;
};

/**
 * Get trend icon class
 */
export const getTrendIconClass = (trend: 'improving' | 'declining' | 'stable'): string => {
  switch (trend) {
    case 'improving':
      return 'fa-arrow-up text-green-500';
    case 'declining':
      return 'fa-arrow-down text-red-500';
    default:
      return 'fa-minus text-gray-400';
  }
};

/**
 * Find child with lowest attendance
 */
export const findLowestAttendance = (
  children: ChildAttendanceSummary[]
): ChildAttendanceSummary | null => {
  if (children.length === 0) return null;
  
  return children.reduce((lowest, current) => {
    return current.summary.attendanceRate < lowest.summary.attendanceRate
      ? current
      : lowest;
  });
};

