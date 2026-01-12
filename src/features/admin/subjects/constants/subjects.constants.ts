/**
 * Subjects Constants
 */

// Query keys
export const subjectsQueryKeys = {
  all: ['admin', 'subjects'] as const,
  lists: () => [...subjectsQueryKeys.all, 'list'] as const,
  list: (filters?: string) => [...subjectsQueryKeys.lists(), { filters }] as const,
  details: () => [...subjectsQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...subjectsQueryKeys.details(), id] as const,
} as const;

// Status options
export const SUBJECT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;

// Validation constants
export const VALIDATION = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  AUTHOR_MIN_LENGTH: 2,
  AUTHOR_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 1000,
  PRICE_MIN: 0,
  PRICE_MAX: 999999.99,
  CLASSES_MIN: 1,
} as const;

