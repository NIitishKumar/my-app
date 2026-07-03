/**
 * useClassDetails Hook - GET by id
 */

import { useQuery } from '@tanstack/react-query';
import { classesApi } from '../api/classes.api';

export const classesQueryKeys = {
  all: ['admin', 'classes'] as const,
  lists: () => [...classesQueryKeys.all, 'list'] as const,
  list: (filters?: string) => [...classesQueryKeys.lists(), { filters }] as const,
  details: () => [...classesQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...classesQueryKeys.details(), id] as const,
} as const;

export const useClassDetails = (id: string) => {
  return useQuery({
    queryKey: classesQueryKeys.detail(id),
    queryFn: () => classesApi.getById(id),
    enabled: !!id,
  });
};

/**
 * useStudentDetails Hook - GET by id
 */
export const studentsQueryKeys = {
  lists: () => [...studentsQueryKeys.all, 'list'] as const,
  all: ['admin', 'students'] as const,

  list: ['admin', 'students', 'list'] as const,

  detail: (id: string) => ['admin', 'students', 'detail', id] as const,
};

import { studentsApi } from '../../students/apis/students.api';

export const useStudents = () => {
  return useQuery({
    queryKey: studentsQueryKeys.lists(),
    queryFn: () => studentsApi.getAll(),
  });
};

export const useStudentDetails = (id: string) => {
  return useQuery({
    queryKey: studentsQueryKeys.detail(id),
    queryFn: () => studentsApi.getById(id),
    enabled: !!id,
  });
};
