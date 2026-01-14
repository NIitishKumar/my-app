/**
 * useProfile Hook
 * React Query hook for fetching user profile
 */

import { useQuery } from '@tanstack/react-query';
import { profileApi } from '../api/profile.api';

export const profileQueryKeys = {
  all: ['profile'] as const,
  detail: () => [...profileQueryKeys.all, 'detail'] as const,
};

export const useProfile = () => {
  return useQuery({
    queryKey: profileQueryKeys.detail(),
    queryFn: () => profileApi.getProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

