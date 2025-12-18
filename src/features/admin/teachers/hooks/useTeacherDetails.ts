import { useQuery } from '@tanstack/react-query';
import { teachersApi } from '../api/teachers.api';
import { teachersQueryKeys } from '../constants/teachers.constants';

export const useTeacherDetails = (id: string) => {
  return useQuery({
    queryKey: teachersQueryKeys.detail(id),
    queryFn: () => teachersApi.getById(id),
    enabled: !!id,
  });
};


