/**
 * Attendance Constants
 */

// Query keys for React Query
export const attendanceQueryKeys = {
  all: ['admin', 'classes', 'attendance'] as const,
  lists: () => [...attendanceQueryKeys.all, 'list'] as const,
  list: (classId: string, filters?: string) => 
    [...attendanceQueryKeys.lists(), classId, { filters }] as const,
  details: () => [...attendanceQueryKeys.all, 'detail'] as const,
  detail: (classId: string, recordId: string) => 
    [...attendanceQueryKeys.details(), classId, recordId] as const,
  byDate: (classId: string, date: string) => 
    [...attendanceQueryKeys.all, 'byDate', classId, date] as const,
  byLecture: (classId: string, lectureId: string) => 
    [...attendanceQueryKeys.all, 'byLecture', classId, lectureId] as const,
  stats: (classId: string) => 
    [...attendanceQueryKeys.all, 'stats', classId] as const,
} as const;

// Attendance status options
export const ATTENDANCE_STATUS = {
  PRESENT: 'present' as const,
  ABSENT: 'absent' as const,
  LATE: 'late' as const,
  EXCUSED: 'excused' as const,
} as const;

export const ATTENDANCE_STATUS_OPTIONS = [
  { value: 'present', label: 'Present', color: 'green' },
  { value: 'absent', label: 'Absent', color: 'red' },
  { value: 'late', label: 'Late', color: 'yellow' },
  { value: 'excused', label: 'Excused', color: 'blue' },
] as const;

// Validation rules
export const VALIDATION = {
  REMARKS_MAX_LENGTH: 500,
  MIN_STUDENTS: 1,
} as const;

// Default filters
export const DEFAULT_FILTERS = {
  DATE_RANGE_DAYS: 30, // Default to last 30 days
} as const;

// Bulk action types
export const BULK_ACTIONS = {
  MARK_ALL_PRESENT: 'mark_all_present',
  MARK_ALL_ABSENT: 'mark_all_absent',
  CLEAR_ALL: 'clear_all',
} as const;

