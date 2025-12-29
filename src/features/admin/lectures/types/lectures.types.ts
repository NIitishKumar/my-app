/**
 * Lectures Domain Types
 */

// Domain Types (used in the application)
export interface LectureTeacher {
  firstName: string;
  lastName: string;
  email: string;
  teacherId: string;
}

export interface LectureSchedule {
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  startTime: string;
  endTime: string;
  room?: string;
}

export interface LectureMaterial {
  name: string;
  type: 'document' | 'presentation' | 'video' | 'link';
  url: string;
}

export interface Lecture {
  id: string;
  title: string;
  description?: string;
  subject: string;
  teacher: LectureTeacher;
  schedule: LectureSchedule;
  duration: number; // in minutes
  type: 'lecture' | 'lab' | 'seminar' | 'tutorial';
  materials: LectureMaterial[];
  isActive: boolean;
  classId?: string; // Optional class reference
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateLectureData {
  title: string;
  description?: string;
  subject: string;
  teacher: LectureTeacher | string; // Can be teacher object or teacher ID string
  schedule: LectureSchedule;
  duration: number;
  type?: 'lecture' | 'lab' | 'seminar' | 'tutorial'; // Optional, defaults to 'lecture'
  materials?: LectureMaterial[];
  isActive?: boolean; // Optional, defaults to true
  classId?: string; // Optional class reference
  teacherId?: string; // Optional teacher ID (used when teacher is passed as ID)
}

export interface UpdateLectureData extends Partial<CreateLectureData> {
  id: string;
}

// API Response Types (camelCase with _id)
export interface LectureTeacherApiDTO {
  firstName: string;
  lastName: string;
  email: string;
  teacherId: string;
}

export interface LectureScheduleApiDTO {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  room?: string;
}

export interface LectureMaterialApiDTO {
  name: string;
  type: string;
  url: string;
}

export interface LectureApiDTO {
  _id: string;
  title: string;
  description?: string;
  subject: string;
  teacher: LectureTeacherApiDTO;
  schedule: LectureScheduleApiDTO;
  duration: number;
  type: string;
  materials: LectureMaterialApiDTO[];
  isActive?: boolean;
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
}

// API Response Wrappers
export interface LecturesApiResponse {
  success: boolean;
  count: number;
  data: LectureApiDTO[];
}

export interface LectureApiResponse {
  success: boolean;
  data: LectureApiDTO;
  message?: string;
}

export interface CreateLectureApiResponse {
  success: boolean;
  message: string;
  data: LectureApiDTO;
}

export interface UpdateLectureApiResponse {
  success: boolean;
  message: string;
  data: LectureApiDTO;
}

export interface DeleteLectureApiResponse {
  success: boolean;
  message: string;
}
