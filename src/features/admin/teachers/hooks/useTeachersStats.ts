import { useQuery } from '@tanstack/react-query';
import { teachersApi } from '../api/teachers.api';
import { teachersQueryKeys } from '../constants/teachers.constants';

export const useTeachersStats = () => {
  return useQuery({
    queryKey: [...teachersQueryKeys.all, 'stats'],
    queryFn: () => teachersApi.getStats(),
  });
};

