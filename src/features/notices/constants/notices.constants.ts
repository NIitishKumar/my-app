/**
 * Notices Constants
 */

// Query keys (matching pattern from shared/hooks/useApi.ts)
export const noticesQueryKeys = {
  all: ['admin', 'notices'] as const,
  lists: () => [...noticesQueryKeys.all, 'list'] as const,
  list: (filters?: string) => [...noticesQueryKeys.lists(), { filters }] as const,
  details: () => [...noticesQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...noticesQueryKeys.details(), id] as const,
} as const;

// Audience options
export const NOTICE_AUDIENCE = {
  ALL: 'ALL',
  TEACHERS: 'TEACHERS',
  STUDENTS: 'STUDENTS',
  PARENTS: 'PARENTS',
} as const;

export const AUDIENCE_OPTIONS = [
  { value: 'ALL', label: 'All' },
  { value: 'TEACHERS', label: 'Teachers' },
  { value: 'STUDENTS', label: 'Students' },
  { value: 'PARENTS', label: 'Parents' },
] as const;

// Priority options
export const NOTICE_PRIORITY = {
  NORMAL: 'NORMAL',
  IMPORTANT: 'IMPORTANT',
  URGENT: 'URGENT',
} as const;

export const PRIORITY_OPTIONS = [
  { value: 'NORMAL', label: 'Normal' },
  { value: 'IMPORTANT', label: 'Important' },
  { value: 'URGENT', label: 'Urgent' },
] as const;

// Status options
export const NOTICE_STATUS = {
  PUBLISHED: 'PUBLISHED',
  SCHEDULED: 'SCHEDULED',
  DRAFT: 'DRAFT',
} as const;

// Publish type options
export const PUBLISH_TYPE = {
  NOW: 'NOW',
  SCHEDULED: 'SCHEDULED',
} as const;

// Validation constants
export const VALIDATION = {
  TITLE_MIN_LENGTH: 3,
  TITLE_MAX_LENGTH: 100,
  DESCRIPTION_MIN_LENGTH: 10,
  DESCRIPTION_MAX_LENGTH: 5000,
} as const;
