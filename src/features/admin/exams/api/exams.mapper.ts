/**
 * Admin Exam Mapper
 */

import {
  mapExamToDomain,
  mapExamsResponseToDomain,
  mapExamDetailsToDomain,
} from '../../../student/exams/api/exams.mapper';
import type {
  CreateExamData,
  BulkCreateResult,
  ExamDashboard,
  ExamAnalytics,
  ExamConflict,
  CreateExamApiDTO,
  BulkCreateResultApiResponse,
  ExamDashboardApiResponse,
  ExamAnalyticsApiResponse,
  ExamConflictsApiResponse,
} from '../types/exam.types';

// Re-export student mappers
export {
  mapExamToDomain,
  mapExamsResponseToDomain,
  mapExamDetailsToDomain,
};

/**
 * Map Domain model to API DTO for CreateExam
 */
export const mapCreateExamToDTO = (data: CreateExamData): CreateExamApiDTO => {
  return {
    title: data.title,
    subject: data.subject,
    subjectCode: data.subjectCode,
    classIds: data.classIds,
    date: data.date,
    startTime: data.startTime,
    duration: data.duration,
    totalMarks: data.totalMarks,
    room: data.room,
    instructions: data.instructions,
    examType: data.examType,
  };
};

/**
 * Map API response to BulkCreateResult
 */
export const mapBulkCreateResultToDomain = (
  response: BulkCreateResultApiResponse
): BulkCreateResult => {
  return response.data;
};

/**
 * Map API response to ExamDashboard
 */
export const mapExamDashboardToDomain = (
  response: ExamDashboardApiResponse
): ExamDashboard => {
  return response.data;
};

/**
 * Map API response to ExamAnalytics
 */
export const mapExamAnalyticsToDomain = (
  response: ExamAnalyticsApiResponse
): ExamAnalytics => {
  return response.data;
};

/**
 * Map API response to ExamConflict array
 */
export const mapExamConflictsToDomain = (
  response: ExamConflictsApiResponse
): ExamConflict[] => {
  return response.data.conflicts;
};

