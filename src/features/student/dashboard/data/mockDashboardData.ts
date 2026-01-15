/**
 * Mock Dashboard Data
 * Comprehensive mock data for Student Dashboard
 * Structure matches API response format for easy replacement later
 */

import type { Exam, Notification } from '../../models/student.model';

// Dashboard Statistics
export interface DashboardStats {
  attendancePercentage: number;
  upcomingExamsCount: number;
  unreadNotificationsCount: number;
  overallGPA: number;
  attendanceTrend: 'up' | 'down' | 'stable';
}

// Attendance Stats
export interface AttendanceStats {
  overallPercentage: number;
  monthlyData: Array<{
    month: string;
    percentage: number;
    totalDays: number;
    presentDays: number;
  }>;
  recentRecords: Array<{
    date: Date;
    status: 'present' | 'absent' | 'late';
    subject: string;
  }>;
  trend: 'up' | 'down' | 'stable';
}

// Academic Summary
export interface AcademicSummary {
  overallGPA: number;
  overallPercentage: number;
  subjectSummary: Array<{
    subject: string;
    grade: string;
    percentage: number;
    totalMarks: number;
    obtainedMarks: number;
  }>;
  recentGrades: Array<{
    subject: string;
    grade: string;
    percentage: number;
    term: string;
    date: Date;
  }>;
}

// Today's Schedule
export interface ScheduleItem {
  id: string;
  subject: string;
  teacher: string;
  startTime: string;
  endTime: string;
  room?: string;
}

// Mock data
export const mockDashboardStats: DashboardStats = {
  attendancePercentage: 87.5,
  upcomingExamsCount: 3,
  unreadNotificationsCount: 5,
  overallGPA: 3.7,
  attendanceTrend: 'up',
};

export const mockUpcomingExams: Exam[] = [
  {
    id: '1',
    title: 'Mathematics Midterm',
    subject: 'Mathematics',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    duration: 120,
    totalMarks: 100,
    status: 'upcoming',
    room: 'Room 101',
  },
  {
    id: '2',
    title: 'Science Quiz',
    subject: 'Science',
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    duration: 60,
    totalMarks: 50,
    status: 'upcoming',
    room: 'Room 205',
  },
  {
    id: '3',
    title: 'English Literature Test',
    subject: 'English',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    duration: 90,
    totalMarks: 100,
    status: 'upcoming',
    room: 'Room 302',
  },
];

export const mockRecentNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Assignment Posted',
    message: 'Mathematics assignment #5 has been posted. Due date: January 20, 2026',
    type: 'info',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: '2',
    title: 'Exam Schedule Updated',
    message: 'The Science exam has been rescheduled to January 18, 2026',
    type: 'warning',
    isRead: false,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
  },
  {
    id: '3',
    title: 'Attendance Reminder',
    message: 'You have been marked absent for Mathematics class on January 12, 2026',
    type: 'warning',
    isRead: true,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: '4',
    title: 'Grade Published',
    message: 'Your English Literature test results have been published',
    type: 'success',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    id: '5',
    title: 'Parent-Teacher Meeting',
    message: 'Parent-teacher meeting scheduled for January 25, 2026 at 2:00 PM',
    type: 'info',
    isRead: false,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
  },
];

export const mockAttendanceStats: AttendanceStats = {
  overallPercentage: 87.5,
  monthlyData: [
    { month: 'Sep', percentage: 85, totalDays: 20, presentDays: 17 },
    { month: 'Oct', percentage: 88, totalDays: 22, presentDays: 19 },
    { month: 'Nov', percentage: 90, totalDays: 20, presentDays: 18 },
    { month: 'Dec', percentage: 85, totalDays: 18, presentDays: 15 },
    { month: 'Jan', percentage: 87.5, totalDays: 12, presentDays: 10 },
  ],
  recentRecords: [
    { date: new Date(Date.now() - 0 * 24 * 60 * 60 * 1000), status: 'present', subject: 'Mathematics' },
    { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), status: 'absent', subject: 'Mathematics' },
    { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), status: 'present', subject: 'Science' },
    { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), status: 'late', subject: 'English' },
    { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), status: 'present', subject: 'History' },
  ],
  trend: 'up',
};

export const mockAcademicSummary: AcademicSummary = {
  overallGPA: 3.7,
  overallPercentage: 85.5,
  subjectSummary: [
    { subject: 'Mathematics', grade: 'A', percentage: 88, totalMarks: 100, obtainedMarks: 88 },
    { subject: 'Science', grade: 'B+', percentage: 87, totalMarks: 100, obtainedMarks: 87 },
    { subject: 'English', grade: 'A-', percentage: 92, totalMarks: 100, obtainedMarks: 92 },
    { subject: 'History', grade: 'B', percentage: 85, totalMarks: 100, obtainedMarks: 85 },
  ],
  recentGrades: [
    { subject: 'English', grade: 'A', percentage: 92, term: 'Term 1', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
    { subject: 'Science', grade: 'B+', percentage: 87, term: 'Term 1', date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    { subject: 'Mathematics', grade: 'A', percentage: 88, term: 'Term 1', date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
  ],
};

export const mockTodaysSchedule: ScheduleItem[] = [
  {
    id: '1',
    subject: 'Mathematics',
    teacher: 'Mr. John Smith',
    startTime: '09:00',
    endTime: '10:00',
    room: 'Room 101',
  },
  {
    id: '2',
    subject: 'Science',
    teacher: 'Ms. Sarah Johnson',
    startTime: '10:15',
    endTime: '11:15',
    room: 'Room 205',
  },
  {
    id: '3',
    subject: 'English',
    teacher: 'Mr. David Brown',
    startTime: '11:30',
    endTime: '12:30',
    room: 'Room 302',
  },
  {
    id: '4',
    subject: 'History',
    teacher: 'Ms. Emily Davis',
    startTime: '14:00',
    endTime: '15:00',
    room: 'Room 401',
  },
];

