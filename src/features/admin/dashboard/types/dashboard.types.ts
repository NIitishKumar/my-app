/**
 * Dashboard Domain Types
 */

// Quick Stats
export interface QuickStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  totalLectures: number;
  totalEnrolled: number;
}

// Overview
export interface Overview {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  totalLectures: number;
}

// Student Stats
export interface GenderBreakdown {
  gender: string;
  count: number;
}

export interface RecentStudent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  studentId: string;
  grade: string;
  createdAt: Date;
}

export interface StudentStats {
  total: number;
  byGender: GenderBreakdown[];
  recent: RecentStudent[];
}

// Teacher Stats
export interface DepartmentBreakdown {
  department: string;
  count: number;
}

export interface TeacherStats {
  total: number;
  byDepartment: DepartmentBreakdown[];
}

// Class Stats
export interface GradeBreakdown {
  grade: string;
  count: number;
}

export interface RecentClass {
  id: string;
  className: string;
  grade: string;
  roomNo: string;
  capacity: number;
  enrolled: number;
  createdAt: Date;
}

export interface Enrollment {
  totalCapacity: number;
  totalEnrolled: number;
  availableSlots: number;
}

export interface ClassStats {
  total: number;
  byGrade: GradeBreakdown[];
  averageCapacity: number;
  averageEnrolled: number;
  enrollment: Enrollment;
  recent: RecentClass[];
}

// Lecture Stats
export interface TypeBreakdown {
  type: string;
  count: number;
}

export interface SubjectBreakdown {
  subject: string;
  count: number;
}

export interface TeacherInfo {
  firstName: string;
  lastName: string;
  email: string;
  teacherId: string;
}

export interface Schedule {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  room: string;
}

export interface UpcomingLecture {
  id: string;
  title: string;
  subject: string;
  teacher: TeacherInfo;
  schedule: Schedule;
  duration: number;
  type: string;
}

export interface LectureStats {
  total: number;
  byType: TypeBreakdown[];
  bySubject: SubjectBreakdown[];
  upcoming: UpcomingLecture[];
}

// Complete Dashboard Stats
export interface DashboardStats {
  overview: Overview;
  students: StudentStats;
  teachers: TeacherStats;
  classes: ClassStats;
  lectures: LectureStats;
}

