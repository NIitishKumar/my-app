/**
 * Admin API DTOs
 */

export interface ClassDTO {
  id: string;
  name: string;
  grade: string;
  section: string;
  teacher_id?: string;
  teacher_name?: string;
  student_count: number;
  created_at: string;
  updated_at: string;
}

export interface CreateClassDTO {
  name: string;
  grade: string;
  section: string;
  teacher_id?: string;
}

export interface TeacherDTO {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  classes: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateTeacherDTO {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  password: string;
}

export interface LectureDTO {
  id: string;
  title: string;
  subject: string;
  class_id: string;
  class_name: string;
  teacher_id: string;
  teacher_name: string;
  start_time: string;
  end_time: string;
  day_of_week: string;
  room?: string;
  created_at: string;
}

export interface CreateLectureDTO {
  title: string;
  subject: string;
  class_id: string;
  teacher_id: string;
  start_time: string;
  end_time: string;
  day_of_week: string;
  room?: string;
}

export interface ReportDTO {
  id: string;
  type: string;
  title: string;
  data: Record<string, unknown>;
  generated_at: string;
}

