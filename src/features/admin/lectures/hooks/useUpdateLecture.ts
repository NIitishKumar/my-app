import { useMutation, useQueryClient } from '@tanstack/react-query';
import { lecturesApi } from '../api/lectures.api';
import { lecturesQueryKeys } from '../constants/lectures.constants';
import type { UpdateLectureData } from '../types/lectures.types';

export const useUpdateLecture = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateLectureData) => lecturesApi.update(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: lecturesQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: lecturesQueryKeys.detail(variables.id) });
    },
  });
};

