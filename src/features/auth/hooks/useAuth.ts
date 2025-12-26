/**
 * Auth React Query Hooks
 * Custom hooks for authentication operations
 * Uses Zustand for client state, React Query for API calls
 */

import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '../api/auth.service';
import { queryKeys } from '../../../shared/hooks/useApi';
import { ROUTES, USER_ROLES } from '../../../shared/constants';
import { useAuthStore } from '../../../store';
import type { LoginCredentials } from '../models/auth.model';
import type { User } from '../../../store/types';

/**
 * Hook for user login
 * Uses React Query for API call, Zustand for state
 */
export const useLogin = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (session) => {
      // Store session in Zustand
      login(session.user as User, session.token);

      // Redirect based on role
      switch (session.user.role) {
        case USER_ROLES.ADMIN:
          navigate(ROUTES.ADMIN_DASHBOARD);
          break;
        case USER_ROLES.TEACHER:
          navigate(ROUTES.TEACHER_DASHBOARD);
          break;
        case USER_ROLES.STUDENT:
          navigate(ROUTES.STUDENT_DASHBOARD);
          break;
        case USER_ROLES.PARENT:
          navigate(ROUTES.PARENT_DASHBOARD);
          break;
        default:
          navigate(ROUTES.LOGIN);
      }
    },
    onError: (error) => {
      console.error('Login error:', error);
    },
  });
};

/**
 * Hook for user logout
 * Clears both Zustand state and makes API call
 */
export const useLogout = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      logout();
      navigate(ROUTES.LOGIN);
    },
    onError: (error) => {
      console.error('Logout error:', error);
      // Clear session even on error
      logout();
      navigate(ROUTES.LOGIN);
    },
  });
};

/**
 * Hook to get current session from Zustand
 * For backward compatibility with components using useSession
 */
export const useSession = () => {
  return useQuery({
    queryKey: queryKeys.auth.session,
    queryFn: () => authService.getSession(),
    staleTime: Infinity,
  });
};


