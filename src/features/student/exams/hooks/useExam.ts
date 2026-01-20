/**
 * useExam Hook
 * Get detailed information about a specific exam
 */

import { useQuery } from '@tanstack/react-query';
import { studentExamService } from '../api/exams.service';
import { examQueryKeys } from './useExams';
import type { ExamDetails } from '../types/exam.types';

export const useExam = (id: string) => {
  return useQuery<ExamDetails>({
    queryKey: examQueryKeys.detail(id),
    queryFn: () => studentExamService.getExam(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!id,
  });
};

