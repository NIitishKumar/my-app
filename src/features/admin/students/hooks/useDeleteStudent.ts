/**
 * useDeleteStudent Hook - DELETE
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { studentsApi } from '../api/students.api';
import { studentsQueryKeys } from '../constants/students.constants';

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => studentsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentsQueryKeys.all });
    },
  });
};

