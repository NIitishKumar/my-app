/**
 * Dashboard Stats Component
 * Statistics cards for student dashboard
 */

import { useDashboardStats } from '../hooks/useDashboard';
import { DashboardStatsSkeleton } from '../../../../shared/components/skeletons';

export const DashboardStats = () => {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return <DashboardStatsSkeleton />;
  }

  if (!stats) {
    return null;
  }

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 90) return { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200', icon: 'text-green-600' };
    if (percentage >= 75) return { bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-200', icon: 'text-yellow-600' };
    return { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', icon: 'text-red-600' };
  };

  const attendanceColors = getAttendanceColor(stats.attendancePercentage);

  const statCards = [
    {
      label: 'Attendance',
      value: `${stats.attendancePercentage.toFixed(1)}%`,
      icon: 'fa-clipboard-check',
      bgColor: attendanceColors.bg,
      textColor: attendanceColors.text,
      borderColor: attendanceColors.border,
      iconColor: attendanceColors.icon,
      trend: stats.attendanceTrend,
    },
    {
      label: 'Upcoming Exams',
      value: stats.upcomingExamsCount,
      icon: 'fa-file-alt',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Unread Notifications',
      value: stats.unreadNotificationsCount,
      icon: 'fa-bell',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      borderColor: 'border-purple-200',
      iconColor: 'text-purple-600',
      badge: stats.unreadNotificationsCount > 0,
    },
    {
      label: 'Overall GPA',
      value: stats.overallGPA.toFixed(1),
      icon: 'fa-star',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      borderColor: 'border-indigo-200',
      iconColor: 'text-indigo-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {statCards.map((card) => (
        <div
          key={card.label}
          className={`bg-white rounded-xl shadow-sm border ${card.borderColor} p-4 sm:p-6 relative`}
        >
          {card.badge && card.value > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          )}
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{card.label}</p>
              <div className="flex items-baseline gap-2 mt-1 sm:mt-2">
                <p className={`text-2xl sm:text-3xl font-bold ${card.textColor} break-words`}>
                  {card.value}
                </p>
                {card.trend && (
                  <i
                    className={`fas ${
                      card.trend === 'up' ? 'fa-arrow-up' : card.trend === 'down' ? 'fa-arrow-down' : 'fa-minus'
                    } text-xs ${card.trend === 'up' ? 'text-green-500' : card.trend === 'down' ? 'text-red-500' : 'text-gray-400'}`}
                  ></i>
                )}
              </div>
            </div>
            <div className={`${card.bgColor} p-2 sm:p-3 rounded-lg flex-shrink-0 ml-2`}>
              <i className={`fas ${card.icon} ${card.iconColor} text-xl sm:text-2xl`}></i>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

