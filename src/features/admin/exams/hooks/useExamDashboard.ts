/**
 * useExamDashboard Hook
 */

import { useQuery } from '@tanstack/react-query';
import { adminExamService } from '../api/exams.service';
import { adminExamQueryKeys } from './useExams';
import type { ExamDashboard } from '../types/exam.types';

export const useExamDashboard = (filters?: {
  startDate?: string;
  endDate?: string;
}) => {
  return useQuery<ExamDashboard>({
    queryKey: adminExamQueryKeys.dashboard(filters),
    queryFn: () => adminExamService.getDashboard(filters),
    staleTime: 5 * 60 * 1000,
  });
};

