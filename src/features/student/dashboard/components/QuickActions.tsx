/**
 * Quick Actions Component
 * Quick action buttons for student dashboard
 */

import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../../shared/constants';

const quickActions = [
  {
    label: 'View Attendance',
    icon: 'fa-clipboard-check',
    route: '#attendance',
    color: 'bg-indigo-100 text-indigo-600 border-indigo-200 hover:bg-indigo-200',
  },
  {
    label: 'View Exams',
    icon: 'fa-file-alt',
    route: ROUTES.STUDENT_EXAMS,
    color: 'bg-blue-100 text-blue-600 border-blue-200 hover:bg-blue-200',
  },
  {
    label: 'View Records',
    icon: 'fa-chart-line',
    route: ROUTES.STUDENT_RECORDS,
    color: 'bg-green-100 text-green-600 border-green-200 hover:bg-green-200',
  },
  {
    label: 'View Subjects',
    icon: 'fa-book-open',
    route: ROUTES.STUDENT_SUBJECTS,
    color: 'bg-purple-100 text-purple-600 border-purple-200 hover:bg-purple-200',
  },
  {
    label: 'Notifications',
    icon: 'fa-bell',
    route: ROUTES.STUDENT_NOTIFICATIONS,
    color: 'bg-yellow-100 text-yellow-600 border-yellow-200 hover:bg-yellow-200',
  },
  {
    label: 'Help & Support',
    icon: 'fa-question-circle',
    route: ROUTES.STUDENT_HELP_SUPPORT,
    color: 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200',
  },
];

export const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
      <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center space-x-2">
        <i className="fas fa-bolt text-indigo-600 flex-shrink-0"></i>
        <span className="truncate">Quick Actions</span>
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {quickActions.map((action) => (
          <button
            key={action.label}
            onClick={() => navigate(action.route)}
            className={`p-3 sm:p-4 border-2 rounded-lg font-medium text-xs sm:text-sm transition-all hover:shadow-md ${action.color}`}
          >
            <div className="flex flex-col items-center gap-2">
              <i className={`fas ${action.icon} text-lg sm:text-xl`}></i>
              <span className="text-center">{action.label}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

