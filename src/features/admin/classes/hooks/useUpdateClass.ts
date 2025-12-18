/**
 * useUpdateClass Hook - PUT
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { classesApi } from '../api/classes.api';
import { classesQueryKeys } from '../constants/classes.constants';
import type { UpdateClassData } from '../types/classes.types';

export const useUpdateClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateClassData) => classesApi.update(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: classesQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: classesQueryKeys.detail(variables.id) });
    },
  });
};

