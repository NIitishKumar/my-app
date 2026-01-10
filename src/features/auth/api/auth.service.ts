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
   * 
   * API Response Format:
   * {
   *   "success": true,
   *   "token": "eyJhbGci...",
   *   "user": {
   *     "id": "...",
   *     "email": "...",
   *     "firstName": "...",
   *     "lastName": "...",
   *     "name": "...",
   *     "role": "TEACHER",
   *     "employeeId": "...",
   *     "department": "..."
   *   }
   * }
   * 
   * The response is automatically mapped to AuthSession and stored in localStorage
   * via the useLogin hook which calls Zustand's login action.
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
   * Checks both legacy localStorage keys and Zustand persisted storage
   */
  getSession: (): AuthSession | null => {
    // First try legacy localStorage keys
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        return { token, user };
      } catch {
        // If parsing fails, try Zustand storage
      }
    }

    // Fallback: Try Zustand persisted storage
    try {
      const zustandStorage = localStorage.getItem('auth-storage');
      if (zustandStorage) {
        const parsed = JSON.parse(zustandStorage);
        const state = parsed.state;
        if (state?.token && state?.user) {
          return {
            token: state.token,
            user: state.user,
          };
        }
      }
    } catch {
      // If both fail, return null
    }

    return null;
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


