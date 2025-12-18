/**
 * useCreateClass Hook - POST
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { classesApi } from '../api/classes.api';
import { classesQueryKeys } from '../constants/classes.constants';
import type { CreateClassData } from '../types/classes.types';

export const useCreateClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateClassData) => classesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: classesQueryKeys.all });
    },
  });
};


