/**
 * Teacher Attendance Utility Functions
 */

import { format, parseISO, isValid, differenceInDays, startOfDay, endOfDay } from 'date-fns';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import type {
  AttendanceRecord,
  AttendanceStatus,
  StudentAttendanceStatistics,
  MarkAttendanceData,
  AttendanceTrend,
} from '../types/attendance.types';
import { VALIDATION, DATE_FORMAT } from '../constants/attendance.constants';

/**
 * Format date for input (YYYY-MM-DD)
 */
export const formatDateForInput = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) {
    return format(new Date(), DATE_FORMAT.INPUT);
  }
  return format(dateObj, DATE_FORMAT.INPUT);
};

/**
 * Get today's date in YYYY-MM-DD format
 */
export const getTodayDateString = (): string => {
  return formatDateForInput(new Date());
};

/**
 * Parse date from input string (YYYY-MM-DD)
 */
export const parseDateFromInput = (dateString: string): Date => {
  return parseISO(dateString);
};

/**
 * Format date for display
 */
export const formatAttendanceDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) {
    return 'Invalid Date';
  }
  return format(dateObj, DATE_FORMAT.DISPLAY);
};

/**
 * Format date for full display
 */
export const formatAttendanceDateFull = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) {
    return 'Invalid Date';
  }
  return format(dateObj, DATE_FORMAT.DISPLAY_FULL);
};

/**
 * Check if attendance is marked for a date
 */
export const isAttendanceMarked = (record: AttendanceRecord | null | undefined): boolean => {
  return record !== null && record !== undefined;
};

/**
 * Calculate attendance rate (Present + Late) / Total Days × 100
 */
export const calculateAttendanceRate = (
  present: number,
  late: number,
  total: number
): number => {
  if (total === 0) return 0;
  return Math.round(((present + late) / total) * 100 * 100) / 100;
};

/**
 * Calculate trend: Compare last 7 days vs previous 7 days
 */
export const calculateTrend = (
  recent: number,
  previous: number
): AttendanceTrend => {
  if (recent > previous) return 'improving';
  if (recent < previous) return 'declining';
  return 'stable';
};

/**
 * Calculate student trend from statistics
 */
export const calculateStudentTrend = (
  stats: StudentAttendanceStatistics,
  recentRate?: number
): AttendanceTrend => {
  if (recentRate !== undefined) {
    return calculateTrend(recentRate, stats.attendanceRate);
  }
  return stats.trend || 'stable';
};

/**
 * Validate attendance data before submission
 */
export const validateAttendanceData = (data: MarkAttendanceData): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  // Validate classId
  if (!data.classId || data.classId.trim() === '') {
    errors.push('Class ID is required');
  }

  // Validate date
  if (!data.date || data.date.trim() === '') {
    errors.push('Date is required');
  } else {
    const date = parseDateFromInput(data.date);
    if (!isValid(date)) {
      errors.push('Invalid date format');
    } else {
      // Check if date is in the future
      const today = startOfDay(new Date());
      const selectedDate = startOfDay(date);
      if (selectedDate > today) {
        errors.push('Cannot mark attendance for a future date');
      }
    }
  }

  // Validate students array
  if (!data.students || data.students.length === 0) {
    errors.push('At least one student must be marked');
  } else if (data.students.length > VALIDATION.MAX_STUDENTS) {
    errors.push(`Cannot mark attendance for more than ${VALIDATION.MAX_STUDENTS} students`);
  }

  // Validate each student
  data.students.forEach((student, index) => {
    if (!student.studentId || student.studentId.trim() === '') {
      errors.push(`Student ${index + 1}: Student ID is required`);
    }
    if (!student.status || !['present', 'absent', 'late', 'excused'].includes(student.status)) {
      errors.push(`Student ${index + 1}: Invalid status`);
    }
    if (student.remarks && student.remarks.length > VALIDATION.REMARKS_MAX_LENGTH) {
      errors.push(`Student ${index + 1}: Remarks cannot exceed ${VALIDATION.REMARKS_MAX_LENGTH} characters`);
    }
  });

  // Validate lecture (if lecture-based attendance)
  if (data.lectureId && data.lectureId.trim() === '') {
    errors.push('Lecture ID is required for lecture-based attendance');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Check if date is within allowed range for updates (30 days)
 */
export const canUpdateAttendance = (date: Date | string, maxDaysOld: number = 30): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return false;
  
  const today = startOfDay(new Date());
  const recordDate = startOfDay(dateObj);
  const daysDiff = differenceInDays(today, recordDate);
  
  return daysDiff <= maxDaysOld;
};

/**
 * Check if date is within allowed range for deletes (7 days)
 */
export const canDeleteAttendance = (date: Date | string, maxDaysOld: number = 7): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return false;
  
  const today = startOfDay(new Date());
  const recordDate = startOfDay(dateObj);
  const daysDiff = differenceInDays(today, recordDate);
  
  return daysDiff <= maxDaysOld;
};

/**
 * Check if record can be modified (not locked and within time restrictions)
 */
export const canModifyRecord = (
  record: AttendanceRecord,
  isTeacher: boolean = true,
  updateMaxDays: number = 30
): { canModify: boolean; reason?: string } => {
  if (record.isLocked) {
    return { canModify: false, reason: 'Record is locked and cannot be modified' };
  }

  if (isTeacher) {
    if (!canUpdateAttendance(record.date, updateMaxDays)) {
      return { canModify: false, reason: 'Cannot update records older than 30 days' };
    }
  }

  return { canModify: true };
};

/**
 * Export attendance records to Excel
 */
export const exportToExcel = (
  records: AttendanceRecord[],
  filename: string = `attendance_${format(new Date(), 'yyyy-MM-dd')}.xlsx`
): void => {
  try {
    // Prepare data for export
    const exportData = records.flatMap((record) =>
      record.students.map((student) => ({
        Date: formatAttendanceDate(record.date),
        Class: record.className,
        'Student ID': student.studentIdNumber || student.studentId,
        'Student Name': student.studentName,
        Status: student.status.toUpperCase(),
        Remarks: student.remarks || '',
        'Submitted At': record.submittedAt ? format(record.submittedAt, DATE_FORMAT.DISPLAY_FULL) : '',
        'Submitted By': record.submittedBy || '',
      }))
    );

    // Create workbook and worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance');

    // Set column widths
    const colWidths = [
      { wch: 12 }, // Date
      { wch: 20 }, // Class
      { wch: 15 }, // Student ID
      { wch: 25 }, // Student Name
      { wch: 10 }, // Status
      { wch: 30 }, // Remarks
      { wch: 20 }, // Submitted At
      { wch: 15 }, // Submitted By
    ];
    ws['!cols'] = colWidths;

    // Write file
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, filename);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    throw new Error('Failed to export attendance data to Excel');
  }
};

/**
 * Export attendance records to CSV
 */
export const exportToCSV = (
  records: AttendanceRecord[],
  filename: string = `attendance_${format(new Date(), 'yyyy-MM-dd')}.csv`
): void => {
  try {
    // Prepare data for export
    const exportData = records.flatMap((record) =>
      record.students.map((student) => ({
        Date: formatAttendanceDate(record.date),
        Class: record.className,
        'Student ID': student.studentIdNumber || student.studentId,
        'Student Name': student.studentName,
        Status: student.status.toUpperCase(),
        Remarks: student.remarks || '',
        'Submitted At': record.submittedAt ? format(record.submittedAt, DATE_FORMAT.DISPLAY_FULL) : '',
        'Submitted By': record.submittedBy || '',
      }))
    );

    // Create worksheet and convert to CSV
    const ws = XLSX.utils.json_to_sheet(exportData);
    const csv = XLSX.utils.sheet_to_csv(ws);

    // Create blob and save
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, filename);
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    throw new Error('Failed to export attendance data to CSV');
  }
};

/**
 * Save draft to localStorage
 */
export const saveDraftToLocalStorage = (
  classId: string,
  date: string,
  data: Partial<MarkAttendanceData>
): void => {
  try {
    const key = `attendance_draft_${classId}_${date}`;
    const draftData = {
      ...data,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(key, JSON.stringify(draftData));
  } catch (error) {
    console.error('Error saving draft to localStorage:', error);
  }
};

/**
 * Load draft from localStorage
 */
export const loadDraftFromLocalStorage = (
  classId: string,
  date: string
): Partial<MarkAttendanceData> | null => {
  try {
    const key = `attendance_draft_${classId}_${date}`;
    const draftStr = localStorage.getItem(key);
    if (!draftStr) return null;
    
    const draftData = JSON.parse(draftStr);
    // Remove savedAt field
    const { savedAt, ...data } = draftData;
    return data;
  } catch (error) {
    console.error('Error loading draft from localStorage:', error);
    return null;
  }
};

/**
 * Clear draft from localStorage
 */
export const clearDraft = (classId: string, date: string): void => {
  try {
    const key = `attendance_draft_${classId}_${date}`;
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error clearing draft from localStorage:', error);
  }
};

/**
 * Get status color class
 */
export const getStatusColorClass = (status: AttendanceStatus): string => {
  switch (status) {
    case 'present':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'absent':
      return 'bg-red-100 text-red-800 border-red-300';
    case 'late':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'excused':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

/**
 * Get trend color class
 */
export const getTrendColorClass = (trend: AttendanceTrend): string => {
  switch (trend) {
    case 'improving':
      return 'text-green-600';
    case 'declining':
      return 'text-red-600';
    case 'stable':
      return 'text-gray-600';
    default:
      return 'text-gray-600';
  }
};

/**
 * Format percentage for display
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Get academic year start date (default: September 1st of current year)
 */
export const getAcademicYearStart = (): Date => {
  const now = new Date();
  const year = now.getMonth() >= 8 ? now.getFullYear() : now.getFullYear() - 1; // September is month 8 (0-indexed)
  return new Date(year, 8, 1); // September 1st
};

/**
 * Check if date is within academic year
 */
export const isWithinAcademicYear = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return false;
  
  const academicYearStart = startOfDay(getAcademicYearStart());
  const academicYearEnd = endOfDay(new Date(academicYearStart.getFullYear() + 1, 8, 0)); // August 31st of next year
  const checkDate = startOfDay(dateObj);
  
  return checkDate >= academicYearStart && checkDate <= academicYearEnd;
};

