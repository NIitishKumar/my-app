/**
 * useExams Hook
 * Get student's exam schedule with filters
 */

import { useQuery } from '@tanstack/react-query';
import { studentExamService } from '../api/exams.service';
import type { ExamFilters, ExamsResponse } from '../types/exam.types';

export const examQueryKeys = {
  all: ['student-exams'] as const,
  lists: () => [...examQueryKeys.all, 'list'] as const,
  list: (filters?: ExamFilters) => [...examQueryKeys.lists(), filters] as const,
  details: () => [...examQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...examQueryKeys.details(), id] as const,
  upcoming: (limit?: number) => [...examQueryKeys.all, 'upcoming', limit] as const,
  results: (filters?: { subject?: string; page?: number; limit?: number }) =>
    [...examQueryKeys.all, 'results', filters] as const,
  calendar: () => [...examQueryKeys.all, 'calendar'] as const,
  calendarWithParams: (year: number, month: number) =>
    [...examQueryKeys.calendar(), year, month] as const,
};

export const useExams = (filters?: ExamFilters) => {
  return useQuery<ExamsResponse>({
    queryKey: examQueryKeys.list(filters),
    queryFn: () => studentExamService.getExams(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};


