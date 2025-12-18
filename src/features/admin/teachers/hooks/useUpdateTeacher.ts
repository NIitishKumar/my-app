import { useMutation, useQueryClient } from '@tanstack/react-query';
import { teachersApi } from '../api/teachers.api';
import { teachersQueryKeys } from '../constants/teachers.constants';
import type { UpdateTeacherData } from '../types/teachers.types';

export const useUpdateTeacher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTeacherData) => teachersApi.update(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: teachersQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: teachersQueryKeys.detail(variables.id) });
    },
  });
};


