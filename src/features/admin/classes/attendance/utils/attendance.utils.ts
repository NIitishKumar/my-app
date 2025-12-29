/**
 * Attendance Utility Functions
 */

import type {
  AttendanceRecord,
  AttendanceStats,
  StudentAttendanceStats,
  AttendanceStatus,
} from '../types/attendance.types';

/**
 * Format date for display
 */
export const formatAttendanceDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format date for input (YYYY-MM-DD)
 */
export const formatDateForInput = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toISOString().split('T')[0];
};

/**
 * Parse date from input (YYYY-MM-DD)
 */
export const parseDateFromInput = (dateString: string): Date => {
  return new Date(dateString + 'T00:00:00');
};

/**
 * Get today's date in YYYY-MM-DD format
 */
export const getTodayDateString = (): string => {
  return formatDateForInput(new Date());
};

/**
 * Calculate attendance statistics for a class
 */
export const calculateAttendanceStats = (
  records: AttendanceRecord[]
): AttendanceStats => {
  const totalDays = records.length;
  let presentDays = 0;
  let absentDays = 0;
  let lateDays = 0;
  let excusedDays = 0;

  records.forEach((record) => {
    record.students.forEach((student) => {
      switch (student.status) {
        case 'present':
          presentDays++;
          break;
        case 'absent':
          absentDays++;
          break;
        case 'late':
          lateDays++;
          break;
        case 'excused':
          excusedDays++;
          break;
      }
    });
  });

  // Calculate percentage based on total possible attendance (totalDays * number of students)
  // For simplicity, we'll calculate average percentage across all students
  const totalStudentDays = records.reduce(
    (sum, record) => sum + record.students.length,
    0
  );
  const presentStudentDays = records.reduce(
    (sum, record) =>
      sum + record.students.filter((s) => s.status === 'present').length,
    0
  );
  const percentage =
    totalStudentDays > 0 ? (presentStudentDays / totalStudentDays) * 100 : 0;

  return {
    totalDays,
    presentDays,
    absentDays,
    lateDays,
    excusedDays,
    percentage: Math.round(percentage * 100) / 100, // Round to 2 decimal places
  };
};

/**
 * Calculate attendance statistics per student
 */
export const calculateStudentAttendanceStats = (
  records: AttendanceRecord[],
  studentId: string,
  studentName: string
): StudentAttendanceStats => {
  let totalDays = 0;
  let presentDays = 0;
  let absentDays = 0;
  let lateDays = 0;
  let excusedDays = 0;

  records.forEach((record) => {
    const studentAttendance = record.students.find(
      (s) => s.studentId === studentId
    );
    if (studentAttendance) {
      totalDays++;
      switch (studentAttendance.status) {
        case 'present':
          presentDays++;
          break;
        case 'absent':
          absentDays++;
          break;
        case 'late':
          lateDays++;
          break;
        case 'excused':
          excusedDays++;
          break;
      }
    }
  });

  const percentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

  return {
    studentId,
    studentName,
    totalDays,
    presentDays,
    absentDays,
    lateDays,
    excusedDays,
    percentage: Math.round(percentage * 100) / 100,
  };
};

/**
 * Filter attendance records by date range
 */
export const filterByDateRange = (
  records: AttendanceRecord[],
  startDate?: Date,
  endDate?: Date
): AttendanceRecord[] => {
  if (!startDate && !endDate) {
    return records;
  }

  return records.filter((record) => {
    const recordDate = new Date(record.date);
    recordDate.setHours(0, 0, 0, 0);

    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      if (recordDate < start) {
        return false;
      }
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      if (recordDate > end) {
        return false;
      }
    }

    return true;
  });
};

/**
 * Filter attendance records by lecture
 */
export const filterByLecture = (
  records: AttendanceRecord[],
  lectureId: string
): AttendanceRecord[] => {
  return records.filter((record) => record.lectureId === lectureId);
};

/**
 * Filter attendance records by status
 */
export const filterByStatus = (
  records: AttendanceRecord[],
  status: AttendanceStatus
): AttendanceRecord[] => {
  return records.filter((record) =>
    record.students.some((student) => student.status === status)
  );
};

/**
 * Sort attendance records by date (newest first by default)
 */
export const sortByDate = (
  records: AttendanceRecord[],
  ascending = false
): AttendanceRecord[] => {
  return [...records].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return ascending ? dateA - dateB : dateB - dateA;
  });
};

/**
 * Get unique dates from attendance records
 */
export const getUniqueDates = (records: AttendanceRecord[]): Date[] => {
  const dates = records.map((record) => {
    const date = new Date(record.date);
    date.setHours(0, 0, 0, 0);
    return date;
  });

  const uniqueDates = Array.from(
    new Set(dates.map((date) => date.getTime()))
  ).map((time) => new Date(time));

  return uniqueDates.sort((a, b) => b.getTime() - a.getTime());
};

/**
 * Check if attendance is already marked for a date
 */
export const isAttendanceMarked = (
  records: AttendanceRecord[],
  date: string
): boolean => {
  const dateString = formatDateForInput(new Date(date));
  return records.some((record) => {
    const recordDateString = formatDateForInput(record.date);
    return recordDateString === dateString;
  });
};

/**
 * Get attendance record for a specific date
 */
export const getAttendanceByDate = (
  records: AttendanceRecord[],
  date: string
): AttendanceRecord | undefined => {
  const dateString = formatDateForInput(new Date(date));
  return records.find((record) => {
    const recordDateString = formatDateForInput(record.date);
    return recordDateString === dateString;
  });
};

