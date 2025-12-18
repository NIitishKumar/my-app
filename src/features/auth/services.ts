import { apiClient } from '../../services/api';
import { API_ENDPOINTS } from '../../services/endpoints';
import type { LoginCredentials, AuthResponse } from './types';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.LOGIN,
      credentials
    );
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.LOGOUT);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

