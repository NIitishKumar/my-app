/**
 * Student Dashboard Hooks
 * React Query hooks for fetching dashboard data from APIs
 */

import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../api/dashboard.service';
import { studentService } from '../../api/student.service';
import type {
  DashboardStats,
  AttendanceStats,
  AcademicSummary,
  ScheduleItem,
} from '../data/mockDashboardData';
import type { Exam, Notification } from '../../models/student.model';

/**
 * Get dashboard statistics
 */
export const useDashboardStats = () => {
  return useQuery<DashboardStats>({
    queryKey: ['student-dashboard', 'stats'],
    queryFn: () => dashboardService.getDashboardStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Get upcoming exams
 */
export const useUpcomingExams = () => {
  return useQuery<Exam[]>({
    queryKey: ['student-dashboard', 'upcoming-exams'],
    queryFn: () => studentService.getExams({ status: 'upcoming', limit: 5 }),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Get recent notifications
 */
export const useRecentNotifications = () => {
  return useQuery<Notification[]>({
    queryKey: ['student-dashboard', 'recent-notifications'],
    queryFn: () => studentService.getNotifications({ limit: 5 }),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Get attendance statistics
 */
export const useAttendanceStats = () => {
  return useQuery<AttendanceStats>({
    queryKey: ['student-dashboard', 'attendance-stats'],
    queryFn: () => dashboardService.getAttendanceStats(),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Get academic summary
 */
export const useAcademicSummary = () => {
  return useQuery<AcademicSummary>({
    queryKey: ['student-dashboard', 'academic-summary'],
    queryFn: () => dashboardService.getAcademicSummary(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Get today's schedule
 */
export const useTodaysSchedule = () => {
  return useQuery<ScheduleItem[]>({
    queryKey: ['student-dashboard', 'todays-schedule'],
    queryFn: () => dashboardService.getTodaysSchedule(),
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

