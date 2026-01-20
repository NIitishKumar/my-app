/**
 * ExamsDashboard Component
 * Dashboard summary for admin exams
 */

import React from 'react';
import type { ExamDashboard } from '../types/exam.types';

interface ExamsDashboardProps {
  dashboardData?: ExamDashboard;
  isLoading?: boolean;
  className?: string;
}

export const ExamsDashboard: React.FC<ExamsDashboardProps> = ({
  dashboardData,
  isLoading = false,
  className = '',
}) => {
  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 ${className}`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!dashboardData) return null;

  const stats = [
    {
      label: 'Total Exams',
      value: dashboardData.overview.totalExams,
      icon: 'fa-calendar-alt',
      color: 'bg-indigo-500',
    },
    {
      label: 'Upcoming',
      value: dashboardData.overview.upcomingExams,
      icon: 'fa-clock',
      color: 'bg-blue-500',
    },
    {
      label: 'Completed',
      value: dashboardData.overview.completedExams,
      icon: 'fa-check-circle',
      color: 'bg-gray-500',
    },
    {
      label: 'Today',
      value: dashboardData.overview.todayExams,
      icon: 'fa-calendar-day',
      color: 'bg-yellow-500',
    },
    {
      label: 'This Week',
      value: dashboardData.overview.thisWeekExams,
      icon: 'fa-calendar-week',
      color: 'bg-green-500',
    },
  ];

  return (
    <div className={className}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.color} rounded-full p-3 text-white`}>
                <i className={`fas ${stat.icon} text-xl`}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      {dashboardData.conflicts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <i className="fas fa-exclamation-triangle text-red-600"></i>
            <h3 className="font-semibold text-red-900">Exam Conflicts Detected</h3>
          </div>
          <p className="text-sm text-red-700">
            {dashboardData.conflicts.length} conflict(s) found. Please review and resolve.
          </p>
        </div>
      )}
    </div>
  );
};

