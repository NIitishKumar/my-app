/**
 * Teachers Constants
 */

// Query keys
export const teachersQueryKeys = {
  all: ['admin', 'teachers'] as const,
  lists: () => [...teachersQueryKeys.all, 'list'] as const,
  list: (filters?: string) => [...teachersQueryKeys.lists(), { filters }] as const,
  details: () => [...teachersQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...teachersQueryKeys.details(), id] as const,
} as const;

// Gender options
export const GENDER_OPTIONS = ['male', 'female', 'other'] as const;

// Employment type options
export const EMPLOYMENT_TYPE_OPTIONS = ['permanent', 'contract', 'part-time', 'temporary'] as const;

// Status options
export const STATUS_OPTIONS = ['active', 'inactive', 'on-leave'] as const;

// Department options
export const DEPARTMENT_OPTIONS = [
  'Mathematics',
  'English',
  'Hindi',
  'Science',
  'Social Studies',
  'Computer Science',
  'Physical Education',
  'Arts',
  'Music',
  'Administration',
] as const;

// Document type options
export const DOCUMENT_TYPE_OPTIONS = ['resume', 'certificate', 'degree', 'id-proof', 'address-proof'] as const;

// Subject options
export const SUBJECT_OPTIONS = [
  'Mathematics',
  'English',
  'Hindi',
  'Science',
  'Physics',
  'Chemistry',
  'Biology',
  'History',
  'Geography',
  'Social Studies',
  'Computer Science',
  'Physical Education',
  'Arts',
  'Music',
  'Economics',
  'Business Studies',
  'Psychology',
  'Literature',
] as const;

// Qualification options
export const QUALIFICATION_OPTIONS = [
  'Bachelor of Education (B.Ed)',
  'Master of Education (M.Ed)',
  'Bachelor of Arts (B.A)',
  'Master of Arts (M.A)',
  'Bachelor of Science (B.Sc)',
  'Master of Science (M.Sc)',
  'Bachelor of Technology (B.Tech)',
  'Master of Technology (M.Tech)',
  'Ph.D in Education',
  'Ph.D in Subject Area',
  'Diploma in Education',
  'Post Graduate Diploma',
] as const;

// Specialization options
export const SPECIALIZATION_OPTIONS = [
  'Early Childhood Education',
  'Elementary Education',
  'Secondary Education',
  'Special Education',
  'Educational Leadership',
  'Curriculum and Instruction',
  'Educational Technology',
  'Mathematics Education',
  'Science Education',
  'Language Arts',
  'Social Studies Education',
  'Physical Education',
  'Arts Education',
  'Music Education',
] as const;

// Emergency contact relationship options
export const RELATIONSHIP_OPTIONS = [
  'Spouse',
  'Parent',
  'Sibling',
  'Child',
  'Friend',
  'Other',
] as const;

// Validation constants
export const VALIDATION = {
  FIRST_NAME_MIN_LENGTH: 2,
  FIRST_NAME_MAX_LENGTH: 50,
  LAST_NAME_MIN_LENGTH: 2,
  LAST_NAME_MAX_LENGTH: 50,
  EMAIL_MAX_LENGTH: 100,
  EMPLOYEE_ID_MIN_LENGTH: 3,
  EMPLOYEE_ID_MAX_LENGTH: 20,
  PHONE_MIN_LENGTH: 10,
  PHONE_MAX_LENGTH: 15,
  QUALIFICATION_MIN_LENGTH: 3,
  QUALIFICATION_MAX_LENGTH: 100,
  EXPERIENCE_MIN: 0,
  EXPERIENCE_MAX: 50,
  SALARY_MIN: 0,
  STREET_MAX_LENGTH: 200,
  CITY_MAX_LENGTH: 100,
  STATE_MAX_LENGTH: 100,
  ZIP_CODE_MAX_LENGTH: 10,
} as const;
