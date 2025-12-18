import { Navigate } from 'react-router-dom';
import { ROUTES, USER_ROLES } from '../constants';
import type { UserRole } from '../constants';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const userStr = localStorage.getItem('user');
  const token = localStorage.getItem('token');

  if (!token || !userStr) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  try {
    const user = JSON.parse(userStr);
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
  } catch {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
};

