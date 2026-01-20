/**
 * Attendance Calculations
 * Utility functions for calculating attendance metrics
 */

export interface AttendanceSummary {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  excusedDays: number;
  attendanceRate: number;
}

/**
 * Calculate attendance rate
 */
export const calculateAttendanceRate = (summary: AttendanceSummary): number => {
  if (summary.totalDays === 0) return 0;
  return Number(((summary.presentDays + summary.excusedDays) / summary.totalDays * 100).toFixed(2));
};

/**
 * Calculate trend from two rates
 */
export const calculateTrend = (
  currentRate: number,
  previousRate: number
): 'improving' | 'declining' | 'stable' => {
  const diff = currentRate - previousRate;
  if (diff > 2) return 'improving';
  if (diff < -2) return 'declining';
  return 'stable';
};

/**
 * Calculate percentage
 */
export const calculatePercentage = (part: number, total: number): number => {
  if (total === 0) return 0;
  return Number(((part / total) * 100).toFixed(2));
};

