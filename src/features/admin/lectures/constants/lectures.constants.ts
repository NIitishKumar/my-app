/**
 * Lectures Constants
 */

// Query keys
export const lecturesQueryKeys = {
  all: ['admin', 'lectures'] as const,
  lists: () => [...lecturesQueryKeys.all, 'list'] as const,
  list: (filters?: string) => [...lecturesQueryKeys.lists(), { filters }] as const,
  details: () => [...lecturesQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...lecturesQueryKeys.details(), id] as const,
} as const;

// Day of week options
export const DAY_OF_WEEK_OPTIONS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;

// Lecture type options
export const LECTURE_TYPE_OPTIONS = ['lecture', 'lab', 'seminar', 'tutorial'] as const;

// Material type options
export const MATERIAL_TYPE_OPTIONS = ['document', 'presentation', 'video', 'link'] as const;

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

// Time options (common class times)
export const TIME_OPTIONS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00',
] as const;

// Validation constants
export const VALIDATION = {
  TITLE_MIN_LENGTH: 3,
  TITLE_MAX_LENGTH: 200,
  DESCRIPTION_MAX_LENGTH: 1000,
  SUBJECT_MIN_LENGTH: 2,
  SUBJECT_MAX_LENGTH: 100,
  DURATION_MIN: 15, // 15 minutes
  DURATION_MAX: 180, // 3 hours
  ROOM_MAX_LENGTH: 50,
  FIRST_NAME_MIN_LENGTH: 2,
  FIRST_NAME_MAX_LENGTH: 50,
  LAST_NAME_MIN_LENGTH: 2,
  LAST_NAME_MAX_LENGTH: 50,
  EMAIL_MAX_LENGTH: 100,
  TEACHER_ID_MIN_LENGTH: 3,
  TEACHER_ID_MAX_LENGTH: 20,
} as const;

