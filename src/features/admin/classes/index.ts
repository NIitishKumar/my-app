/**
 * Admin Classes Feature - Public Exports
 */

// Pages
export { ClassesPage } from './pages/ClassesPage';
export { ClassDetailsPage } from './pages/ClassDetailsPage';

// Components
export { ClassTable } from './components/ClassTable';
export { ClassForm } from './components/ClassForm';

// Hooks
export { useClasses } from './hooks/useClasses';
export { useClassDetails } from './hooks/useClassDetails';
export { useCreateClass } from './hooks/useCreateClass';
export { useUpdateClass } from './hooks/useUpdateClass';
export { useDeleteClass } from './hooks/useDeleteClass';

// Types
export type { Class, CreateClassData, UpdateClassData } from './types/classes.types';

// Constants
export { classesQueryKeys, GRADE_OPTIONS, SECTION_OPTIONS } from './constants/classes.constants';

// Utils
export { formatClassName, sortClasses, filterClasses } from './utils/classes.utils';

// API
export { classesApi } from './api/classes.api';

// Attendance
export { AttendancePage } from './attendance/pages/AttendancePage';
export { AttendanceTab } from './attendance/components/AttendanceTab';
export { AttendanceForm } from './attendance/components/AttendanceForm';
export { AttendanceList } from './attendance/components/AttendanceList';
export { AttendanceStats } from './attendance/components/AttendanceStats';
export { useClassAttendance } from './attendance/hooks/useClassAttendance';
export { useMarkAttendance, useUpdateAttendance, useDeleteAttendance } from './attendance/hooks/useMarkAttendance';
export { useAttendanceStats } from './attendance/hooks/useAttendanceStats';
export { useAttendanceByDate } from './attendance/hooks/useAttendanceByDate';
export type {
  AttendanceRecord,
  StudentAttendance,
  AttendanceStats,
  MarkAttendanceData,
  UpdateAttendanceData,
  AttendanceStatus,
} from './attendance/types/attendance.types';


