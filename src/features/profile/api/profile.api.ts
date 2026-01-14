/**
 * Profile API Service
 * Shared API service for user profile operations (used by all roles)
 */

import { httpClient } from '../../../services/http/httpClient';
import { apiClient } from '../../../services/api';
import { API_ENDPOINTS } from '../../../services/endpoints';
import type { User } from '../../../store/types';

// Profile API DTOs
export interface ProfileApiDTO {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name: string;
  role: string;
  employeeId?: string;
  studentId?: string;
  phoneNumber?: string;
  department?: string;
  qualification?: string;
  specialization?: string;
  subjects?: string[];
  experience?: number;
  gender?: string;
  dateOfBirth?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  profilePicture?: string;
  createdAt?: string;
  updatedAt?: string;
  lastLogin?: string;
}

export interface ProfileApiResponse {
  success: boolean;
  data: ProfileApiDTO;
  message?: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  department?: string;
  qualification?: string;
  specialization?: string;
  subjects?: string[];
  experience?: number;
  gender?: string;
  dateOfBirth?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

export interface UploadAvatarResponse {
  success: boolean;
  data: {
    profilePicture: string;
  };
  message?: string;
}

// Mapper: API DTO to Domain (User type)
const mapProfileApiToDomain = (api: ProfileApiDTO): User => {
  return {
    id: api.id,
    email: api.email,
    firstName: api.firstName,
    lastName: api.lastName,
    name: api.name,
    role: api.role as User['role'],
    employeeId: api.employeeId,
    department: api.department,
    avatar: api.profilePicture, // Map profilePicture to avatar
    createdAt: api.createdAt ? new Date(api.createdAt) : undefined,
  };
};

// Profile API Service
export const profileApi = {
  /**
   * Get current user profile
   */
  getProfile: async (): Promise<User> => {
    try {
      const response = await httpClient.get<ProfileApiResponse | ProfileApiDTO>(
        API_ENDPOINTS.USER_PROFILE
      );

      // Handle both wrapped response and direct DTO
      const profileData = 'data' in response ? response.data : response;
      return mapProfileApiToDomain(profileData);
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: UpdateProfileData): Promise<User> => {
    try {
      const response = await httpClient.put<ProfileApiResponse>(
        API_ENDPOINTS.USER_PROFILE,
        data
      );

      if (!response || !response.data) {
        throw new Error('Invalid API response: missing data');
      }

      return mapProfileApiToDomain(response.data);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  /**
   * Upload profile picture
   */
  uploadAvatar: async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await apiClient.post<UploadAvatarResponse>(
        API_ENDPOINTS.USER_PROFILE_AVATAR,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (!response.data || !response.data.data || !response.data.data.profilePicture) {
        throw new Error('Invalid API response: missing profile picture URL');
      }

      return response.data.data.profilePicture;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  },

  /**
   * Change password
   */
  changePassword: async (data: ChangePasswordData): Promise<void> => {
    try {
      await httpClient.put<ChangePasswordResponse>(
        API_ENDPOINTS.USER_PASSWORD,
        {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }
      );
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  },
};

