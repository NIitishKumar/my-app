/**
 * Classes Constants
 */

// Query keys
export const classesQueryKeys = {
  all: ['admin', 'classes'] as const,
  lists: () => [...classesQueryKeys.all, 'list'] as const,
  list: (filters?: string) => [...classesQueryKeys.lists(), { filters }] as const,
  details: () => [...classesQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...classesQueryKeys.details(), id] as const,
} as const;

// Status options
export const CLASS_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ARCHIVED: 'archived',
} as const;

// Grade options
export const GRADE_OPTIONS = [
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'
] as const;

// Section options
export const SECTION_OPTIONS = ['A', 'B', 'C', 'D', 'E'] as const;

// Semester options
export const SEMESTER_OPTIONS = ['Fall', 'Spring', 'Summer', 'Winter'] as const;

export type Semester = typeof SEMESTER_OPTIONS[number];

// Subject options (common subjects)
export const SUBJECT_OPTIONS = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'English',
  'History',
  'Geography',
  'Computer Science',
  'Physical Education',
  'Art',
  'Music',
  'Economics',
  'Business Studies',
  'Psychology',
  'Literature',
] as const;

// Academic year options (current year ± 2 years)
export const getAcademicYearOptions = (): string[] => {
  const currentYear = new Date().getFullYear();
  const years: string[] = [];
  
  for (let i = -2; i <= 2; i++) {
    const year = currentYear + i;
    years.push(`${year}-${year + 1}`);
  }
  
  return years;
};

// Validation constants
export const VALIDATION = {
  CAPACITY_MIN: 1,
  CAPACITY_MAX: 200,
  ENROLLED_MIN: 0,
  CLASS_NAME_MIN_LENGTH: 2,
  CLASS_NAME_MAX_LENGTH: 100,
  ROOM_NO_MIN_LENGTH: 1,
  ROOM_NO_MAX_LENGTH: 20,
  EMPLOYEE_ID_MIN_LENGTH: 3,
  EMPLOYEE_ID_MAX_LENGTH: 20,
} as const;


