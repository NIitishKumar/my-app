/**
 * useExam Hook
 */

import { useQuery } from '@tanstack/react-query';
import { adminExamService } from '../api/exams.service';
import { adminExamQueryKeys } from './useExams';
import type { ExamDetails } from '../../../student/exams/types/exam.types';

export const useExam = (id: string) => {
  return useQuery<ExamDetails>({
    queryKey: adminExamQueryKeys.detail(id),
    queryFn: () => adminExamService.getExam(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
};

