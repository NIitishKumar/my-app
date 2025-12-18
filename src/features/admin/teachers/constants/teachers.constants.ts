/**
 * Teachers Constants
 */

export const teachersQueryKeys = {
  all: ['admin', 'teachers'] as const,
  lists: () => [...teachersQueryKeys.all, 'list'] as const,
  list: (filters?: string) => [...teachersQueryKeys.lists(), { filters }] as const,
  details: () => [...teachersQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...teachersQueryKeys.details(), id] as const,
} as const;

export const SUBJECT_OPTIONS = [
  'Mathematics',
  'English',
  'Science',
  'History',
  'Geography',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'Physical Education',
  'Art',
  'Music',
] as const;


