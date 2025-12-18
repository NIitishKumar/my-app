import { useMutation, useQueryClient } from '@tanstack/react-query';
import { teachersApi } from '../api/teachers.api';
import { teachersQueryKeys } from '../constants/teachers.constants';
import type { CreateTeacherData } from '../types/teachers.types';

export const useCreateTeacher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTeacherData) => teachersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teachersQueryKeys.all });
    },
  });
};


