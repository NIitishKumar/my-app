/**
 * Base React Query Hook
 * Provides common configuration for API hooks
 */

import { QueryClient, type UseQueryOptions, type UseMutationOptions } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Query keys for cache management
export const queryKeys = {
  auth: {
    session: ['auth', 'session'] as const,
  },
  admin: {
    classes: ['admin', 'classes'] as const,
    class: (id: string) => ['admin', 'classes', id] as const,
    teachers: ['admin', 'teachers'] as const,
    teacher: (id: string) => ['admin', 'teachers', id] as const,
    lectures: ['admin', 'lectures'] as const,
    lecture: (id: string) => ['admin', 'lectures', id] as const,
    reports: ['admin', 'reports'] as const,
  },
  teacher: {
    classes: ['teacher', 'classes'] as const,
    attendance: ['teacher', 'attendance'] as const,
    queries: ['teacher', 'queries'] as const,
  },
  student: {
    exams: ['student', 'exams'] as const,
    notifications: ['student', 'notifications'] as const,
    records: ['student', 'records'] as const,
    teachers: ['student', 'teachers'] as const,
  },
  parent: {
    children: ['parent', 'children'] as const,
    attendance: (childId: string) => ['parent', 'attendance', childId] as const,
    records: (childId: string) => ['parent', 'records', childId] as const,
    teachers: (childId: string) => ['parent', 'teachers', childId] as const,
    queries: ['parent', 'queries'] as const,
  },
} as const;

// Type helpers for better type inference
export type QueryOptions<TData, TError = Error> = Omit<
  UseQueryOptions<TData, TError>,
  'queryKey' | 'queryFn'
>;

export type MutationOptions<TData, TVariables, TError = Error> = Omit<
  UseMutationOptions<TData, TError, TVariables>,
  'mutationFn'
>;

