/**
 * Attendance Mapper - Converts between API DTOs and Domain Models
 */

import type {
  AttendanceRecord,
  StudentAttendance,
  MarkAttendanceData,
  AttendanceRecordDTO,
  StudentAttendanceDTO,
  MarkAttendanceDTO,
  AttendanceRecordApiDTO,
  StudentAttendanceApiDTO,
} from '../types/attendance.types';

// Map API DTO (snake_case) to Domain Model
export const mapStudentAttendanceToDomain = (dto: StudentAttendanceDTO): StudentAttendance => ({
  studentId: dto.student_id,
  studentName: dto.student_name,
  status: dto.status,
  remarks: dto.remarks,
});

export const mapAttendanceRecordToDomain = (dto: AttendanceRecordDTO): AttendanceRecord => ({
  id: dto.id,
  classId: dto.class_id,
  className: dto.class_name,
  date: new Date(dto.date),
  lectureId: dto.lecture_id,
  lectureTitle: dto.lecture_title,
  students: dto.students.map(mapStudentAttendanceToDomain),
  submittedBy: dto.submitted_by,
  submittedAt: dto.submitted_at ? new Date(dto.submitted_at) : undefined,
  createdAt: new Date(dto.created_at),
  updatedAt: new Date(dto.updated_at),
});

// Map Domain Model to API DTO (snake_case)
export const mapStudentAttendanceToDTO = (model: StudentAttendance): StudentAttendanceDTO => ({
  student_id: model.studentId,
  student_name: model.studentName,
  status: model.status,
  remarks: model.remarks,
});

export const mapMarkAttendanceToDTO = (data: MarkAttendanceData): MarkAttendanceDTO => ({
  date: data.date,
  students: data.students.map((student) => ({
    studentId: student.studentId,
    status: student.status,
    remarks: student.remarks,
  })),
  lectureId: data.lectureId,
});

// Map API Response (camelCase with _id) to Domain Model
export const mapStudentAttendanceApiToDomain = (api: StudentAttendanceApiDTO): StudentAttendance => ({
  studentId: api.studentId,
  studentName: api.studentName,
  status: api.status,
  remarks: api.remarks,
});

export const mapAttendanceRecordApiToDomain = (api: AttendanceRecordApiDTO): AttendanceRecord => ({
  id: api._id,
  classId: api.classId,
  className: api.className,
  date: new Date(api.date),
  lectureId: api.lectureId,
  lectureTitle: api.lectureTitle,
  students: (api.students || []).map(mapStudentAttendanceApiToDomain),
  submittedBy: api.submittedBy,
  submittedAt: api.submittedAt ? new Date(api.submittedAt) : undefined,
  createdAt: new Date(api.createdAt),
  updatedAt: new Date(api.updatedAt),
});

