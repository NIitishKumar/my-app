/**
 * useCreateExam Hook
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminExamService } from '../api/exams.service';
import { adminExamQueryKeys } from './useExams';
import { toast } from 'react-hot-toast';
import type { CreateExamData, ExamDetails } from '../types/exam.types';

export const useCreateExam = () => {
  const queryClient = useQueryClient();

  return useMutation<ExamDetails, Error, CreateExamData>({
    mutationFn: (data) => adminExamService.createExam(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminExamQueryKeys.all });
      toast.success('Exam created successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create exam');
    },
  });
};

