/**
 * useUpcomingExams Hook
 */

import { useQuery } from '@tanstack/react-query';
import { teacherExamService } from '../api/exams.service';
import { teacherExamQueryKeys } from './useTeacherExams';
import type { ExamsResponse } from '../../../student/exams/types/exam.types';

export const useUpcomingExams = (filters?: {
  classId?: string;
  limit?: number;
}) => {
  return useQuery<ExamsResponse>({
    queryKey: teacherExamQueryKeys.upcoming(filters),
    queryFn: () => teacherExamService.getUpcomingExams(filters),
    staleTime: 5 * 60 * 1000,
  });
};


