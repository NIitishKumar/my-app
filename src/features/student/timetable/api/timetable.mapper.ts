/**
 * Timetable Mappers
 * Maps API DTOs to domain models
 */

import type {
  TimetableSlot,
  DaySchedule,
  WeeklyTimetable,
} from '../models/timetable.model';
import type {
  TimetableSlotDTO,
  DayScheduleDTO,
  WeeklyTimetableDTO,
} from './timetable.dto';

export class TimetableMapper {
  static timetableSlotToDomain(dto: TimetableSlotDTO): TimetableSlot {
    return {
      id: dto.id,
      subject: dto.subject,
      subjectCode: dto.subjectCode,
      teacher: {
        id: dto.teacher.id,
        name: dto.teacher.name,
        email: dto.teacher.email,
      },
      startTime: dto.startTime,
      endTime: dto.endTime,
      dayOfWeek: dto.dayOfWeek,
      room: dto.room,
      classId: dto.classId,
      lectureId: dto.lectureId,
      type: dto.type,
    };
  }

  static dayScheduleToDomain(dto: DayScheduleDTO): DaySchedule {
    return {
      day: dto.day,
      dayName: dto.dayName,
      date: new Date(dto.date),
      slots: dto.slots.map(TimetableMapper.timetableSlotToDomain),
    };
  }

  static weeklyTimetableToDomain(dto: WeeklyTimetableDTO): WeeklyTimetable {
    return {
      weekStartDate: new Date(dto.weekStartDate),
      weekEndDate: new Date(dto.weekEndDate),
      days: dto.days.map(TimetableMapper.dayScheduleToDomain),
    };
  }
}

