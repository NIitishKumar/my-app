/**
 * Teachers Utility Functions
 */

import type { Teacher, CreateTeacherData } from '../types/teachers.types';

/**
 * Format teacher display name
 */
export const formatTeacherName = (teacher: Teacher): string => {
  return `${teacher.firstName} ${teacher.lastName}`;
};

/**
 * Sort teachers by name
 */
export const sortTeachers = (teachers: Teacher[]): Teacher[] => {
  return [...teachers].sort((a, b) => {
    const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
    const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
    return nameA.localeCompare(nameB);
  });
};

/**
 * Filter teachers by search term (client-side filtering - for fallback only)
 */
export const filterTeachers = (teachers: Teacher[], searchTerm: string): Teacher[] => {
  const term = searchTerm.toLowerCase();
  return teachers.filter((teacher) =>
    teacher.firstName.toLowerCase().includes(term) ||
    teacher.lastName.toLowerCase().includes(term) ||
    teacher.email.toLowerCase().includes(term) ||
    teacher.employeeId.toLowerCase().includes(term) ||
    teacher.phone?.toLowerCase().includes(term) ||
    teacher.department?.toLowerCase().includes(term) ||
    teacher.qualification?.toLowerCase().includes(term)
  );
};

/**
 * Get teacher initials from name
 */
export const getTeacherInitials = (firstName: string, lastName: string): string => {
  const first = firstName.charAt(0).toUpperCase();
  const last = lastName.charAt(0).toUpperCase();
  return `${first}${last}`;
};

/**
 * Get avatar color based on teacher initials
 */
export const getTeacherAvatarColor = (initials: string): string => {
  const colors = [
    'bg-purple-500',
    'bg-indigo-500',
    'bg-blue-500',
    'bg-cyan-500',
    'bg-teal-500',
    'bg-green-500',
  ];
  const index = initials.charCodeAt(0) % colors.length;
  return colors[index];
};

/**
 * Format date to YYYY-MM-DD for input fields
 */
export const formatDateForInput = (date: Date | string | undefined): string => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';
  return d.toISOString().split('T')[0];
};

/**
 * Parse date string to Date object
 */
export const parseDateFromInput = (dateString: string): Date | undefined => {
  if (!dateString) return undefined;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? undefined : date;
};

/**
 * Get default form values (matching API schema)
 */
export const getDefaultTeacherFormData = (): Partial<CreateTeacherData> => {
  return {
    firstName: '',
    lastName: '',
    email: '',
    employeeId: '',
    phone: '',
    department: undefined,
    qualification: '',
    specialization: '',
    subjects: [],
    experience: undefined,
    joiningDate: new Date().toISOString().split('T')[0],
    employmentType: 'full-time',
    status: 'active',
  };
};
