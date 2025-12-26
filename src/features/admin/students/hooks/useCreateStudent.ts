/**
 * useCreateStudent Hook - POST
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { studentsApi } from '../api/students.api';
import { studentsQueryKeys } from '../constants/students.constants';
import type { CreateStudentData } from '../types/students.types';

export const useCreateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStudentData) => studentsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentsQueryKeys.all });
    },
  });
};

