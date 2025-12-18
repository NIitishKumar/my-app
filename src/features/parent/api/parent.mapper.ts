/**
 * Parent Mappers
 */

import type {
  Child,
  ChildAttendance,
  AttendanceRecord,
  ChildRecord,
  AcademicRecord,
  Teacher,
  Query,
  CreateQueryData,
} from '../models/parent.model';
import type {
  ChildDTO,
  ChildAttendanceDTO,
  AttendanceRecordDTO,
  ChildRecordDTO,
  AcademicRecordDTO,
  TeacherDTO,
  QueryDTO,
  CreateQueryDTO,
} from './parent.dto';

export class ParentMapper {
  static childToDomain(dto: ChildDTO): Child {
    return {
      id: dto.id,
      name: dto.name,
      grade: dto.grade,
      section: dto.section,
      rollNumber: dto.roll_number,
      className: dto.class_name,
      avatar: dto.avatar,
    };
  }

  static attendanceRecordToDomain(dto: AttendanceRecordDTO): AttendanceRecord {
    return {
      date: new Date(dto.date),
      status: dto.status,
    };
  }

  static childAttendanceToDomain(dto: ChildAttendanceDTO): ChildAttendance {
    return {
      childId: dto.child_id,
      childName: dto.child_name,
      records: dto.records.map(this.attendanceRecordToDomain),
      summary: {
        totalDays: dto.summary.total_days,
        presentDays: dto.summary.present_days,
        absentDays: dto.summary.absent_days,
        percentage: dto.summary.percentage,
      },
    };
  }

  static academicRecordToDomain(dto: AcademicRecordDTO): AcademicRecord {
    return {
      subject: dto.subject,
      marks: dto.marks,
      totalMarks: dto.total_marks,
      percentage: dto.percentage,
      grade: dto.grade,
      term: dto.term,
    };
  }

  static childRecordToDomain(dto: ChildRecordDTO): ChildRecord {
    return {
      childId: dto.child_id,
      childName: dto.child_name,
      records: dto.records.map(this.academicRecordToDomain),
      overallPerformance: {
        totalSubjects: dto.overall_performance.total_subjects,
        averagePercentage: dto.overall_performance.average_percentage,
        grade: dto.overall_performance.grade,
      },
    };
  }

  static teacherToDomain(dto: TeacherDTO): Teacher {
    return {
      id: dto.id,
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      subject: dto.subject,
      avatar: dto.avatar,
    };
  }

  static queryToDomain(dto: QueryDTO): Query {
    return {
      id: dto.id,
      childId: dto.child_id,
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
      child_id: data.childId,
      subject: data.subject,
      message: data.message,
    };
  }
}


