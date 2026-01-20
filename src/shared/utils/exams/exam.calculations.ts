/**
 * Exam Calculations
 * Utility functions for calculating exam metrics
 */

import type { Exam } from '../../../features/student/exams/types/exam.types';

/**
 * Calculate days until exam
 */
export const getDaysUntil = (examDate: Date | string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = typeof examDate === 'string' ? new Date(examDate) : examDate;
  date.setHours(0, 0, 0, 0);
  const diffTime = date.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Get exam urgency
 */
export const getExamUrgency = (daysUntil: number): {
  color: string;
  label: string;
  severity: 'high' | 'medium' | 'low';
} => {
  if (daysUntil < 0) {
    return { color: 'text-gray-600 bg-gray-50 border-gray-200', label: 'Past', severity: 'low' };
  }
  if (daysUntil === 0) {
    return { color: 'text-red-600 bg-red-50 border-red-200', label: 'Today', severity: 'high' };
  }
  if (daysUntil === 1) {
    return {
      color: 'text-orange-600 bg-orange-50 border-orange-200',
      label: 'Tomorrow',
      severity: 'high',
    };
  }
  if (daysUntil <= 3) {
    return {
      color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      label: 'Soon',
      severity: 'medium',
    };
  }
  return {
    color: 'text-blue-600 bg-blue-50 border-blue-200',
    label: 'Upcoming',
    severity: 'low',
  };
};

/**
 * Check if exam is today
 */
export const isToday = (date: Date | string): boolean => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
};

/**
 * Check if exam is upcoming
 */
export const isUpcoming = (exam: Exam): boolean => {
  const examDate = typeof exam.date === 'string' ? new Date(exam.date) : exam.date;
  const now = new Date();
  return examDate > now && exam.status !== 'completed' && exam.status !== 'cancelled';
};


