/**
 * useStudentDetails Hook - GET by id
 */

import { useQuery } from '@tanstack/react-query';
import { studentsApi } from '../api/students.api';
import { studentsQueryKeys } from '../constants/students.constants';

export const useStudentDetails = (id: string) => {
  return useQuery({
    queryKey: studentsQueryKeys.detail(id),
    queryFn: () => studentsApi.getById(id),
    enabled: !!id,
  });
};

