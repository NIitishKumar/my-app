/**
 * Auth Service
 * Handles authentication API calls
 */

import { httpClient } from '../../../services/http/httpClient';
import { API_ENDPOINTS } from '../../../services/endpoints';
import { AuthMapper } from './auth.mapper';
import type { LoginCredentials, AuthSession } from '../models/auth.model';
import type { AuthResponseDTO } from './auth.dto';

export const authService = {
  /**
   * Login user
   */
  login: async (credentials: LoginCredentials): Promise<AuthSession> => {
    const dto = AuthMapper.loginToDTO(credentials);
    const response = await httpClient.post<AuthResponseDTO>(
      API_ENDPOINTS.LOGIN,
      dto
    );
    return AuthMapper.authResponseToDomain(response);
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    await httpClient.post(API_ENDPOINTS.LOGOUT);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * Get current session from storage
   */
  getSession: (): AuthSession | null => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
      return null;
    }

    try {
      const user = JSON.parse(userStr);
      return { token, user };
    } catch {
      return null;
    }
  },

  /**
   * Save session to storage
   */
  saveSession: (session: AuthSession): void => {
    localStorage.setItem('token', session.token);
    localStorage.setItem('user', JSON.stringify(session.user));
  },

  /**
   * Clear session from storage
   */
  clearSession: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};


