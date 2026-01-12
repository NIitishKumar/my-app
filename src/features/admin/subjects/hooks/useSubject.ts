/**
 * useSubject Hook - GET by id
 */

import { useQuery } from '@tanstack/react-query';
import { subjectsApi } from '../api/subjects.api';
import { subjectsQueryKeys } from '../constants/subjects.constants';

export const useSubject = (id: string) => {
  return useQuery({
    queryKey: subjectsQueryKeys.detail(id),
    queryFn: () => subjectsApi.getById(id),
    enabled: !!id,
  });
};

