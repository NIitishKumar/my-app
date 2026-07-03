/**
 * Dashboard API DTOs
 */

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

// Quick Stats DTO
export interface QuickStatsDTO {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  totalLectures: number;
  totalEnrolled: number;
}

// Overview DTO
export interface OverviewDTO {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  totalLectures: number;
}

// Student breakdown DTO
export interface GenderBreakdownDTO {
  _id: string;
  count: number;
}

export interface RecentStudentDTO {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  studentId: string;
  grade: string;
  createdAt: string;
}

export interface StudentStatsDTO {
  total: number;
  byGender: GenderBreakdownDTO[];
  recent: RecentStudentDTO[];
}

// Teacher breakdown DTO
export interface DepartmentBreakdownDTO {
  _id: string;
  count: number;
}

export interface TeacherStatsDTO {
  total: number;
  byDepartment: DepartmentBreakdownDTO[];
}

// Class breakdown DTO
export interface GradeBreakdownDTO {
  _id: string;
  count: number;
}

export interface RecentClassDTO {
  _id: string;
  className: string;
  grade: string;
  roomNo: string;
  capacity: number;
  enrolled: number;
  createdAt: string;
}

export interface EnrollmentDTO {
  totalCapacity: number;
  totalEnrolled: number;
  availableSlots: number;
}

export interface ClassStatsDTO {
  total: number;
  byGrade: GradeBreakdownDTO[];
  averageCapacity: string;
  averageEnrolled: string;
  enrollment: EnrollmentDTO;
  recent: RecentClassDTO[];
}

// Lecture breakdown DTO
export interface TypeBreakdownDTO {
  _id: string;
  count: number;
}

export interface SubjectBreakdownDTO {
  _id: string;
  count: number;
}

export interface TeacherInfoDTO {
  firstName: string;
  lastName: string;
  email: string;
  teacherId: string;
}

export interface ScheduleDTO {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  room: string;
}

export interface UpcomingLectureDTO {
  _id: string;
  title: string;
  subject: string;
  teacher?: TeacherInfoDTO | null;
  schedule?: ScheduleDTO | null;
  duration: number;
  type: string;
}

export interface LectureStatsDTO {
  total: number;
  byType: TypeBreakdownDTO[];
  bySubject: SubjectBreakdownDTO[];
  upcoming: UpcomingLectureDTO[];
}

// Complete Dashboard Stats DTO
export interface DashboardStatsDTO {
  overview: OverviewDTO;
  students: StudentStatsDTO;
  teachers: TeacherStatsDTO;
  classes: ClassStatsDTO;
  lectures: LectureStatsDTO;
}

