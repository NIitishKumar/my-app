/**
 * useNoticeDetails Hook - GET by id
 */

import { useQuery } from '@tanstack/react-query';
import { noticesApi } from '../api/notices.api';
import { noticesQueryKeys } from '../constants/notices.constants';

export const useNoticeDetails = (id: string) => {
  return useQuery({
    queryKey: noticesQueryKeys.detail(id),
    queryFn: () => noticesApi.getById(id),
    enabled: !!id,
  });
};
