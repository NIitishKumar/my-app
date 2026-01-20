/**
 * useExams Hook
 */

import { useQuery } from '@tanstack/react-query';
import { adminExamService } from '../api/exams.service';
import type { ExamsResponse } from '../../../student/exams/types/exam.types';

export const adminExamQueryKeys = {
  all: ['admin-exams'] as const,
  lists: () => [...adminExamQueryKeys.all, 'list'] as const,
  list: (filters?: any) => [...adminExamQueryKeys.lists(), filters] as const,
  details: () => [...adminExamQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...adminExamQueryKeys.details(), id] as const,
  dashboard: (filters?: any) => [...adminExamQueryKeys.all, 'dashboard', filters] as const,
  analytics: (filters?: any) => [...adminExamQueryKeys.all, 'analytics', filters] as const,
  conflicts: (filters?: any) => [...adminExamQueryKeys.all, 'conflicts', filters] as const,
};

export const useExams = (filters?: {
  classId?: string;
  subject?: string;
  teacherId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery<ExamsResponse>({
    queryKey: adminExamQueryKeys.list(filters),
    queryFn: () => adminExamService.getExams(filters),
    staleTime: 5 * 60 * 1000,
  });
};

