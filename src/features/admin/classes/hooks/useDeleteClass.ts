/**
 * useDeleteClass Hook - DELETE
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { classesApi } from '../api/classes.api';
import { classesQueryKeys } from '../constants/classes.constants';

export const useDeleteClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => classesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: classesQueryKeys.all });
    },
  });
};


