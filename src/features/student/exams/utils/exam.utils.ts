/**
 * Student Exam Utility Functions
 */

import type { Exam, ExamStatus } from '../types/exam.types';

/**
 * Sort exams by date
 */
export const sortExamsByDate = (exams: Exam[]): Exam[] => {
  return [...exams].sort((a, b) => {
    const dateA = typeof a.date === 'string' ? new Date(a.date) : a.date;
    const dateB = typeof b.date === 'string' ? new Date(b.date) : b.date;
    return dateA.getTime() - dateB.getTime();
  });
};

/**
 * Filter exams by status
 */
export const filterExamsByStatus = (exams: Exam[], status: ExamStatus): Exam[] => {
  return exams.filter((exam) => exam.status === status);
};

/**
 * Filter exams by subject
 */
export const filterExamsBySubject = (exams: Exam[], subject: string): Exam[] => {
  return exams.filter((exam) => exam.subject.toLowerCase().includes(subject.toLowerCase()));
};

/**
 * Group exams by date
 */
export const groupExamsByDate = (exams: Exam[]): Record<string, Exam[]> => {
  return exams.reduce((acc, exam) => {
    const date = typeof exam.date === 'string' ? new Date(exam.date) : exam.date;
    const dateKey = date.toISOString().split('T')[0];

    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(exam);

    return acc;
  }, {} as Record<string, Exam[]>);
};

/**
 * Check if exam is upcoming
 */
export const isUpcoming = (exam: Exam): boolean => {
  // Trust the API status if it's marked as upcoming or scheduled
  if (exam.status === 'upcoming' || exam.status === 'scheduled') {
    return true;
  }
  
  // If status is completed or cancelled, it's not upcoming
  if (exam.status === 'completed' || exam.status === 'cancelled') {
    return false;
  }
  
  // For other statuses, check the date
  const examDate = typeof exam.date === 'string' ? new Date(exam.date) : exam.date;
  const now = new Date();
  return examDate > now;
};

