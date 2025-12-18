import { useQuery } from '@tanstack/react-query';
import { teachersApi } from '../api/teachers.api';
import { teachersQueryKeys } from '../constants/teachers.constants';

export const useTeachers = () => {
  return useQuery({
    queryKey: teachersQueryKeys.lists(),
    queryFn: () => teachersApi.getAll(),
  });
};


