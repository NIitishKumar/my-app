/**
 * useDeleteSubject Hook - DELETE
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { subjectsApi } from '../api/subjects.api';
import { subjectsQueryKeys } from '../constants/subjects.constants';

export const useDeleteSubject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => subjectsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subjectsQueryKeys.all });
    },
  });
};

