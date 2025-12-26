/**
 * Students Constants
 */

// Query keys
export const studentsQueryKeys = {
  all: ['admin', 'students'] as const,
  lists: () => [...studentsQueryKeys.all, 'list'] as const,
  list: (filters?: string) => [...studentsQueryKeys.lists(), { filters }] as const,
  details: () => [...studentsQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...studentsQueryKeys.details(), id] as const,
} as const;

// Gender options
export const GENDER_OPTIONS = ['male', 'female', 'other'] as const;

export type Gender = typeof GENDER_OPTIONS[number];

// Validation constants
export const VALIDATION = {
  AGE_MIN: 5,
  AGE_MAX: 100,
  FIRST_NAME_MIN_LENGTH: 2,
  FIRST_NAME_MAX_LENGTH: 50,
  LAST_NAME_MIN_LENGTH: 2,
  LAST_NAME_MAX_LENGTH: 50,
  STUDENT_ID_MIN_LENGTH: 3,
  STUDENT_ID_MAX_LENGTH: 20,
  PHONE_MIN_LENGTH: 10,
  PHONE_MAX_LENGTH: 15,
  EMAIL_MAX_LENGTH: 100,
  STREET_MAX_LENGTH: 100,
  CITY_MAX_LENGTH: 50,
  STATE_MAX_LENGTH: 50,
  ZIP_CODE_MAX_LENGTH: 10,
} as const;

