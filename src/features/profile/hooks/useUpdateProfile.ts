/**
 * useUpdateProfile Hook
 * React Query hook for updating user profile
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '../api/profile.api';
import { profileQueryKeys } from './useProfile';
import type { UpdateProfileData } from '../api/profile.api';
import toast from 'react-hot-toast';

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileData) => profileApi.updateProfile(data),
    onSuccess: (data) => {
      // Invalidate and refetch profile
      queryClient.setQueryData(profileQueryKeys.detail(), data);
      queryClient.invalidateQueries({ queryKey: profileQueryKeys.all });
      
      toast.success('Profile updated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update profile');
    },
  });
};

