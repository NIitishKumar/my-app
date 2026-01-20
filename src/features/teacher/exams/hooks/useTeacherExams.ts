/**
 * useTeacherExams Hook
 */

import { useQuery } from '@tanstack/react-query';
import { teacherExamService } from '../api/exams.service';
import type { ExamsResponse } from '../../../student/exams/types/exam.types';

export const teacherExamQueryKeys = {
  all: ['teacher-exams'] as const,
  lists: () => [...teacherExamQueryKeys.all, 'list'] as const,
  list: (filters?: any) => [...teacherExamQueryKeys.lists(), filters] as const,
  details: () => [...teacherExamQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...teacherExamQueryKeys.details(), id] as const,
  enrollment: (examId: string) => [...teacherExamQueryKeys.all, 'enrollment', examId] as const,
  upcoming: (filters?: any) => [...teacherExamQueryKeys.all, 'upcoming', filters] as const,
  calendar: (year: number, month: number, classId?: string) =>
    [...teacherExamQueryKeys.all, 'calendar', year, month, classId] as const,
};

export const useTeacherExams = (filters?: {
  classId?: string;
  subject?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery<ExamsResponse>({
    queryKey: teacherExamQueryKeys.list(filters),
    queryFn: () => teacherExamService.getExams(filters),
    staleTime: 5 * 60 * 1000,
  });
};


