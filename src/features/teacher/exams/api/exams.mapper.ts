/**
 * Teacher Exam Mapper
 */

import {
  mapExamToDomain,
  mapExamsResponseToDomain,
  mapExamDetailsToDomain,
  mapExamCalendarToDomain,
} from '../../../student/exams/api/exams.mapper';
import type {
  ExamEnrollment,
  StudentEnrollment,
  ExamEnrollmentApiDTO,
  ExamEnrollmentApiResponse,
} from '../types/exam.types';

// Re-export student mappers
export {
  mapExamToDomain,
  mapExamsResponseToDomain,
  mapExamDetailsToDomain,
  mapExamCalendarToDomain,
};

/**
 * Map API DTO to Domain model for StudentEnrollment
 */
export const mapStudentEnrollmentToDomain = (
  dto: ExamEnrollmentApiDTO['enrolledStudents'][0]
): StudentEnrollment => {
  return {
    studentId: dto.studentId,
    studentName: dto.studentName,
    studentIdNumber: dto.studentIdNumber,
    className: dto.className,
  };
};

/**
 * Map API response to ExamEnrollment
 */
export const mapExamEnrollmentToDomain = (
  response: ExamEnrollmentApiResponse
): ExamEnrollment => {
  return {
    examId: response.data.examId,
    totalStudents: response.data.totalStudents,
    enrolledStudents: response.data.enrolledStudents.map(mapStudentEnrollmentToDomain),
  };
};


