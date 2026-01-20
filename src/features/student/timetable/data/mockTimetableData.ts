/**
 * Mock Timetable Data
 * Comprehensive weekly schedule data for testing
 */

import type { WeeklyTimetable, TimetableSlot, DaySchedule } from '../models/timetable.model';

// Helper to get start of week (Monday)
const getStartOfWeek = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(d.setDate(diff));
};

// Helper to get end of week (Sunday)
const getEndOfWeek = (date: Date): Date => {
  const start = getStartOfWeek(date);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return end;
};

// Helper to get date for a specific day of week in a given week
const getDateForDayOfWeek = (weekStart: Date, dayOfWeek: number): Date => {
  const date = new Date(weekStart);
  // dayOfWeek: 0=Sunday, 1=Monday, etc.
  // weekStart is Monday (day 1), so:
  // Monday (1) = +0, Tuesday (2) = +1, ..., Sunday (0) = +6
  const offset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  date.setDate(date.getDate() + offset);
  return date;
};

// Generate mock timetable slots for a week
const generateMockSlots = (): TimetableSlot[] => {
  const slots: TimetableSlot[] = [
    // Monday
    {
      id: '1',
      subject: 'Mathematics',
      subjectCode: 'MATH101',
      teacher: {
        id: 't1',
        name: 'Mr. John Smith',
        email: 'john.smith@school.com',
      },
      startTime: '09:00',
      endTime: '10:00',
      dayOfWeek: 1, // Monday
      room: 'Room 101',
      classId: 'c1',
      lectureId: 'l1',
      type: 'lecture',
    },
    {
      id: '2',
      subject: 'Science',
      subjectCode: 'SCI101',
      teacher: {
        id: 't2',
        name: 'Ms. Sarah Johnson',
        email: 'sarah.johnson@school.com',
      },
      startTime: '10:15',
      endTime: '11:15',
      dayOfWeek: 1,
      room: 'Room 205',
      classId: 'c1',
      lectureId: 'l2',
      type: 'lecture',
    },
    {
      id: '3',
      subject: 'English',
      subjectCode: 'ENG101',
      teacher: {
        id: 't3',
        name: 'Mr. David Brown',
        email: 'david.brown@school.com',
      },
      startTime: '11:30',
      endTime: '12:30',
      dayOfWeek: 1,
      room: 'Room 302',
      classId: 'c1',
      lectureId: 'l3',
      type: 'lecture',
    },
    // Tuesday
    {
      id: '4',
      subject: 'Mathematics',
      subjectCode: 'MATH101',
      teacher: {
        id: 't1',
        name: 'Mr. John Smith',
        email: 'john.smith@school.com',
      },
      startTime: '09:00',
      endTime: '10:00',
      dayOfWeek: 2, // Tuesday
      room: 'Room 101',
      classId: 'c1',
      lectureId: 'l4',
      type: 'lecture',
    },
    {
      id: '5',
      subject: 'History',
      subjectCode: 'HIS101',
      teacher: {
        id: 't4',
        name: 'Ms. Emily Davis',
        email: 'emily.davis@school.com',
      },
      startTime: '10:15',
      endTime: '11:15',
      dayOfWeek: 2,
      room: 'Room 401',
      classId: 'c1',
      lectureId: 'l5',
      type: 'lecture',
    },
    {
      id: '6',
      subject: 'Science Lab',
      subjectCode: 'SCI101',
      teacher: {
        id: 't2',
        name: 'Ms. Sarah Johnson',
        email: 'sarah.johnson@school.com',
      },
      startTime: '14:00',
      endTime: '16:00',
      dayOfWeek: 2,
      room: 'Lab 205',
      classId: 'c1',
      lectureId: 'l6',
      type: 'lab',
    },
    // Wednesday
    {
      id: '7',
      subject: 'English',
      subjectCode: 'ENG101',
      teacher: {
        id: 't3',
        name: 'Mr. David Brown',
        email: 'david.brown@school.com',
      },
      startTime: '09:00',
      endTime: '10:00',
      dayOfWeek: 3, // Wednesday
      room: 'Room 302',
      classId: 'c1',
      lectureId: 'l7',
      type: 'lecture',
    },
    {
      id: '8',
      subject: 'Mathematics Tutorial',
      subjectCode: 'MATH101',
      teacher: {
        id: 't1',
        name: 'Mr. John Smith',
        email: 'john.smith@school.com',
      },
      startTime: '10:15',
      endTime: '11:15',
      dayOfWeek: 3,
      room: 'Room 101',
      classId: 'c1',
      lectureId: 'l8',
      type: 'tutorial',
    },
    {
      id: '9',
      subject: 'Physical Education',
      subjectCode: 'PE101',
      teacher: {
        id: 't5',
        name: 'Mr. Mike Wilson',
        email: 'mike.wilson@school.com',
      },
      startTime: '14:00',
      endTime: '15:00',
      dayOfWeek: 3,
      room: 'Gymnasium',
      classId: 'c1',
      lectureId: 'l9',
      type: 'lecture',
    },
    // Thursday
    {
      id: '10',
      subject: 'Science',
      subjectCode: 'SCI101',
      teacher: {
        id: 't2',
        name: 'Ms. Sarah Johnson',
        email: 'sarah.johnson@school.com',
      },
      startTime: '09:00',
      endTime: '10:00',
      dayOfWeek: 4, // Thursday
      room: 'Room 205',
      classId: 'c1',
      lectureId: 'l10',
      type: 'lecture',
    },
    {
      id: '11',
      subject: 'History',
      subjectCode: 'HIS101',
      teacher: {
        id: 't4',
        name: 'Ms. Emily Davis',
        email: 'emily.davis@school.com',
      },
      startTime: '10:15',
      endTime: '11:15',
      dayOfWeek: 4,
      room: 'Room 401',
      classId: 'c1',
      lectureId: 'l11',
      type: 'lecture',
    },
    // Friday
    {
      id: '12',
      subject: 'English',
      subjectCode: 'ENG101',
      teacher: {
        id: 't3',
        name: 'Mr. David Brown',
        email: 'david.brown@school.com',
      },
      startTime: '09:00',
      endTime: '10:00',
      dayOfWeek: 5, // Friday
      room: 'Room 302',
      classId: 'c1',
      lectureId: 'l12',
      type: 'lecture',
    },
    {
      id: '13',
      subject: 'Mathematics',
      subjectCode: 'MATH101',
      teacher: {
        id: 't1',
        name: 'Mr. John Smith',
        email: 'john.smith@school.com',
      },
      startTime: '10:15',
      endTime: '11:15',
      dayOfWeek: 5,
      room: 'Room 101',
      classId: 'c1',
      lectureId: 'l13',
      type: 'lecture',
    },
  ];

  return slots;
};

// Generate mock weekly timetable
export const generateMockWeeklyTimetable = (date: Date = new Date()): WeeklyTimetable => {
  const weekStart = getStartOfWeek(date);
  const weekEnd = getEndOfWeek(date);
  const slots = generateMockSlots();

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const days: DaySchedule[] = [];

  // Generate days from Monday (1) to Sunday (0, which is 7 in our loop)
  for (let dayOfWeek = 1; dayOfWeek <= 7; dayOfWeek++) {
    const actualDayOfWeek = dayOfWeek === 7 ? 0 : dayOfWeek; // Convert 7 to 0 (Sunday)
    const dateForDay = getDateForDayOfWeek(weekStart, actualDayOfWeek);
    const daySlots = slots.filter((slot) => slot.dayOfWeek === actualDayOfWeek);

    days.push({
      day: actualDayOfWeek,
      dayName: dayNames[actualDayOfWeek],
      date: dateForDay,
      slots: daySlots.sort((a, b) => a.startTime.localeCompare(b.startTime)),
    });
  }

  return {
    weekStartDate: weekStart,
    weekEndDate: weekEnd,
    days,
  };
};

// Export default mock data for current week
export const mockWeeklyTimetable = generateMockWeeklyTimetable();

