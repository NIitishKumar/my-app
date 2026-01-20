/**
 * Admin Exam Domain Types
 */

import type { Exam, ExamStatus, ExamType, ExamsResponse, ExamDetails } from '../../../student/exams/types/exam.types';

// Re-export common types
export type { Exam, ExamStatus, ExamType, ExamsResponse, ExamDetails };

export interface CreateExamData {
  title: string;
  subject: string;
  subjectCode?: string;
  classIds: string[];
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  duration: number; // minutes
  totalMarks: number;
  room?: string;
  instructions?: string;
  examType?: ExamType;
}

export interface UpdateExamData extends Partial<CreateExamData> {
  id: string;
}

export interface BulkCreateExamData {
  exams: CreateExamData[];
}

export interface ExamConflict {
  exam1: {
    id: string;
    title: string;
    date: string;
    startTime: string;
    room?: string;
  };
  exam2: {
    id: string;
    title: string;
    date: string;
    startTime: string;
    room?: string;
  };
  conflictType: 'room' | 'time';
  severity: 'high' | 'medium' | 'low';
}

export interface ExamDashboard {
  overview: {
    totalExams: number;
    upcomingExams: number;
    completedExams: number;
    todayExams: number;
    thisWeekExams: number;
  };
  upcomingExams: Array<{
    id: string;
    title: string;
    subject: string;
    className: string;
    date: string;
    teacherName: string;
    studentCount: number;
  }>;
  conflicts: ExamConflict[];
}

export interface ExamAnalytics {
  examsBySubject: Array<{
    subject: string;
    count: number;
    upcoming: number;
    completed: number;
  }>;
  examsByClass: Array<{
    classId: string;
    className: string;
    count: number;
    upcoming: number;
    completed: number;
  }>;
  monthlyDistribution: Array<{
    month: string; // YYYY-MM
    count: number;
  }>;
  roomUtilization: Array<{
    room: string;
    usageCount: number;
    utilizationRate: number;
  }>;
}

export interface BulkCreateResult {
  created: number;
  failed: number;
  errors: Array<{
    row: number;
    error: string;
  }>;
}

// API DTOs
export interface CreateExamApiDTO {
  title: string;
  subject: string;
  subjectCode?: string;
  classIds: string[];
  date: string;
  startTime: string;
  duration: number;
  totalMarks: number;
  room?: string;
  instructions?: string;
  examType?: ExamType;
}

export interface BulkCreateExamApiDTO {
  exams: CreateExamApiDTO[];
}

export interface BulkCreateResultApiResponse {
  success: boolean;
  data: BulkCreateResult;
}

export interface ExamDashboardApiResponse {
  success: boolean;
  data: ExamDashboard;
}

export interface ExamAnalyticsApiResponse {
  success: boolean;
  data: ExamAnalytics;
}

export interface ExamConflictsApiResponse {
  success: boolean;
  data: {
    conflicts: ExamConflict[];
  };
}

