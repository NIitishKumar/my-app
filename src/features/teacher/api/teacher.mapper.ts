/**
 * Teacher Mappers
 */

import type {
  AssignedClass,
  AttendanceRecord,
  StudentAttendance,
  MarkAttendanceData,
  Query,
  CreateQueryData,
} from '../models/teacher.model';
import type {
  AssignedClassDTO,
  AttendanceRecordDTO,
  StudentAttendanceDTO,
  MarkAttendanceDTO,
  QueryDTO,
  CreateQueryDTO,
} from './teacher.dto';

export class TeacherMapper {
  static assignedClassToDomain(dto: AssignedClassDTO): AssignedClass {
    return {
      id: dto.id,
      name: dto.name,
      grade: dto.grade,
      section: dto.section,
      subject: dto.subject,
      studentCount: dto.student_count,
      schedule: dto.schedule,
    };
  }

  static studentAttendanceToDomain(dto: StudentAttendanceDTO): StudentAttendance {
    return {
      studentId: dto.student_id,
      studentName: dto.student_name,
      status: dto.status,
    };
  }

  static attendanceRecordToDomain(dto: AttendanceRecordDTO): AttendanceRecord {
    return {
      id: dto.id,
      classId: dto.class_id,
      className: dto.class_name,
      date: new Date(dto.date),
      students: dto.students.map(this.studentAttendanceToDomain),
      submittedAt: dto.submitted_at ? new Date(dto.submitted_at) : undefined,
    };
  }

  static markAttendanceToDTO(data: MarkAttendanceData): MarkAttendanceDTO {
    return {
      class_id: data.classId,
      date: data.date,
      students: data.students.map((s) => ({
        student_id: s.studentId,
        status: s.status,
      })),
    };
  }

  static queryToDomain(dto: QueryDTO): Query {
    return {
      id: dto.id,
      subject: dto.subject,
      message: dto.message,
      status: dto.status,
      createdAt: new Date(dto.created_at),
      resolvedAt: dto.resolved_at ? new Date(dto.resolved_at) : undefined,
      response: dto.response,
    };
  }

  static createQueryToDTO(data: CreateQueryData): CreateQueryDTO {
    return {
      subject: data.subject,
      message: data.message,
    };
  }
}


