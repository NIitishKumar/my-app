import { useNavigate } from 'react-router-dom';
import { useQuickStats, useDashboardStats } from './hooks/useDashboard';
import { ROUTES } from '../../../shared/constants';

/**
 * Format number with commas
 */
const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

/**
 * Format relative time (e.g., "2 hours ago", "1 day ago")
 */
const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
  if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
  
  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 4) return `${diffWeeks} ${diffWeeks === 1 ? 'week' : 'weeks'} ago`;
  
  const diffMonths = Math.floor(diffDays / 30);
  return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} ago`;
};

/**
 * Format date to "DD MMM" format
 */
const formatDateShort = (date: Date): { date: string; month: string } => {
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  return {
    date: date.getDate().toString(),
    month: months[date.getMonth()],
  };
};

/**
 * Format time range (e.g., "09:00 - 10:00")
 */
const formatTimeRange = (startTime: string, endTime: string): string => {
  return `${startTime} - ${endTime}`;
};

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { data: quickStats, isLoading: isLoadingQuick, error: quickError } = useQuickStats();
  const { data: dashboardStats, isLoading: isLoadingStats, error: statsError } = useDashboardStats();

  // Build stats cards from API data
  const stats = quickStats ? [
    {
      title: 'Total Students',
      value: formatNumber(quickStats.totalStudents),
      change: 'Active',
      changeText: `${quickStats.totalEnrolled} enrolled`,
      icon: 'fa-user-graduate',
      bgColor: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      changeColor: 'text-blue-600',
      changeBg: 'bg-blue-50',
    },
    {
      title: 'Total Teachers',
      value: formatNumber(quickStats.totalTeachers),
      change: 'Active',
      changeText: 'Teaching staff',
      icon: 'fa-chalkboard-teacher',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
      changeColor: 'text-blue-600',
      changeBg: 'bg-blue-50',
    },
    {
      title: 'Total Classes',
      value: formatNumber(quickStats.totalClasses),
      change: 'Active',
      changeText: 'Active classes',
      icon: 'fa-chalkboard',
      bgColor: 'bg-cyan-100',
      iconColor: 'text-cyan-600',
      changeColor: 'text-blue-600',
      changeBg: 'bg-blue-50',
    },
    {
      title: 'Total Lectures',
      value: formatNumber(quickStats.totalLectures),
      change: 'Scheduled',
      changeText: 'Upcoming lectures',
      icon: 'fa-book',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      changeColor: 'text-blue-600',
      changeBg: 'bg-blue-50',
    },
  ] : [];

  const quickActions = [
    { 
      title: 'Add Class', 
      icon: 'fa-chalkboard', 
      bgColor: 'bg-indigo-100', 
      hoverColor: 'hover:border-indigo-300 hover:bg-indigo-50', 
      iconColor: 'text-indigo-600', 
      groupHover: 'group-hover:bg-indigo-200',
      route: ROUTES.ADMIN_CLASSES,
      openForm: true,
    },
    { 
      title: 'Add Teacher', 
      icon: 'fa-user-plus', 
      bgColor: 'bg-purple-100', 
      hoverColor: 'hover:border-purple-300 hover:bg-purple-50', 
      iconColor: 'text-purple-600', 
      groupHover: 'group-hover:bg-purple-200',
      route: ROUTES.ADMIN_TEACHERS,
      openForm: true,
    },
    { 
      title: 'Create Notice', 
      icon: 'fa-bullhorn', 
      bgColor: 'bg-cyan-100', 
      hoverColor: 'hover:border-cyan-300 hover:bg-cyan-50', 
      iconColor: 'text-cyan-600', 
      groupHover: 'group-hover:bg-cyan-200',
      route: ROUTES.ADMIN_NOTICES,
    },
    { 
      title: 'Schedule Exam', 
      icon: 'fa-calendar-plus', 
      bgColor: 'bg-green-100', 
      hoverColor: 'hover:border-green-300 hover:bg-green-50', 
      iconColor: 'text-green-600', 
      groupHover: 'group-hover:bg-green-200',
      route: ROUTES.ADMIN_EXAMS,
    },
    { 
      title: 'Generate Report', 
      icon: 'fa-file-invoice', 
      bgColor: 'bg-orange-100', 
      hoverColor: 'hover:border-orange-300 hover:bg-orange-50', 
      iconColor: 'text-orange-600', 
      groupHover: 'group-hover:bg-orange-200',
      route: ROUTES.ADMIN_REPORTS,
    },
    { 
      title: 'Settings', 
      icon: 'fa-cog', 
      bgColor: 'bg-red-100', 
      hoverColor: 'hover:border-red-300 hover:bg-red-50', 
      iconColor: 'text-red-600', 
      groupHover: 'group-hover:bg-red-200',
      route: ROUTES.ADMIN_SETTINGS,
    },
  ];

  const handleQuickActionClick = (action: typeof quickActions[0]) => {
    if (action.openForm) {
      navigate(action.route, { state: { openForm: true } });
    } else {
      navigate(action.route);
    }
  };

  // Build recent activities from API data
  const recentActivities = dashboardStats ? [
    ...dashboardStats.students.recent.slice(0, 3).map((student) => ({
      title: 'New student enrolled',
      description: `${student.firstName} ${student.lastName} joined ${student.grade}`,
      time: formatRelativeTime(student.createdAt),
      icon: 'fa-user-plus',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
    })),
    ...dashboardStats.classes.recent.slice(0, 2).map((classItem) => ({
      title: 'New class created',
      description: `${classItem.className} - ${classItem.grade}`,
      time: formatRelativeTime(classItem.createdAt),
      icon: 'fa-chalkboard',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
    })),
  ].slice(0, 5) : [];

  // Build upcoming events from lectures data
  const upcomingEvents = dashboardStats?.lectures.upcoming
    .filter((lecture) => lecture.schedule && lecture.schedule.dayOfWeek) // Filter out lectures without schedule
    .slice(0, 4)
    .map((lecture, index) => {
      const gradients = [
        'from-indigo-500 to-indigo-600',
        'from-purple-500 to-purple-600',
        'from-green-500 to-green-600',
        'from-orange-500 to-orange-600',
      ];
      
      // Get next occurrence of the day of week
      const today = new Date();
      const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const targetDay = dayOfWeek.indexOf(lecture.schedule.dayOfWeek);
      const currentDay = today.getDay();
      let daysUntil = (targetDay - currentDay + 7) % 7;
      if (daysUntil === 0) daysUntil = 7; // Next week if today
      const eventDate = new Date(today);
      eventDate.setDate(today.getDate() + daysUntil);
      const dateInfo = formatDateShort(eventDate);
      
      return {
        date: dateInfo.date,
        month: dateInfo.month,
        title: lecture.title,
        time: formatTimeRange(lecture.schedule.startTime || '', lecture.schedule.endTime || ''),
        location: lecture.schedule.room || 'TBD',
        gradient: gradients[index % gradients.length],
      };
    }) || [];

  const isLoading = isLoadingQuick || isLoadingStats;
  const hasError = quickError || statsError;

  if (hasError) {
    return (
      <div className="p-4 lg:p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <i className="fas fa-exclamation-circle text-red-600 text-3xl mb-3"></i>
          <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-sm text-red-700">
            {quickError ? 'Failed to load quick statistics' : 'Failed to load dashboard data'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
        {isLoading ? (
          // Loading skeleton
          Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 animate-pulse"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-20 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-32"></div>
            </div>
          ))
        ) : (
          stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                  <i className={`fas ${stat.icon} ${stat.iconColor} text-xl`}></i>
                </div>
                <span className={`flex items-center text-xs font-medium ${stat.changeColor} ${stat.changeBg} px-2 py-1 rounded-full`}>
                  {stat.change.includes('+') && <i className="fas fa-arrow-up text-xs mr-1"></i>}
                  {stat.change}
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
              <p className="text-2xl lg:text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-2">{stat.changeText}</p>
            </div>
          ))
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Quick Actions</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleQuickActionClick(action)}
              className={`flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-xl ${action.hoverColor} transition-all group cursor-pointer`}
            >
              <div className={`w-12 h-12 ${action.bgColor} rounded-xl flex items-center justify-center mb-2 ${action.groupHover} transition-colors`}>
                <i className={`fas ${action.icon} ${action.iconColor} text-xl`}></i>
              </div>
              <span className="text-sm font-medium text-gray-700">{action.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-5 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
              <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                View All
              </button>
            </div>
          </div>
          <div className="p-5 space-y-4">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-start space-x-4 animate-pulse">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 min-w-0">
                    <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-48 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
              ))
            ) : recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className={`flex-shrink-0 w-10 h-10 ${activity.bgColor} rounded-full flex items-center justify-center`}>
                    <i className={`fas ${activity.icon} ${activity.iconColor}`}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
            )}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Upcoming Events</h3>
          <div className="space-y-4">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex space-x-3 animate-pulse">
                  <div className="w-14 h-14 bg-gray-200 rounded-xl"></div>
                  <div className="flex-1 min-w-0">
                    <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-24 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-28"></div>
                  </div>
                </div>
              ))
            ) : upcomingEvents.length > 0 ? (
              upcomingEvents.map((event, index) => (
                <div key={index} className="flex space-x-3">
                  <div className={`flex-shrink-0 w-14 h-14 bg-gradient-to-br ${event.gradient} rounded-xl flex flex-col items-center justify-center text-white shadow-lg`}>
                    <span className="text-xs font-medium">{event.month}</span>
                    <span className="text-xl font-bold">{event.date}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{event.title}</p>
                    <p className="text-xs text-gray-600 mt-1">{event.time}</p>
                    <p className="text-xs text-gray-500 mt-1">{event.location}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No upcoming events</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

