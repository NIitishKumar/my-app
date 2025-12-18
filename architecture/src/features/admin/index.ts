// Admin feature public exports
export { AdminFeature } from './index';
export { AdminDashboardPage } from './dashboard';
export { ClassesPage } from './classes';
export { TeachersPage } from './teachers';
export { StudentsPage } from './students';

// Export hooks
export * from './hooks/useClassList';
export * from './hooks/useCreateClass';
export * from './hooks/useUpdateClass';
export * from './hooks/useDeleteClass';
export * from './hooks/useTeacherList';
export * from './hooks/useStudentList';
export * from './hooks/useAdminStats';

// Export types
export * from './admin.types';
export * from './admin.constants';

