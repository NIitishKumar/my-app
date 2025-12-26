/**
 * Admin Students Feature - Public Exports
 */

export { StudentsPage } from './pages/StudentsPage';
export { StudentForm } from './components/StudentForm';
export { StudentTable } from './components/StudentTable';
export { useStudents } from './hooks/useStudents';
export { useStudentDetails } from './hooks/useStudentDetails';
export { useCreateStudent } from './hooks/useCreateStudent';
export { useUpdateStudent } from './hooks/useUpdateStudent';
export { useDeleteStudent } from './hooks/useDeleteStudent';
export type { Student, CreateStudentData, UpdateStudentData } from './types/students.types';

