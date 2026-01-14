/**
 * useUploadAvatar Hook
 * React Query hook for uploading profile picture
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '../api/profile.api';
import { profileQueryKeys } from './useProfile';
import toast from 'react-hot-toast';

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => profileApi.uploadAvatar(file),
    onSuccess: (avatarUrl) => {
      // Update profile cache with new avatar URL
      queryClient.setQueryData(profileQueryKeys.detail(), (old: any) => {
        if (old) {
          return { ...old, avatar: avatarUrl };
        }
        return old;
      });
      queryClient.invalidateQueries({ queryKey: profileQueryKeys.all });
      
      toast.success('Profile picture updated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to upload profile picture');
    },
  });
};

