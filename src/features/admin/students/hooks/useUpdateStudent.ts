/**
 * useUpdateStudent Hook - PUT
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { studentsApi } from '../api/students.api';
import { studentsQueryKeys } from '../constants/students.constants';
import type { UpdateStudentData } from '../types/students.types';

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateStudentData) => studentsApi.update(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: studentsQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: studentsQueryKeys.detail(variables.id) });
    },
  });
};

