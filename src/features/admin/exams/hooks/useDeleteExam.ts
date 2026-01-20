/**
 * useDeleteExam Hook
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminExamService } from '../api/exams.service';
import { adminExamQueryKeys } from './useExams';
import { toast } from 'react-hot-toast';

export const useDeleteExam = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id) => adminExamService.deleteExam(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminExamQueryKeys.all });
      toast.success('Exam deleted successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete exam');
    },
  });
};

