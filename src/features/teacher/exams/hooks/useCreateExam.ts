/**
 * useCreateExam Hook for Teachers
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { teacherExamService } from '../api/exams.service';
import { teacherExamQueryKeys } from './useTeacherExams';
import { examQueryKeys } from '../../../student/exams/hooks/useExams';
import { toast } from 'react-hot-toast';
import type { CreateExamData } from '../../../admin/exams/types/exam.types';
import type { ExamDetails } from '../../../student/exams/types/exam.types';

export const useCreateExam = () => {
  const queryClient = useQueryClient();

  return useMutation<ExamDetails, Error, CreateExamData>({
    mutationFn: (data) => teacherExamService.createExam(data),
    onSuccess: () => {
      // Invalidate teacher exam queries
      queryClient.invalidateQueries({ queryKey: teacherExamQueryKeys.all });
      // Also invalidate student exam queries so new exams appear in student view
      queryClient.invalidateQueries({ queryKey: examQueryKeys.all });
      toast.success('Exam created successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create exam');
    },
  });
};


