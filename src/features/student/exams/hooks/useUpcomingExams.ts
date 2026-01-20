/**
 * useUpcomingExams Hook
 * Get upcoming exams (next 30 days)
 */

import { useQuery } from '@tanstack/react-query';
import { studentExamService } from '../api/exams.service';
import { examQueryKeys } from './useExams';
import type { ExamsResponse } from '../types/exam.types';

export const useUpcomingExams = (limit?: number) => {
  return useQuery<ExamsResponse>({
    queryKey: examQueryKeys.upcoming(limit),
    queryFn: () => studentExamService.getUpcomingExams(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};


