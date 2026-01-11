/**
 * Teacher Attendance Module Exports
 */

// Types
export type * from './types/attendance.types';

// Constants
export * from './constants/attendance.constants';

// API
export * from './api/attendance.endpoints';
export * from './api/attendance.api';

// Hooks
export { useAttendanceDashboard } from './hooks/useAttendanceDashboard';
export { useAttendanceRecords } from './hooks/useAttendanceRecords';
export { useAttendanceByDate } from './hooks/useAttendanceByDate';
export { useAttendanceByLecture } from './hooks/useAttendanceByLecture';
export { useMarkAttendance } from './hooks/useMarkAttendance';
export { useUpdateAttendance } from './hooks/useUpdateAttendance';
export { useDeleteAttendance } from './hooks/useDeleteAttendance';
export { useAttendanceStats } from './hooks/useAttendanceStats';
export { useStudentAttendanceHistory } from './hooks/useStudentAttendanceHistory';

// Utils
export * from './utils/attendance.utils';

// Pages
export { AttendancePage } from './pages/AttendancePage';

// Components
export { AttendanceDashboard } from './components/AttendanceDashboard';
export { AttendanceMarkingForm } from './components/AttendanceMarkingForm';
export { AttendanceRecordsList } from './components/AttendanceRecordsList';
export { AttendanceStatistics } from './components/AttendanceStatistics';
export { QuickMarkCard } from './components/QuickMarkCard';
export { PendingAttendanceList } from './components/PendingAttendanceList';
export { RecentActivity } from './components/RecentActivity';
export { AttendanceFilters } from './components/AttendanceFilters';

