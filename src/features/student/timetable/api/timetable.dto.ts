/**
 * Timetable API DTOs
 * Matches backend API response structure
 */

// API Response Wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

// Timetable Slot DTO
export interface TimetableSlotDTO {
  id: string;
  subject: string;
  subjectCode?: string;
  teacher: {
    id: string;
    name: string;
    email?: string;
  };
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  room: string;
  classId?: string;
  lectureId?: string;
  type?: 'lecture' | 'lab' | 'tutorial';
}

// Day Schedule DTO
export interface DayScheduleDTO {
  day: number; // 0-6 (Sunday-Saturday)
  dayName: string; // "Monday", "Tuesday", etc.
  date: string; // ISO 8601 format
  slots: TimetableSlotDTO[];
}

// Weekly Timetable DTO
export interface WeeklyTimetableDTO {
  weekStartDate: string; // ISO 8601 format
  weekEndDate: string; // ISO 8601 format
  days: DayScheduleDTO[];
}

