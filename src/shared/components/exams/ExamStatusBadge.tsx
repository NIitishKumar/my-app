/**
 * ExamStatusBadge Component
 * Reusable status indicator badge
 */

import React from 'react';
import type { ExamStatus } from '../../../features/student/exams/types/exam.types';

interface ExamStatusBadgeProps {
  status: ExamStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const statusConfig: Record<ExamStatus, { color: string; icon: string; label: string }> = {
  scheduled: {
    color: 'bg-blue-100 text-blue-700 border-blue-300',
    icon: 'fa-calendar-alt',
    label: 'Scheduled',
  },
  'in-progress': {
    color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    icon: 'fa-clock',
    label: 'In Progress',
  },
  completed: {
    color: 'bg-gray-100 text-gray-700 border-gray-300',
    icon: 'fa-check-circle',
    label: 'Completed',
  },
  cancelled: {
    color: 'bg-red-100 text-red-700 border-red-300',
    icon: 'fa-times-circle',
    label: 'Cancelled',
  },
  upcoming: {
    color: 'bg-indigo-100 text-indigo-700 border-indigo-300',
    icon: 'fa-calendar-check',
    label: 'Upcoming',
  },
  graded: {
    color: 'bg-green-100 text-green-700 border-green-300',
    icon: 'fa-check-double',
    label: 'Graded',
  },
};

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
  lg: 'text-base px-3 py-1.5',
};

export const ExamStatusBadge: React.FC<ExamStatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
  className = '',
}) => {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${config.color} ${sizeClasses[size]} ${className}`}
    >
      {showIcon && <i className={`fas ${config.icon} text-xs`}></i>}
      <span>{config.label}</span>
    </span>
  );
};


