/**
 * Student Mappers
 */

import type {
  Exam,
  Notification,
  AcademicRecord,
  Teacher,
} from '../models/student.model';
import type {
  ExamDTO,
  NotificationDTO,
  AcademicRecordDTO,
  TeacherDTO,
} from './student.dto';

export class StudentMapper {
  static examToDomain(dto: ExamDTO): Exam {
    return {
      id: dto.id,
      title: dto.title,
      subject: dto.subject,
      date: new Date(dto.date),
      duration: dto.duration,
      totalMarks: dto.total_marks,
      obtainedMarks: dto.obtained_marks,
      status: dto.status,
      room: dto.room,
    };
  }

  static notificationToDomain(dto: NotificationDTO): Notification {
    return {
      id: dto.id,
      title: dto.title,
      message: dto.message,
      type: dto.type,
      isRead: dto.is_read,
      createdAt: new Date(dto.created_at),
    };
  }

  static academicRecordToDomain(dto: AcademicRecordDTO): AcademicRecord {
    return {
      id: dto.id,
      subject: dto.subject,
      grade: dto.grade,
      marks: dto.marks,
      totalMarks: dto.total_marks,
      percentage: dto.percentage,
      term: dto.term,
      year: dto.year,
      remarks: dto.remarks,
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
}


