/**
 * Admin Mappers
 */

import type {
  Class,
  CreateClassData,
  Teacher,
  CreateTeacherData,
  Lecture,
  CreateLectureData,
  Report,
} from '../models/admin.model';
import type {
  ClassDTO,
  CreateClassDTO,
  TeacherDTO,
  CreateTeacherDTO,
  LectureDTO,
  CreateLectureDTO,
  ReportDTO,
} from './admin.dto';

export class AdminMapper {
  // Class mappers
  static classToDomain(dto: ClassDTO): Class {
    return {
      id: dto.id,
      name: dto.name,
      grade: dto.grade,
      section: dto.section,
      teacherId: dto.teacher_id,
      teacherName: dto.teacher_name,
      studentCount: dto.student_count,
      createdAt: new Date(dto.created_at),
      updatedAt: new Date(dto.updated_at),
    };
  }

  static createClassToDTO(data: CreateClassData): CreateClassDTO {
    return {
      name: data.name,
      grade: data.grade,
      section: data.section,
      teacher_id: data.teacherId,
    };
  }

  // Teacher mappers
  static teacherToDomain(dto: TeacherDTO): Teacher {
    return {
      id: dto.id,
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      subject: dto.subject,
      classes: dto.classes,
      createdAt: new Date(dto.created_at),
      updatedAt: new Date(dto.updated_at),
    };
  }

  static createTeacherToDTO(data: CreateTeacherData): CreateTeacherDTO {
    return {
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      password: data.password,
    };
  }

  // Lecture mappers
  static lectureToDomain(dto: LectureDTO): Lecture {
    return {
      id: dto.id,
      title: dto.title,
      subject: dto.subject,
      classId: dto.class_id,
      className: dto.class_name,
      teacherId: dto.teacher_id,
      teacherName: dto.teacher_name,
      startTime: new Date(dto.start_time),
      endTime: new Date(dto.end_time),
      dayOfWeek: dto.day_of_week,
      room: dto.room,
      createdAt: new Date(dto.created_at),
    };
  }

  static createLectureToDTO(data: CreateLectureData): CreateLectureDTO {
    return {
      title: data.title,
      subject: data.subject,
      class_id: data.classId,
      teacher_id: data.teacherId,
      start_time: data.startTime,
      end_time: data.endTime,
      day_of_week: data.dayOfWeek,
      room: data.room,
    };
  }

  // Report mapper
  static reportToDomain(dto: ReportDTO): Report {
    return {
      id: dto.id,
      type: dto.type,
      title: dto.title,
      data: dto.data,
      generatedAt: new Date(dto.generated_at),
    };
  }
}


