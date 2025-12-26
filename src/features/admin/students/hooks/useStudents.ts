/**
 * useStudents Hook - GET list
 */

import { useQuery } from '@tanstack/react-query';
import { studentsApi } from '../api/students.api';
import { studentsQueryKeys } from '../constants/students.constants';

export const useStudents = () => {
  return useQuery({
    queryKey: studentsQueryKeys.lists(),
    queryFn: () => studentsApi.getAll(),
  });
};

