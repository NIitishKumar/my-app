/**
 * Auth Service
 * Handles authentication API calls
 */

import { httpClient } from '../../../services/http/httpClient';
import { API_ENDPOINTS } from '../../../services/endpoints';
import { AuthMapper } from './auth.mapper';
import type { LoginCredentials, AuthSession } from '../models/auth.model';
import type { AuthResponseDTO } from './auth.dto';
import { USER_ROLES } from '../../../shared/constants';

// 🔧 DEV MODE: Mock authentication for testing
const USE_MOCK_AUTH = true;

/**
 * Mock login - returns different users based on email
 */
const mockLogin = async (credentials: LoginCredentials): Promise<AuthSession> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  let role: string = USER_ROLES.ADMIN;
  let name = 'Admin User';

  // Determine role based on email
  const email = credentials.email.toLowerCase();
  if (email.includes('teacher')) {
    role = USER_ROLES.TEACHER;
    name = 'John Teacher';
  } else if (email.includes('student')) {
    role = USER_ROLES.STUDENT;
    name = 'Jane Student';
  } else if (email.includes('parent')) {
    role = USER_ROLES.PARENT;
    name = 'Bob Parent';
  } else if (email.includes('admin')) {
    role = USER_ROLES.ADMIN;
    name = 'Alice Admin';
  }

  const mockResponse: AuthResponseDTO = {
    token: `mock-${role.toLowerCase()}-token-${Date.now()}`,
    user: {
      id: Math.random().toString(36).substr(2, 9),
      email: credentials.email,
      name: name,
      role: role,
    },
  };

  return AuthMapper.authResponseToDomain(mockResponse);
};

export const authService = {
  /**
   * Login user
   */
  login: async (credentials: LoginCredentials): Promise<AuthSession> => {
    // Use mock authentication in development
    if (USE_MOCK_AUTH) {
      return mockLogin(credentials);
    }

    // Real API call (for production)
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


