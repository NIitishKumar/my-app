import { useQuery } from '@tanstack/react-query';
import { teachersApi } from '../api/teachers.api';
import { teachersQueryKeys } from '../constants/teachers.constants';
import type { TeachersQueryParams } from '../types/teachers.types';

export const useTeachers = (params?: TeachersQueryParams) => {
  return useQuery({
    queryKey: teachersQueryKeys.list(JSON.stringify(params)),
    queryFn: () => teachersApi.getAll(params),
  });
};


