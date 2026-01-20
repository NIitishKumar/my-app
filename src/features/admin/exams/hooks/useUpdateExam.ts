/**
 * useUpdateExam Hook
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminExamService } from '../api/exams.service';
import { adminExamQueryKeys } from './useExams';
import { toast } from 'react-hot-toast';
import type { CreateExamData, ExamDetails } from '../types/exam.types';

export const useUpdateExam = () => {
  const queryClient = useQueryClient();

  return useMutation<ExamDetails, Error, { id: string; data: Partial<CreateExamData> }>({
    mutationFn: ({ id, data }) => adminExamService.updateExam(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminExamQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: adminExamQueryKeys.detail(variables.id) });
      toast.success('Exam updated successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update exam');
    },
  });
};

