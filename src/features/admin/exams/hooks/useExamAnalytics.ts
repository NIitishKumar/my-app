/**
 * useExamAnalytics Hook
 */

import { useQuery } from '@tanstack/react-query';
import { adminExamService } from '../api/exams.service';
import { adminExamQueryKeys } from './useExams';
import type { ExamAnalytics } from '../types/exam.types';

export const useExamAnalytics = (filters?: {
  startDate?: string;
  endDate?: string;
  classId?: string;
  subject?: string;
}) => {
  return useQuery<ExamAnalytics>({
    queryKey: adminExamQueryKeys.analytics(filters),
    queryFn: () => adminExamService.getAnalytics(filters),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

