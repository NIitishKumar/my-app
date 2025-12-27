import { useQuery } from '@tanstack/react-query';
import { teachersApi } from '../api/teachers.api';
import { teachersQueryKeys } from '../constants/teachers.constants';

export const useTeacherWithClasses = (id: string) => {
  return useQuery({
    queryKey: [...teachersQueryKeys.detail(id), 'classes'],
    queryFn: () => teachersApi.getWithClasses(id),
    enabled: !!id,
  });
};

