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
import type { TeachersQueryParams } from '../../../features/admin/teachers/types/teachers.types';
import { teachersApi } from '../../teachers/index.hook';

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

// Query Parameters
export interface TeachersQueryParams {
  page?: number;
  limit?: number;
  department?: string;
  status?: 'active' | 'inactive' | 'on-leave';
  search?: string;
}

export const teachersQueryKeys = {
  all: ['admin', 'teachers'] as const,
  lists: () => [...teachersQueryKeys.all, 'list'] as const,
  list: (filters?: string) => [...teachersQueryKeys.lists(), { filters }] as const,
  details: () => [...teachersQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...teachersQueryKeys.details(), id] as const,
} as const;

export const useTeachers = (params?: TeachersQueryParams) => {
  return useQuery({
    queryKey: teachersQueryKeys.list(JSON.stringify(params)),
    queryFn: () => teachersApi.getAll(params),
  });
};
