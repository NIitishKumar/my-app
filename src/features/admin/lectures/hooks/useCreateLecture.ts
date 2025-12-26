import { useMutation, useQueryClient } from '@tanstack/react-query';
import { lecturesApi } from '../api/lectures.api';
import { lecturesQueryKeys } from '../constants/lectures.constants';
import type { CreateLectureData } from '../types/lectures.types';

export const useCreateLecture = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLectureData) => lecturesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lecturesQueryKeys.all });
    },
  });
};

