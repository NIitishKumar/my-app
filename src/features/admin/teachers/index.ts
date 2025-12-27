/**
 * Admin Teachers Feature - Public Exports
 */

export { TeachersPage } from './pages/TeachersPage';
export { TeacherForm } from './components/TeacherForm';
export { TeacherTable } from './components/TeacherTable';
export { TeacherAvatar } from './components/TeacherAvatar';
export { useTeachers } from './hooks/useTeachers';
export { useTeacherDetails } from './hooks/useTeacherDetails';
export { useCreateTeacher } from './hooks/useCreateTeacher';
export { useUpdateTeacher } from './hooks/useUpdateTeacher';
export { useDeleteTeacher } from './hooks/useDeleteTeacher';
export { useTeachersStats } from './hooks/useTeachersStats';
export { useTeachersByDepartment } from './hooks/useTeachersByDepartment';
export { useTeacherWithClasses } from './hooks/useTeacherWithClasses';
export { useAddClassToTeacher } from './hooks/useAddClassToTeacher';
export { useRemoveClassFromTeacher } from './hooks/useRemoveClassFromTeacher';
export type { Teacher, CreateTeacherData, UpdateTeacherData } from './types/teachers.types';
