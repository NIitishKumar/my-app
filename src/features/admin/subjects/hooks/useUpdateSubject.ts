/**
 * useUpdateSubject Hook - PUT
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { subjectsApi } from '../api/subjects.api';
import { subjectsQueryKeys } from '../constants/subjects.constants';
import type { UpdateSubjectData } from '../types/subjects.types';

export const useUpdateSubject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateSubjectData) => subjectsApi.update(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: subjectsQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: subjectsQueryKeys.detail(variables.id) });
    },
  });
};

