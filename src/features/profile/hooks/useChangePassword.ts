/**
 * useChangePassword Hook
 * React Query hook for changing user password
 */

import { useMutation } from '@tanstack/react-query';
import { profileApi } from '../api/profile.api';
import type { ChangePasswordData } from '../api/profile.api';
import toast from 'react-hot-toast';

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordData) => profileApi.changePassword(data),
    onSuccess: () => {
      toast.success('Password changed successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to change password');
    },
  });
};

