import { useMutation, useQueryClient } from '@tanstack/react-query';
import { lecturesApi } from '../api/lectures.api';
import { lecturesQueryKeys } from '../constants/lectures.constants';

export const useDeleteLecture = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => lecturesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lecturesQueryKeys.all });
    },
  });
};

