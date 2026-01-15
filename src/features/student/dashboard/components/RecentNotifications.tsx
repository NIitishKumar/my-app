/**
 * Recent Notifications Component
 * Recent notifications list for student dashboard
 */

import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecentNotifications } from '../hooks/useDashboard';
import { ROUTES } from '../../../../shared/constants';
import { DashboardStatsSkeleton } from '../../../../shared/components/skeletons';

const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const getNotificationIcon = (type: 'info' | 'warning' | 'success' | 'error') => {
  switch (type) {
    case 'info':
      return 'fa-info-circle text-blue-600';
    case 'warning':
      return 'fa-exclamation-triangle text-yellow-600';
    case 'success':
      return 'fa-check-circle text-green-600';
    case 'error':
      return 'fa-times-circle text-red-600';
  }
};

const getNotificationBg = (type: 'info' | 'warning' | 'success' | 'error') => {
  switch (type) {
    case 'info':
      return 'bg-blue-50 border-blue-200';
    case 'warning':
      return 'bg-yellow-50 border-yellow-200';
    case 'success':
      return 'bg-green-50 border-green-200';
    case 'error':
      return 'bg-red-50 border-red-200';
  }
};

export const RecentNotifications = () => {
  const navigate = useNavigate();
  const { data: notifications = [], isLoading } = useRecentNotifications();

  const sortedNotifications = useMemo(() => {
    return [...notifications].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }, [notifications]);

  const unreadCount = useMemo(() => {
    return sortedNotifications.filter((n) => !n.isRead).length;
  }, [sortedNotifications]);

  if (isLoading) {
    return <DashboardStatsSkeleton />;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <i className="fas fa-bell text-indigo-600 flex-shrink-0"></i>
            <span className="truncate">Recent Notifications</span>
          </h2>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-semibold rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        {sortedNotifications.length > 0 && (
          <button
            onClick={() => navigate(ROUTES.STUDENT_NOTIFICATIONS)}
            className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-700 font-medium whitespace-nowrap flex-shrink-0"
          >
            View All →
          </button>
        )}
      </div>

      {sortedNotifications.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <i className="fas fa-inbox text-4xl mb-3 text-gray-400"></i>
          <p>No notifications</p>
          <p className="text-xs text-gray-400 mt-1">You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedNotifications.slice(0, 5).map((notification) => (
            <div
              key={notification.id}
              className={`p-3 sm:p-4 rounded-lg border cursor-pointer hover:shadow-md transition-all ${getNotificationBg(notification.type)} ${
                !notification.isRead ? 'ring-2 ring-indigo-300' : ''
              }`}
              onClick={() => navigate(ROUTES.STUDENT_NOTIFICATIONS)}
            >
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 mt-0.5 ${getNotificationIcon(notification.type)}`}>
                  <i className={`fas ${getNotificationIcon(notification.type).split(' ')[0]}`}></i>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className={`font-semibold text-sm sm:text-base ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                      {notification.title}
                    </h3>
                    {!notification.isRead && (
                      <span className="w-2 h-2 bg-indigo-600 rounded-full flex-shrink-0 mt-1"></span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-2">{notification.message}</p>
                  <p className="text-xs text-gray-500">{formatRelativeTime(notification.createdAt)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

