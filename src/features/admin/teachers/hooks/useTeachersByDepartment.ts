import { useQuery } from '@tanstack/react-query';
import { teachersApi } from '../api/teachers.api';
import { teachersQueryKeys } from '../constants/teachers.constants';

export const useTeachersByDepartment = (department: string) => {
  return useQuery({
    queryKey: [...teachersQueryKeys.all, 'department', department],
    queryFn: () => teachersApi.getByDepartment(department),
    enabled: !!department,
  });
};

