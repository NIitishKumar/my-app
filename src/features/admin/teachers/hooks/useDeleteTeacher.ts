import { useMutation, useQueryClient } from '@tanstack/react-query';
import { teachersApi } from '../api/teachers.api';
import { teachersQueryKeys } from '../constants/teachers.constants';

export const useDeleteTeacher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => teachersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teachersQueryKeys.all });
    },
  });
};


