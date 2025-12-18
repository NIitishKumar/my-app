/**
 * Classes Domain Types
 */

export interface Class {
  id: string;
  name: string;
  grade: string;
  section: string;
  teacherId?: string;
  teacherName?: string;
  studentCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateClassData {
  name: string;
  grade: string;
  section: string;
  teacherId?: string;
}

export interface UpdateClassData extends Partial<CreateClassData> {
  id: string;
}

// API DTOs
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


