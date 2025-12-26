/**
 * Lectures Utility Functions
 */

import type { Lecture, CreateLectureData, LectureDTO, CreateLectureDTO } from '../types/lectures.types';
import { VALIDATION } from '../constants/lectures.constants';

/**
 * Format lecture display name
 */
export const formatLectureName = (lecture: Lecture): string => {
  return `${lecture.title} - ${lecture.subject}`;
};

/**
 * Sort lectures by title
 */
export const sortLectures = (lectures: Lecture[]): Lecture[] => {
  return [...lectures].sort((a, b) => {
    return a.title.localeCompare(b.title);
  });
};

/**
 * Filter lectures by search term
 */
export const filterLectures = (lectures: Lecture[], searchTerm: string): Lecture[] => {
  const term = searchTerm.toLowerCase();
  return lectures.filter((lecture) =>
    lecture.title.toLowerCase().includes(term) ||
    lecture.subject.toLowerCase().includes(term) ||
    lecture.description?.toLowerCase().includes(term) ||
    `${lecture.teacher.firstName} ${lecture.teacher.lastName}`.toLowerCase().includes(term) ||
    lecture.teacher.email.toLowerCase().includes(term) ||
    lecture.schedule.room?.toLowerCase().includes(term)
  );
};

/**
 * Format date to YYYY-MM-DD for input fields
 */
export const formatDateForInput = (date: Date | string | undefined): string => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';
  return d.toISOString().split('T')[0];
};

/**
 * Parse date string to Date object
 */
export const parseDateFromInput = (dateString: string): Date | undefined => {
  if (!dateString) return undefined;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? undefined : date;
};

/**
 * Get default form values
 */
export const getDefaultLectureFormData = (): Partial<CreateLectureData> => {
  return {
    title: '',
    description: '',
    subject: '',
    teacher: {
      firstName: '',
      lastName: '',
      email: '',
      teacherId: '',
    },
    schedule: {
      dayOfWeek: 'Monday',
      startTime: '09:00',
      endTime: '10:00',
      room: '',
    },
    duration: 60,
    type: 'lecture',
    materials: [],
    isActive: true,
  };
};

/**
 * Map LectureDTO to Lecture
 */
export const lectureDTOToLecture = (dto: LectureDTO): Lecture => {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    subject: dto.subject,
    teacher: {
      firstName: dto.teacher.first_name,
      lastName: dto.teacher.last_name,
      email: dto.teacher.email,
      teacherId: dto.teacher.teacher_id,
    },
    schedule: {
      dayOfWeek: dto.schedule.day_of_week as Lecture['schedule']['dayOfWeek'],
      startTime: dto.schedule.start_time,
      endTime: dto.schedule.end_time,
      room: dto.schedule.room,
    },
    duration: dto.duration,
    type: dto.type as Lecture['type'],
    materials: dto.materials.map((mat) => ({
      name: mat.name,
      type: mat.type as Lecture['materials'][0]['type'],
      url: mat.url,
    })),
    isActive: dto.is_active,
    createdAt: new Date(dto.created_at),
    updatedAt: new Date(dto.updated_at),
  };
};

/**
 * Map Lecture to CreateLectureDTO
 */
export const lectureToCreateLectureDTO = (lecture: CreateLectureData): CreateLectureDTO => {
  return {
    title: lecture.title,
    description: lecture.description,
    subject: lecture.subject,
    teacher: {
      first_name: lecture.teacher.firstName,
      last_name: lecture.teacher.lastName,
      email: lecture.teacher.email.toLowerCase(),
      teacher_id: lecture.teacher.teacherId,
    },
    schedule: {
      day_of_week: lecture.schedule.dayOfWeek,
      start_time: lecture.schedule.startTime,
      end_time: lecture.schedule.endTime,
      room: lecture.schedule.room,
    },
    duration: lecture.duration,
    type: lecture.type,
    materials: lecture.materials || [],
    is_active: lecture.isActive,
  };
};

/**
 * Calculate duration from start and end time
 */
export const calculateDuration = (startTime: string, endTime: string): number => {
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  
  const startTotalMinutes = startHours * 60 + startMinutes;
  const endTotalMinutes = endHours * 60 + endMinutes;
  
  return endTotalMinutes - startTotalMinutes;
};

/**
 * Generate mock lecture data
 */
export const generateMockLectures = (): Lecture[] => {
  const titles = [
    'Introduction to Mathematics',
    'Advanced Algebra',
    'English Literature',
    'Physics Fundamentals',
    'Chemistry Basics',
    'Biology 101',
    'Computer Science Principles',
    'History of World',
    'Geography Studies',
    'Physical Education',
    'Art and Design',
    'Music Theory',
    'Economics Basics',
    'Business Management',
    'Psychology Introduction',
  ];

  const subjects = [
    'Mathematics',
    'English',
    'Science',
    'Physics',
    'Chemistry',
    'Biology',
    'Computer Science',
    'History',
    'Geography',
    'Physical Education',
    'Arts',
    'Music',
    'Economics',
    'Business Studies',
    'Psychology',
  ];

  const teachers = [
    { firstName: 'John', lastName: 'Anderson', email: 'john.anderson@school.com', teacherId: 'T001' },
    { firstName: 'Sarah', lastName: 'Miller', email: 'sarah.miller@school.com', teacherId: 'T002' },
    { firstName: 'Emily', lastName: 'Davis', email: 'emily.davis@school.com', teacherId: 'T003' },
    { firstName: 'Michael', lastName: 'Brown', email: 'michael.brown@school.com', teacherId: 'T004' },
    { firstName: 'Jessica', lastName: 'Wilson', email: 'jessica.wilson@school.com', teacherId: 'T005' },
  ];

  const daysOfWeek: Lecture['schedule']['dayOfWeek'][] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const startTimes = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00'];
  const rooms = ['Room 101', 'Room 102', 'Room 201', 'Room 202', 'Lab A', 'Lab B', 'Auditorium'];
  const types: Lecture['type'][] = ['lecture', 'lab', 'seminar', 'tutorial'];

  const mockLectures: Lecture[] = [];
  let idCounter = 1;

  // Generate 25+ lectures
  for (let i = 0; i < 25; i++) {
    const title = titles[i % titles.length];
    const subject = subjects[i % subjects.length];
    const teacher = teachers[i % teachers.length];
    const dayOfWeek = daysOfWeek[i % daysOfWeek.length];
    const startTime = startTimes[i % startTimes.length];
    const endTime = `${String(parseInt(startTime.split(':')[0]) + 1).padStart(2, '0')}:${startTime.split(':')[1]}`;
    const duration = calculateDuration(startTime, endTime);
    const room = rooms[i % rooms.length];
    const type = types[i % types.length];
    const isActive = Math.random() > 0.2;

    mockLectures.push({
      id: `lecture-${idCounter++}`,
      title,
      description: `This is a comprehensive ${type} on ${subject} covering essential topics and concepts.`,
      subject,
      teacher: {
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        email: teacher.email,
        teacherId: teacher.teacherId,
      },
      schedule: {
        dayOfWeek,
        startTime,
        endTime,
        room,
      },
      duration,
      type,
      materials: [
        {
          name: 'Course Syllabus',
          type: 'document',
          url: `https://example.com/materials/${idCounter}/syllabus.pdf`,
        },
        {
          name: 'Introduction Slides',
          type: 'presentation',
          url: `https://example.com/materials/${idCounter}/slides.pptx`,
        },
      ],
      isActive,
      createdAt: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
      updatedAt: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
    });
  }

  return mockLectures;
};

