/**
 * Teacher Attendance Constants
 */

// React Query keys factory
export const attendanceQueryKeys = {
  all: ['teacher', 'attendance'] as const,
  dashboard: (params?: string) => 
    [...attendanceQueryKeys.all, 'dashboard', { params }] as const,
  lists: () => [...attendanceQueryKeys.all, 'list'] as const,
  list: (filters?: string) => 
    [...attendanceQueryKeys.lists(), { filters }] as const,
  details: () => [...attendanceQueryKeys.all, 'detail'] as const,
  detail: (classId: string, recordId: string) => 
    [...attendanceQueryKeys.details(), classId, recordId] as const,
  byDate: (classId: string, date: string) => 
    [...attendanceQueryKeys.all, 'byDate', classId, date] as const,
  byLecture: (classId: string, lectureId: string) => 
    [...attendanceQueryKeys.all, 'byLecture', classId, lectureId] as const,
  stats: (classId: string, params?: string) => 
    [...attendanceQueryKeys.all, 'stats', classId, { params }] as const,
  studentHistory: (studentId: string, params?: string) => 
    [...attendanceQueryKeys.all, 'studentHistory', studentId, { params }] as const,
} as const;

// Attendance status options
export const ATTENDANCE_STATUS = {
  PRESENT: 'present' as const,
  ABSENT: 'absent' as const,
  LATE: 'late' as const,
  EXCUSED: 'excused' as const,
} as const;

export const ATTENDANCE_STATUS_OPTIONS = [
  { 
    value: 'present' as const, 
    label: 'Present', 
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    borderColor: 'border-green-300',
  },
  { 
    value: 'absent' as const, 
    label: 'Absent', 
    color: 'red',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    borderColor: 'border-red-300',
  },
  { 
    value: 'late' as const, 
    label: 'Late', 
    color: 'yellow',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    borderColor: 'border-yellow-300',
  },
  { 
    value: 'excused' as const, 
    label: 'Excused', 
    color: 'blue',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    borderColor: 'border-blue-300',
  },
] as const;

// Attendance type options
export const ATTENDANCE_TYPE = {
  DATE: 'date' as const,
  LECTURE: 'lecture' as const,
} as const;

export const ATTENDANCE_TYPE_OPTIONS = [
  { value: 'date' as const, label: 'Date-based' },
  { value: 'lecture' as const, label: 'Lecture-based' },
] as const;

// Trend options
export const ATTENDANCE_TREND = {
  IMPROVING: 'improving' as const,
  DECLINING: 'declining' as const,
  STABLE: 'stable' as const,
} as const;

// Validation rules
export const VALIDATION = {
  REMARKS_MAX_LENGTH: 500,
  MIN_STUDENTS: 1,
  MAX_STUDENTS: 200,
  DATE_FORMAT: 'YYYY-MM-DD',
} as const;

// Default filters and pagination
export const DEFAULT_FILTERS = {
  DATE_RANGE_DAYS: 30,
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

// Bulk action types
export const BULK_ACTIONS = {
  MARK_ALL_PRESENT: 'mark_all_present',
  MARK_ALL_ABSENT: 'mark_all_absent',
  MARK_ALL_LATE: 'mark_all_late',
  MARK_ALL_EXCUSED: 'mark_all_excused',
  CLEAR_ALL: 'clear_all',
  SELECT_ALL: 'select_all',
  DESELECT_ALL: 'deselect_all',
} as const;

// Date format constants
export const DATE_FORMAT = {
  INPUT: 'yyyy-MM-dd',
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_FULL: 'MMMM dd, yyyy',
  DISPLAY_SHORT: 'MM/dd/yyyy',
  ISO: 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx',
} as const;

// Export formats
export const EXPORT_FORMAT = {
  EXCEL: 'excel' as const,
  CSV: 'csv' as const,
} as const;

export const EXPORT_FORMAT_OPTIONS = [
  { value: 'excel' as const, label: 'Excel (.xlsx)' },
  { value: 'csv' as const, label: 'CSV (.csv)' },
] as const;

// Date range presets
export const DATE_RANGE_PRESETS = {
  TODAY: 'today',
  THIS_WEEK: 'this_week',
  THIS_MONTH: 'this_month',
  THIS_SEMESTER: 'this_semester',
  CUSTOM: 'custom',
} as const;

export const DATE_RANGE_PRESET_OPTIONS = [
  { value: 'today', label: 'Today' },
  { value: 'this_week', label: 'This Week' },
  { value: 'this_month', label: 'This Month' },
  { value: 'this_semester', label: 'This Semester' },
  { value: 'custom', label: 'Custom Range' },
] as const;

// LocalStorage keys
export const STORAGE_KEYS = {
  DRAFT_PREFIX: 'attendance_draft_',
  FILTER_PRESETS: 'attendance_filter_presets',
  DATE_FORMAT_PREF: 'attendance_date_format_pref',
  DEFAULT_FILTERS: 'attendance_default_filters',
} as const;

// Error messages
export const ERROR_MESSAGES = {
  VALIDATION_ERROR: 'Please check your input and try again',
  UNAUTHORIZED: 'Authentication required',
  FORBIDDEN: 'You do not have permission to access this resource',
  NOT_FOUND: 'Attendance record not found',
  DUPLICATE_ATTENDANCE: 'Attendance already exists for this date',
  RECORD_LOCKED: 'This attendance record is locked and cannot be modified',
  VERSION_CONFLICT: 'Record has been updated. Please refresh and try again',
  DELETE_RESTRICTED: 'You cannot delete this attendance record',
  UPDATE_RESTRICTED: 'You cannot update this attendance record',
  FUTURE_DATE: 'Cannot mark attendance for a future date',
  OLD_DATE_UPDATE: 'Cannot update attendance records older than 30 days',
  OLD_DATE_DELETE: 'Cannot delete attendance records older than 7 days',
  NETWORK_ERROR: 'Network error. Please check your connection and try again',
  SERVER_ERROR: 'Server error. Please try again later',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  ATTENDANCE_MARKED: 'Attendance marked successfully',
  ATTENDANCE_UPDATED: 'Attendance updated successfully',
  ATTENDANCE_DELETED: 'Attendance record deleted successfully',
  DRAFT_SAVED: 'Draft saved',
  EXPORT_SUCCESS: 'Export completed successfully',
} as const;

// Keyboard shortcuts
export const KEYBOARD_SHORTCUTS = {
  MARK_PRESENT: 'p',
  MARK_ABSENT: 'a',
  MARK_LATE: 'l',
  MARK_EXCUSED: 'e',
  SAVE: 's',
  ESCAPE: 'Escape',
} as const;

