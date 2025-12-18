/**
 * Auth React Query Hooks
 * Custom hooks for authentication operations
 */

import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '../api/auth.service';
import { queryKeys } from '../../../shared/hooks/useApi';
import { ROUTES, USER_ROLES } from '../../../shared/constants';
import type { LoginCredentials } from '../models/auth.model';

/**
 * Hook for user login
 */
export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (session) => {
      // Save session to storage
      authService.saveSession(session);

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
 */
export const useLogout = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      authService.clearSession();
      navigate(ROUTES.LOGIN);
    },
    onError: (error) => {
      console.error('Logout error:', error);
      // Clear session even on error
      authService.clearSession();
      navigate(ROUTES.LOGIN);
    },
  });
};

/**
 * Hook to get current session
 */
export const useSession = () => {
  return useQuery({
    queryKey: queryKeys.auth.session,
    queryFn: () => authService.getSession(),
    staleTime: Infinity,
  });
};


