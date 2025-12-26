import { Navigate } from 'react-router-dom';
import { ROUTES, USER_ROLES } from '../constants';
import type { UserRole } from '../constants';
import { useAuthStore, selectUser, selectToken, selectIsHydrated } from '../../store';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  // Use Zustand store for auth state
  const user = useAuthStore(selectUser);
  const token = useAuthStore(selectToken);
  const isHydrated = useAuthStore(selectIsHydrated);

  // Wait for hydration to complete before making auth decisions
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!token || !user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // Check if user has required role
  if (!allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    switch (user.role) {
      case USER_ROLES.ADMIN:
        return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />;
      case USER_ROLES.TEACHER:
        return <Navigate to={ROUTES.TEACHER_DASHBOARD} replace />;
      case USER_ROLES.STUDENT:
        return <Navigate to={ROUTES.STUDENT_DASHBOARD} replace />;
      case USER_ROLES.PARENT:
        return <Navigate to={ROUTES.PARENT_DASHBOARD} replace />;
      default:
        return <Navigate to={ROUTES.LOGIN} replace />;
    }
  }

  return <>{children}</>;
};

