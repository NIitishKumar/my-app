/**
 * useClassExams Hook
 */

import { useQuery } from '@tanstack/react-query';
import { teacherExamService } from '../api/exams.service';
import { teacherExamQueryKeys } from './useTeacherExams';
import type { ExamsResponse } from '../../../student/exams/types/exam.types';

export const useClassExams = (classId: string, filters?: {
  status?: string;
  startDate?: string;
  endDate?: string;
}) => {
  return useQuery<ExamsResponse>({
    queryKey: teacherExamQueryKeys.list({ classId, ...filters }),
    queryFn: () => teacherExamService.getExams({ classId, ...filters }),
    staleTime: 5 * 60 * 1000,
    enabled: !!classId,
  });
};


