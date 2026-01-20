/**
 * ExamsDashboard Component
 * Dashboard summary for teacher exams
 */

import React from 'react';
import type { ExamsResponse } from '../../../student/exams/types/exam.types';

interface ExamsDashboardProps {
  examsData?: ExamsResponse;
  isLoading?: boolean;
  className?: string;
}

export const ExamsDashboard: React.FC<ExamsDashboardProps> = ({
  examsData,
  isLoading = false,
  className = '',
}) => {
  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!examsData) return null;

  const upcomingCount = examsData.exams.filter(
    (exam) => exam.status === 'upcoming' || exam.status === 'scheduled'
  ).length;
  const completedCount = examsData.exams.filter((exam) => exam.status === 'completed').length;
  const gradedCount = examsData.exams.filter((exam) => exam.status === 'graded').length;
  const totalCount = examsData.exams.length;

  const stats = [
    {
      label: 'Total Exams',
      value: totalCount,
      icon: 'fa-calendar-alt',
      color: 'bg-indigo-500',
    },
    {
      label: 'Upcoming',
      value: upcomingCount,
      icon: 'fa-clock',
      color: 'bg-blue-500',
    },
    {
      label: 'Completed',
      value: completedCount,
      icon: 'fa-check-circle',
      color: 'bg-gray-500',
    },
    {
      label: 'Graded',
      value: gradedCount,
      icon: 'fa-check-double',
      color: 'bg-green-500',
    },
  ];

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
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
  );
};


