/**
 * Attendance Feature - Public Exports
 */

// Pages
export { AttendancePage } from './pages/AttendancePage';

// Components
export { AttendanceTab } from './components/AttendanceTab';
export { AttendanceForm } from './components/AttendanceForm';
export { AttendanceList } from './components/AttendanceList';
export { AttendanceStats } from './components/AttendanceStats';

// Hooks
export { useClassAttendance } from './hooks/useClassAttendance';
export { useMarkAttendance, useUpdateAttendance, useDeleteAttendance } from './hooks/useMarkAttendance';
export { useAttendanceStats } from './hooks/useAttendanceStats';
export { useAttendanceByDate } from './hooks/useAttendanceByDate';

// Types
export type {
  AttendanceRecord,
  StudentAttendance,
  AttendanceStats as AttendanceStatsType,
  MarkAttendanceData,
  UpdateAttendanceData,
  AttendanceStatus,
  AttendanceFilters,
} from './types/attendance.types';

// Constants
export { attendanceQueryKeys, ATTENDANCE_STATUS, ATTENDANCE_STATUS_OPTIONS } from './constants/attendance.constants';

// Utils
export {
  formatAttendanceDate,
  formatDateForInput,
  parseDateFromInput,
  getTodayDateString,
  calculateAttendanceStats,
  calculateStudentAttendanceStats,
  filterByDateRange,
  filterByLecture,
  filterByStatus,
  sortByDate,
} from './utils/attendance.utils';

// API
export { attendanceApi } from './api/attendance.api';

