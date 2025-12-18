/**
 * Admin Domain Models
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

export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  classes: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTeacherData {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  password: string;
}

export interface UpdateTeacherData extends Partial<Omit<CreateTeacherData, 'password'>> {
  id: string;
}

export interface Lecture {
  id: string;
  title: string;
  subject: string;
  classId: string;
  className: string;
  teacherId: string;
  teacherName: string;
  startTime: Date;
  endTime: Date;
  dayOfWeek: string;
  room?: string;
  createdAt: Date;
}

export interface CreateLectureData {
  title: string;
  subject: string;
  classId: string;
  teacherId: string;
  startTime: string;
  endTime: string;
  dayOfWeek: string;
  room?: string;
}

export interface UpdateLectureData extends Partial<CreateLectureData> {
  id: string;
}

export interface Report {
  id: string;
  type: string;
  title: string;
  data: any;
  generatedAt: Date;
}


