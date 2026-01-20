/**
 * Timetable Domain Models
 */

export interface TimetableSlot {
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

export interface DaySchedule {
  day: number; // 0-6 (Sunday-Saturday)
  dayName: string; // "Monday", "Tuesday", etc.
  date: Date; // Specific date for this day
  slots: TimetableSlot[];
}

export interface WeeklyTimetable {
  weekStartDate: Date; // Start of the week (Monday)
  weekEndDate: Date; // End of the week (Sunday)
  days: DaySchedule[];
}

