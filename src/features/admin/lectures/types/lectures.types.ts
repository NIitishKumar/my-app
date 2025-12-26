/**
 * Lectures Domain Types
 */

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
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateLectureData {
  title: string;
  description?: string;
  subject: string;
  teacher: LectureTeacher;
  schedule: LectureSchedule;
  duration: number;
  type: 'lecture' | 'lab' | 'seminar' | 'tutorial';
  materials: LectureMaterial[];
  isActive: boolean;
}

export interface UpdateLectureData extends Partial<CreateLectureData> {
  id: string;
}

// API DTOs
export interface LectureTeacherDTO {
  first_name: string;
  last_name: string;
  email: string;
  teacher_id: string;
}

export interface LectureScheduleDTO {
  day_of_week: string;
  start_time: string;
  end_time: string;
  room?: string;
}

export interface LectureMaterialDTO {
  name: string;
  type: string;
  url: string;
}

export interface LectureDTO {
  id: string;
  title: string;
  description?: string;
  subject: string;
  teacher: LectureTeacherDTO;
  schedule: LectureScheduleDTO;
  duration: number;
  type: string;
  materials: LectureMaterialDTO[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateLectureDTO {
  title: string;
  description?: string;
  subject: string;
  teacher: LectureTeacherDTO;
  schedule: LectureScheduleDTO;
  duration: number;
  type: string;
  materials: LectureMaterialDTO[];
  is_active: boolean;
}

