/**
 * Teacher Exam Domain Types
 */

import type { Exam, ExamStatus, ExamType } from '../../../student/exams/types/exam.types';

// Re-export common types
export type { Exam, ExamStatus, ExamType };

export interface ExamEnrollment {
  examId: string;
  totalStudents: number;
  enrolledStudents: StudentEnrollment[];
}

export interface StudentEnrollment {
  studentId: string;
  studentName: string;
  studentIdNumber: string;
  className: string;
}

export interface TeacherExam extends Exam {
  enrollment?: ExamEnrollment;
}

// API DTOs
export interface ExamEnrollmentApiDTO {
  examId: string;
  totalStudents: number;
  enrolledStudents: Array<{
    studentId: string;
    studentName: string;
    studentIdNumber: string;
    className: string;
  }>;
}

export interface ExamEnrollmentApiResponse {
  success: boolean;
  data: ExamEnrollmentApiDTO;
}


