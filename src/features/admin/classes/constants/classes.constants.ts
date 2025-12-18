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


