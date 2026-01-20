/**
 * Student Exam Domain Types
 */

export type ExamStatus = 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'upcoming' | 'graded';

export type ExamType = 'midterm' | 'final' | 'quiz' | 'assignment';

export interface Exam {
  id: string;
  title: string;
  subject: string;
  subjectCode?: string;
  classId: string;
  className: string;
  date: Date;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  duration: number; // in minutes
  totalMarks: number;
  room?: string;
  status: ExamStatus;
  instructions?: string;
  examType?: ExamType;
  teacher?: {
    id: string;
    name: string;
    email?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ExamResult {
  examId: string;
  examTitle: string;
  subject: string;
  date: Date;
  totalMarks: number;
  obtainedMarks: number;
  grade: string;
  percentage: number;
  publishedAt?: Date;
}

export interface ExamDetails extends Exam {
  results?: {
    obtainedMarks: number;
    grade: string;
    percentage: number;
    publishedAt: Date;
  };
}

export interface ExamsResponse {
  exams: Exam[];
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalRecords: number;
  };
}

export interface ExamResultsResponse {
  results: ExamResult[];
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalRecords: number;
  };
}

export interface CalendarDay {
  date: Date;
  exams: Exam[];
}

export interface ExamCalendar {
  year: number;
  month: number;
  days: CalendarDay[];
}

export interface ExamFilters {
  status?: ExamStatus;
  subject?: string;
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
  page?: number;
  limit?: number;
}

// API DTOs
export interface ExamApiDTO {
  id: string;
  title: string;
  subject: string;
  subjectCode?: string;
  classId: string;
  className: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  totalMarks: number;
  room?: string;
  status: ExamStatus;
  instructions?: string;
  examType?: ExamType;
  teacher?: {
    id: string;
    name: string;
    email?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface ExamsApiResponse {
  success: boolean;
  data: {
    exams: ExamApiDTO[];
    pagination: {
      page: number;
      limit: number;
      totalPages: number;
      totalRecords: number;
    };
  };
}

export interface ExamDetailsApiResponse {
  success: boolean;
  data: ExamApiDTO & {
    results?: {
      obtainedMarks: number;
      grade: string;
      percentage: number;
      publishedAt: string;
    };
  };
}

export interface ExamResultApiDTO {
  examId: string;
  examTitle: string;
  subject: string;
  date: string;
  totalMarks: number;
  obtainedMarks: number;
  grade: string;
  percentage: number;
  publishedAt?: string;
}

export interface ExamResultsApiResponse {
  success: boolean;
  data: {
    results: ExamResultApiDTO[];
    pagination: {
      page: number;
      limit: number;
      totalPages: number;
      totalRecords: number;
    };
  };
}

export interface CalendarDayApiDTO {
  date: string;
  exams: Array<{
    id: string;
    title: string;
    subject: string;
    startTime: string;
    endTime: string;
    room?: string;
  }>;
}

export interface ExamCalendarApiResponse {
  success: boolean;
  data: {
    year: number;
    month: number;
    days: CalendarDayApiDTO[];
  };
}


