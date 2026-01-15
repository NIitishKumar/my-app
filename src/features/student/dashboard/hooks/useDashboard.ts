/**
 * Student Dashboard Hooks
 * Hooks for fetching dashboard data
 * Currently returns mock data, ready for API integration
 */

import { useQuery } from '@tanstack/react-query';
import {
  mockDashboardStats,
  mockUpcomingExams,
  mockRecentNotifications,
  mockAttendanceStats,
  mockAcademicSummary,
  mockTodaysSchedule,
  type DashboardStats,
  type AttendanceStats,
  type AcademicSummary,
  type ScheduleItem,
} from '../data/mockDashboardData';
import type { Exam, Notification } from '../../models/student.model';

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Get dashboard statistics
 */
export const useDashboardStats = () => {
  return useQuery<DashboardStats>({
    queryKey: ['student-dashboard', 'stats'],
    queryFn: async () => {
      await delay(500); // Simulate API call
      return mockDashboardStats;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Get upcoming exams
 */
export const useUpcomingExams = () => {
  return useQuery<Exam[]>({
    queryKey: ['student-dashboard', 'upcoming-exams'],
    queryFn: async () => {
      await delay(500);
      return mockUpcomingExams;
    },
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Get recent notifications
 */
export const useRecentNotifications = () => {
  return useQuery<Notification[]>({
    queryKey: ['student-dashboard', 'recent-notifications'],
    queryFn: async () => {
      await delay(500);
      return mockRecentNotifications;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Get attendance statistics
 */
export const useAttendanceStats = () => {
  return useQuery<AttendanceStats>({
    queryKey: ['student-dashboard', 'attendance-stats'],
    queryFn: async () => {
      await delay(500);
      return mockAttendanceStats;
    },
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Get academic summary
 */
export const useAcademicSummary = () => {
  return useQuery<AcademicSummary>({
    queryKey: ['student-dashboard', 'academic-summary'],
    queryFn: async () => {
      await delay(500);
      return mockAcademicSummary;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Get today's schedule
 */
export const useTodaysSchedule = () => {
  return useQuery<ScheduleItem[]>({
    queryKey: ['student-dashboard', 'todays-schedule'],
    queryFn: async () => {
      await delay(300);
      // Filter schedule based on today's day of week
      // For mock data, return all schedule items
      return mockTodaysSchedule;
    },
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

