import { useQuery } from '@tanstack/react-query';
import { lecturesApi } from '../api/lectures.api';
import { lecturesQueryKeys } from '../constants/lectures.constants';

export const useLectures = () => {
  return useQuery({
    queryKey: lecturesQueryKeys.lists(),
    queryFn: () => lecturesApi.getAll(),
  });
};

