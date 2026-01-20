/**
 * AttendanceStatusBadge Component
 * Reusable status indicator badge
 */

import React from 'react';
import type { AttendanceStatus } from '../../../features/student/attendance/types/attendance.types';

interface AttendanceStatusBadgeProps {
  status: AttendanceStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const statusConfig: Record<AttendanceStatus, { color: string; icon: string; label: string }> = {
  present: {
    color: 'bg-green-100 text-green-700 border-green-300',
    icon: 'fa-check-circle',
    label: 'Present',
  },
  absent: {
    color: 'bg-red-100 text-red-700 border-red-300',
    icon: 'fa-times-circle',
    label: 'Absent',
  },
  late: {
    color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    icon: 'fa-clock',
    label: 'Late',
  },
  excused: {
    color: 'bg-blue-100 text-blue-700 border-blue-300',
    icon: 'fa-calendar-check',
    label: 'Excused',
  },
};

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
  lg: 'text-base px-3 py-1.5',
};

export const AttendanceStatusBadge: React.FC<AttendanceStatusBadgeProps> = ({
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

