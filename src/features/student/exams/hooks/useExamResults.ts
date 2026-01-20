/**
 * useExamResults Hook
 * Get exam results for completed exams
 */

import { useQuery } from '@tanstack/react-query';
import { studentExamService } from '../api/exams.service';
import { examQueryKeys } from './useExams';
import type { ExamResultsResponse } from '../types/exam.types';

export const useExamResults = (filters?: {
  subject?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery<ExamResultsResponse>({
    queryKey: examQueryKeys.results(filters),
    queryFn: () => studentExamService.getExamResults(filters),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};


