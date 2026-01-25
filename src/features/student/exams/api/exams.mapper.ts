/**
 * Student Exam Mapper
 * Transforms between API DTOs and Domain models
 */

import type {
  Exam,
  ExamDetails,
  ExamResult,
  ExamsResponse,
  ExamResultsResponse,
  CalendarDay,
  ExamCalendar,
  ExamApiDTO,
  ExamsApiResponse,
  ExamDetailsApiResponse,
  ExamResultApiDTO,
  ExamResultsApiResponse,
  CalendarDayApiDTO,
  ExamCalendarApiResponse,
} from '../types/exam.types';

/**
 * Map API DTO to Domain model for Exam
 */
export const mapExamToDomain = (dto: ExamApiDTO): Exam => {
  return {
    id: dto.id,
    title: dto.title,
    subject: dto.subject,
    subjectCode: dto.subjectCode,
    classId: dto.classId,
    className: dto.className,
    date: new Date(dto.date),
    startTime: dto.startTime,
    endTime: dto.endTime,
    duration: dto.duration,
    totalMarks: dto.totalMarks,
    room: dto.room,
    status: dto.status,
    instructions: dto.instructions,
    examType: dto.examType,
    teacher: dto.teacher,
    createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
    updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
  };
};

/**
 * Map API response to ExamsResponse
 */
export const mapExamsResponseToDomain = (response: ExamsApiResponse): ExamsResponse => {
  const exams = response.data.exams.map(mapExamToDomain);
  return {
    exams,
    pagination: response.data.pagination || {
      page: 1,
      limit: exams.length,
      totalPages: 1,
      totalRecords: exams.length,
    },
  };
};

/**
 * Map API response to ExamDetails
 */
export const mapExamDetailsToDomain = (response: ExamDetailsApiResponse): ExamDetails => {
  const exam = mapExamToDomain(response.data);
  return {
    ...exam,
    results: response.data.results
      ? {
          obtainedMarks: response.data.results.obtainedMarks,
          grade: response.data.results.grade,
          percentage: response.data.results.percentage,
          publishedAt: new Date(response.data.results.publishedAt),
        }
      : undefined,
  };
};

/**
 * Map API DTO to Domain model for ExamResult
 */
export const mapExamResultToDomain = (dto: ExamResultApiDTO): ExamResult => {
  return {
    examId: dto.examId,
    examTitle: dto.examTitle,
    subject: dto.subject,
    date: new Date(dto.date),
    totalMarks: dto.totalMarks,
    obtainedMarks: dto.obtainedMarks,
    grade: dto.grade,
    percentage: dto.percentage,
    publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : undefined,
  };
};

/**
 * Map API response to ExamResultsResponse
 */
export const mapExamResultsResponseToDomain = (
  response: ExamResultsApiResponse
): ExamResultsResponse => {
  return {
    results: response.data.results.map(mapExamResultToDomain),
    pagination: response.data.pagination,
  };
};

/**
 * Map API DTO to Domain model for CalendarDay
 */
export const mapCalendarDayToDomain = (dto: CalendarDayApiDTO): CalendarDay => {
  return {
    date: new Date(dto.date),
    exams: dto.exams.map((exam) => ({
      id: exam.id,
      title: exam.title,
      subject: exam.subject,
      classId: '',
      className: '',
      date: new Date(dto.date),
      startTime: exam.startTime,
      endTime: exam.endTime,
      duration: 0,
      totalMarks: 0,
      room: exam.room,
      status: 'scheduled' as const,
    })),
  };
};

/**
 * Map API response to ExamCalendar
 */
export const mapExamCalendarToDomain = (response: ExamCalendarApiResponse): ExamCalendar => {
  return {
    year: response.data.year,
    month: response.data.month,
    days: response.data.days.map(mapCalendarDayToDomain),
  };
};

