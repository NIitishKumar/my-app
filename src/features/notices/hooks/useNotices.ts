/**
 * useNotices Hook - GET list
 */

import { useQuery } from '@tanstack/react-query';
import { noticesApi } from '../api/notices.api';
import { noticesQueryKeys } from '../constants/notices.constants';

export interface NoticesFilters {
  audience?: string;
  status?: string;
  priority?: string;
}

export const useNotices = (filters?: NoticesFilters) => {
  return useQuery({
    queryKey: noticesQueryKeys.list(JSON.stringify(filters)),
    queryFn: () => noticesApi.getAll(filters),
  });
};
