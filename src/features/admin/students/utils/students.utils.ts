/**
 * Students Utility Functions
 */

import type { Student, CreateStudentData } from '../types/students.types';
import { VALIDATION } from '../constants/students.constants';

/**
 * Format student display name
 */
export const formatStudentName = (student: Student): string => {
  return `${student.firstName} ${student.lastName}`;
};

/**
 * Sort students by name
 */
export const sortStudents = (students: Student[]): Student[] => {
  return [...students].sort((a, b) => {
    const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
    const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
    return nameA.localeCompare(nameB);
  });
};

/**
 * Filter students by search term
 */
export const filterStudents = (students: Student[], searchTerm: string): Student[] => {
  const term = searchTerm.toLowerCase();
  return students.filter((student) =>
    student.firstName.toLowerCase().includes(term) ||
    student.lastName.toLowerCase().includes(term) ||
    student.email.toLowerCase().includes(term) ||
    student.studentId.toLowerCase().includes(term) ||
    student.phone?.toLowerCase().includes(term)
  );
};

/**
 * Validation functions
 */
export interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  studentId?: string;
  age?: string;
  gender?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  enrolledAt?: string;
  isActive?: string;
}

export const validateStudentForm = (data: Partial<CreateStudentData>): ValidationErrors => {
  const errors: ValidationErrors = {};

  // First Name validation
  if (!data.firstName || data.firstName.trim().length === 0) {
    errors.firstName = 'First name is required';
  } else if (data.firstName.length < VALIDATION.FIRST_NAME_MIN_LENGTH) {
    errors.firstName = `First name must be at least ${VALIDATION.FIRST_NAME_MIN_LENGTH} characters`;
  } else if (data.firstName.length > VALIDATION.FIRST_NAME_MAX_LENGTH) {
    errors.firstName = `First name must not exceed ${VALIDATION.FIRST_NAME_MAX_LENGTH} characters`;
  }

  // Last Name validation
  if (!data.lastName || data.lastName.trim().length === 0) {
    errors.lastName = 'Last name is required';
  } else if (data.lastName.length < VALIDATION.LAST_NAME_MIN_LENGTH) {
    errors.lastName = `Last name must be at least ${VALIDATION.LAST_NAME_MIN_LENGTH} characters`;
  } else if (data.lastName.length > VALIDATION.LAST_NAME_MAX_LENGTH) {
    errors.lastName = `Last name must not exceed ${VALIDATION.LAST_NAME_MAX_LENGTH} characters`;
  }

  // Email validation
  if (!data.email || data.email.trim().length === 0) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Please enter a valid email address';
  } else if (data.email.length > VALIDATION.EMAIL_MAX_LENGTH) {
    errors.email = `Email must not exceed ${VALIDATION.EMAIL_MAX_LENGTH} characters`;
  }

  // Student ID validation
  if (!data.studentId || data.studentId.trim().length === 0) {
    errors.studentId = 'Student ID is required';
  } else if (data.studentId.length < VALIDATION.STUDENT_ID_MIN_LENGTH) {
    errors.studentId = `Student ID must be at least ${VALIDATION.STUDENT_ID_MIN_LENGTH} characters`;
  } else if (data.studentId.length > VALIDATION.STUDENT_ID_MAX_LENGTH) {
    errors.studentId = `Student ID must not exceed ${VALIDATION.STUDENT_ID_MAX_LENGTH} characters`;
  }

  // Age validation
  if (data.age !== undefined && data.age !== null) {
    if (data.age < VALIDATION.AGE_MIN) {
      errors.age = `Age must be at least ${VALIDATION.AGE_MIN}`;
    } else if (data.age > VALIDATION.AGE_MAX) {
      errors.age = `Age must not exceed ${VALIDATION.AGE_MAX}`;
    }
  }

  // Gender validation
  if (data.gender && !['male', 'female', 'other'].includes(data.gender)) {
    errors.gender = 'Gender must be one of: male, female, other';
  }

  // Phone validation
  if (data.phone && data.phone.trim().length > 0) {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(data.phone)) {
      errors.phone = 'Please enter a valid phone number';
    } else if (data.phone.replace(/\D/g, '').length < VALIDATION.PHONE_MIN_LENGTH) {
      errors.phone = `Phone number must be at least ${VALIDATION.PHONE_MIN_LENGTH} digits`;
    } else if (data.phone.length > VALIDATION.PHONE_MAX_LENGTH) {
      errors.phone = `Phone number must not exceed ${VALIDATION.PHONE_MAX_LENGTH} characters`;
    }
  }

  // Address validation (all optional, but validate format if provided)
  if (data.address) {
    const addressErrors: Record<string, string> = {};
    if (data.address.street && data.address.street.length > VALIDATION.STREET_MAX_LENGTH) {
      addressErrors.street = `Street must not exceed ${VALIDATION.STREET_MAX_LENGTH} characters`;
    }
    if (data.address.city && data.address.city.length > VALIDATION.CITY_MAX_LENGTH) {
      addressErrors.city = `City must not exceed ${VALIDATION.CITY_MAX_LENGTH} characters`;
    }
    if (data.address.state && data.address.state.length > VALIDATION.STATE_MAX_LENGTH) {
      addressErrors.state = `State must not exceed ${VALIDATION.STATE_MAX_LENGTH} characters`;
    }
    if (data.address.zipCode && data.address.zipCode.length > VALIDATION.ZIP_CODE_MAX_LENGTH) {
      addressErrors.zipCode = `Zip code must not exceed ${VALIDATION.ZIP_CODE_MAX_LENGTH} characters`;
    }
    if (Object.keys(addressErrors).length > 0) {
      errors.address = addressErrors;
    }
  }

  // Enrolled At validation (optional - API auto-generates it)
  if (data.enrolledAt) {
    const enrolledDate = typeof data.enrolledAt === 'string' ? new Date(data.enrolledAt) : new Date(data.enrolledAt);
    if (isNaN(enrolledDate.getTime())) {
      errors.enrolledAt = 'Please enter a valid date';
    }
  }

  return errors;
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
export const getDefaultStudentFormData = (): Partial<CreateStudentData> => {
  return {
    firstName: '',
    lastName: '',
    email: '',
    studentId: '',
    age: undefined,
    gender: undefined,
    phone: '',
    grade: undefined,
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
    },
    enrolledAt: undefined, // Optional - API auto-generates
    isActive: undefined, // Optional - defaults to true in API
  };
};

/**
 * Get student initials from name
 */
export const getStudentInitials = (firstName: string, lastName: string): string => {
  const first = firstName.charAt(0).toUpperCase();
  const last = lastName.charAt(0).toUpperCase();
  return `${first}${last}`;
};

/**
 * Get avatar color based on student initials
 */
export const getStudentAvatarColor = (initials: string): string => {
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


