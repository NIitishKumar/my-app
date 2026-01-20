/**
 * Admin Exam API DTOs
 */

export type {
  CreateExamApiDTO,
  BulkCreateExamApiDTO,
  BulkCreateResultApiResponse,
  ExamDashboardApiResponse,
  ExamAnalyticsApiResponse,
  ExamConflictsApiResponse,
} from '../types/exam.types';

// Re-export student exam DTOs
export type {
  ExamApiDTO,
  ExamsApiResponse,
  ExamDetailsApiResponse,
} from '../../../student/exams/types/exam.types';

