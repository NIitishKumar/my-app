/**
 * useCreateSubject Hook - POST
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { subjectsApi } from '../api/subjects.api';
import { subjectsQueryKeys } from '../constants/subjects.constants';
import type { CreateSubjectData } from '../types/subjects.types';

export const useCreateSubject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSubjectData) => subjectsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subjectsQueryKeys.all });
    },
  });
};

