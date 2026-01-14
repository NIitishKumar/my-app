import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES, USER_ROLES } from '../constants';
import { useAuthStore, selectUser } from '../../store';

interface HeaderProps {
  title: string;
  userName?: string;
  onMenuClick?: () => void;
}

export const Header = ({ title, userName, onMenuClick }: HeaderProps) => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore(selectUser);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  const handleProfileClick = () => {
    setShowProfile(false);
    if (user?.role === USER_ROLES.ADMIN) {
      navigate(ROUTES.ADMIN_PROFILE);
    } else if (user?.role === USER_ROLES.TEACHER) {
      navigate(ROUTES.TEACHER_PROFILE);
    } else if (user?.role === USER_ROLES.STUDENT) {
      navigate(ROUTES.STUDENT_PROFILE);
    } else if (user?.role === USER_ROLES.PARENT) {
      navigate(ROUTES.PARENT_PROFILE);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 lg:px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Hamburger Menu Button for Mobile */}
          <button
            onClick={onMenuClick}
            className="lg:hidden text-gray-600 hover:text-gray-900 p-2"
          >
            <i className="fas fa-bars text-xl"></i>
          </button>
          <div>
            <h2 className="text-lg lg:text-xl font-bold text-gray-900">{title}</h2>
            <p className="text-xs lg:text-sm text-gray-500">Welcome back, {userName || 'User'}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 lg:space-x-4">
          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              <i className="fas fa-bell text-lg lg:text-xl"></i>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                    <p className="text-sm font-medium text-gray-900">New student enrolled</p>
                    <p className="text-xs text-gray-600 mt-1">Emma Wilson joined Grade 10-A</p>
                    <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                  </div>
                  <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                    <p className="text-sm font-medium text-gray-900">Exam scheduled</p>
                    <p className="text-xs text-gray-600 mt-1">Mid-term exams for Grade 11</p>
                    <p className="text-xs text-gray-500 mt-1">5 hours ago</p>
                  </div>
                  <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                    <p className="text-sm font-medium text-gray-900">Low attendance alert</p>
                    <p className="text-xs text-gray-600 mt-1">Grade 12-C attendance below 85%</p>
                    <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                  </div>
                </div>
                <div className="px-4 py-2 border-t border-gray-200">
                  <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg"
            >
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
                alt="User"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-200"
              />
              <i className="fas fa-chevron-down text-gray-600 text-sm hidden lg:block"></i>
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <button
                  onClick={handleProfileClick}
                  className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <i className="fas fa-user w-5 mr-2"></i>Profile
                </button>
                <hr className="my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <i className="fas fa-sign-out-alt w-5 mr-2"></i>Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

