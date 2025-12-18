import { useNavigate } from 'react-router-dom';
import { authService } from '../../features/auth/services';
import { ROUTES } from '../constants';

interface HeaderProps {
  title: string;
  userName?: string;
}

export const Header = ({ title, userName }: HeaderProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate(ROUTES.LOGIN);
    } catch (error) {
      console.error('Logout error:', error);
      navigate(ROUTES.LOGIN);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        <div className="flex items-center gap-4">
          {userName && (
            <span className="text-sm text-gray-600">Welcome, {userName}</span>
          )}
          <button
            onClick={handleLogout}
            className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1 rounded-md hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

