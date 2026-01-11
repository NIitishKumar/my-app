/**
 * Lectures Utility Functions
 */

import type { Lecture, CreateLectureData } from '../types/lectures.types';
// import { VALIDATION } from '../constants/lectures.constants';

/**
 * Format lecture display name
 */
export const formatLectureName = (lecture: Lecture): string => {
  return `${lecture.title} - ${lecture.subject}`;
};

/**
 * Sort lectures by title
 */
export const sortLectures = (lectures: Lecture[]): Lecture[] => {
  return [...lectures].sort((a, b) => {
    return a.title.localeCompare(b.title);
  });
};

/**
 * Filter lectures by search term
 */
export const filterLectures = (lectures: Lecture[], searchTerm: string): Lecture[] => {
  const term = searchTerm.toLowerCase();
  return lectures.filter((lecture) =>
    lecture.title.toLowerCase().includes(term) ||
    lecture.subject.toLowerCase().includes(term) ||
    lecture.description?.toLowerCase().includes(term) ||
    `${lecture.teacher.firstName} ${lecture.teacher.lastName}`.toLowerCase().includes(term) ||
    lecture.teacher.email.toLowerCase().includes(term) ||
    lecture.schedule.room?.toLowerCase().includes(term)
  );
};

/**
 * Format date to YYYY-MM-DD for input fields
 */
export const formatDateForInput = (date: Date | string | undefined): string => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';
  return d.toISOString().split('T')[0];
};

/**
 * Parse date string to Date object
 */
export const parseDateFromInput = (dateString: string): Date | undefined => {
  if (!dateString) return undefined;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? undefined : date;
};

/**
 * Get default form values
 */
export const getDefaultLectureFormData = (): Partial<CreateLectureData> => {
  return {
    title: '',
    description: '',
    subject: '',
    teacher: {
      firstName: '',
      lastName: '',
      email: '',
      teacherId: '',
    },
    schedule: {
      dayOfWeek: 'Monday',
      startTime: '09:00',
      endTime: '10:00',
      room: '',
    },
    duration: 60,
    type: 'lecture',
    materials: [],
    isActive: true,
  };
};

/**
 * Calculate duration from start and end time
 */
export const calculateDuration = (startTime: string, endTime: string): number => {
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  
  const startTotalMinutes = startHours * 60 + startMinutes;
  const endTotalMinutes = endHours * 60 + endMinutes;
  
  return endTotalMinutes - startTotalMinutes;
};
