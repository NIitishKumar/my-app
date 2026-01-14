/**
 * Profile Feature Exports
 * Shared profile API and hooks
 */

export { profileApi } from './api/profile.api';
export { useProfile, profileQueryKeys } from './hooks/useProfile';
export { useUpdateProfile } from './hooks/useUpdateProfile';
export { useUploadAvatar } from './hooks/useUploadAvatar';
export { useChangePassword } from './hooks/useChangePassword';

export type {
  ProfileApiDTO,
  ProfileApiResponse,
  UpdateProfileData,
  ChangePasswordData,
  ChangePasswordResponse,
  UploadAvatarResponse,
} from './api/profile.api';

