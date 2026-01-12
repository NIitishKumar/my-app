/**
 * useSubjects Hook - GET list
 */

import { useQuery } from '@tanstack/react-query';
import { subjectsApi } from '../api/subjects.api';
import { subjectsQueryKeys } from '../constants/subjects.constants';

export const useSubjects = () => {
  return useQuery({
    queryKey: subjectsQueryKeys.lists(),
    queryFn: () => subjectsApi.getAll(),
  });
};

