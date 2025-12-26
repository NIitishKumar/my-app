import { useQuery } from '@tanstack/react-query';
import { lecturesApi } from '../api/lectures.api';
import { lecturesQueryKeys } from '../constants/lectures.constants';

export const useLectureDetails = (id: string) => {
  return useQuery({
    queryKey: lecturesQueryKeys.detail(id),
    queryFn: () => lecturesApi.getById(id),
    enabled: !!id,
  });
};

