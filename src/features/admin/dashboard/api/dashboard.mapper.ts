/**
 * Dashboard Mapper
 * Transforms DTOs to domain models
 */

import type {
  QuickStatsDTO,
  DashboardStatsDTO,
  GenderBreakdownDTO,
  RecentStudentDTO,
  DepartmentBreakdownDTO,
  GradeBreakdownDTO,
  RecentClassDTO,
  EnrollmentDTO,
  TypeBreakdownDTO,
  SubjectBreakdownDTO,
  TeacherInfoDTO,
  ScheduleDTO,
  UpcomingLectureDTO,
  OverviewDTO,
  StudentStatsDTO,
  TeacherStatsDTO,
  ClassStatsDTO,
  LectureStatsDTO,
} from './dashboard.dto';

import type {
  QuickStats,
  DashboardStats,
  GenderBreakdown,
  RecentStudent,
  DepartmentBreakdown,
  GradeBreakdown,
  RecentClass,
  Enrollment,
  TypeBreakdown,
  SubjectBreakdown,
  TeacherInfo,
  Schedule,
  UpcomingLecture,
  Overview,
  StudentStats,
  TeacherStats,
  ClassStats,
  LectureStats,
} from '../types/dashboard.types';

export const DashboardMapper = {
  /**
   * Map QuickStatsDTO to QuickStats
   */
  quickStatsToDomain: (dto: QuickStatsDTO): QuickStats => ({
    totalStudents: dto.totalStudents,
    totalTeachers: dto.totalTeachers,
    totalClasses: dto.totalClasses,
    totalLectures: dto.totalLectures,
    totalEnrolled: dto.totalEnrolled,
  }),

  /**
   * Map GenderBreakdownDTO to GenderBreakdown
   */
  genderBreakdownToDomain: (dto: GenderBreakdownDTO): GenderBreakdown => ({
    gender: dto._id,
    count: dto.count,
  }),

  /**
   * Map RecentStudentDTO to RecentStudent
   */
  recentStudentToDomain: (dto: RecentStudentDTO): RecentStudent => ({
    id: dto._id,
    firstName: dto.firstName,
    lastName: dto.lastName,
    email: dto.email,
    studentId: dto.studentId,
    grade: dto.grade,
    createdAt: new Date(dto.createdAt),
  }),

  /**
   * Map StudentStatsDTO to StudentStats
   */
  studentStatsToDomain: (dto: StudentStatsDTO): StudentStats => ({
    total: dto.total,
    byGender: dto.byGender.map(DashboardMapper.genderBreakdownToDomain),
    recent: dto.recent.map(DashboardMapper.recentStudentToDomain),
  }),

  /**
   * Map DepartmentBreakdownDTO to DepartmentBreakdown
   */
  departmentBreakdownToDomain: (dto: DepartmentBreakdownDTO): DepartmentBreakdown => ({
    department: dto._id,
    count: dto.count,
  }),

  /**
   * Map TeacherStatsDTO to TeacherStats
   */
  teacherStatsToDomain: (dto: TeacherStatsDTO): TeacherStats => ({
    total: dto.total,
    byDepartment: dto.byDepartment.map(DashboardMapper.departmentBreakdownToDomain),
  }),

  /**
   * Map GradeBreakdownDTO to GradeBreakdown
   */
  gradeBreakdownToDomain: (dto: GradeBreakdownDTO): GradeBreakdown => ({
    grade: dto._id,
    count: dto.count,
  }),

  /**
   * Map RecentClassDTO to RecentClass
   */
  recentClassToDomain: (dto: RecentClassDTO): RecentClass => ({
    id: dto._id,
    className: dto.className,
    grade: dto.grade,
    roomNo: dto.roomNo,
    capacity: dto.capacity,
    enrolled: dto.enrolled,
    createdAt: new Date(dto.createdAt),
  }),

  /**
   * Map EnrollmentDTO to Enrollment
   */
  enrollmentToDomain: (dto: EnrollmentDTO): Enrollment => ({
    totalCapacity: dto.totalCapacity,
    totalEnrolled: dto.totalEnrolled,
    availableSlots: dto.availableSlots,
  }),

  /**
   * Map ClassStatsDTO to ClassStats
   */
  classStatsToDomain: (dto: ClassStatsDTO): ClassStats => ({
    total: dto.total,
    byGrade: dto.byGrade.map(DashboardMapper.gradeBreakdownToDomain),
    averageCapacity: parseFloat(dto.averageCapacity) || 0,
    averageEnrolled: parseFloat(dto.averageEnrolled) || 0,
    enrollment: DashboardMapper.enrollmentToDomain(dto.enrollment),
    recent: dto.recent.map(DashboardMapper.recentClassToDomain),
  }),

  /**
   * Map TypeBreakdownDTO to TypeBreakdown
   */
  typeBreakdownToDomain: (dto: TypeBreakdownDTO): TypeBreakdown => ({
    type: dto._id,
    count: dto.count,
  }),

  /**
   * Map SubjectBreakdownDTO to SubjectBreakdown
   */
  subjectBreakdownToDomain: (dto: SubjectBreakdownDTO): SubjectBreakdown => ({
    subject: dto._id,
    count: dto.count,
  }),

  /**
   * Map TeacherInfoDTO to TeacherInfo
   * Handles null/undefined with default values
   */
  teacherInfoToDomain: (dto: TeacherInfoDTO | null | undefined): TeacherInfo => {
    if (!dto) {
      return {
        firstName: '',
        lastName: '',
        email: '',
        teacherId: '',
      };
    }
    return {
      firstName: dto.firstName || '',
      lastName: dto.lastName || '',
      email: dto.email || '',
      teacherId: dto.teacherId || '',
    };
  },

  /**
   * Map ScheduleDTO to Schedule
   * Handles null/undefined with default values
   */
  scheduleToDomain: (dto: ScheduleDTO | null | undefined): Schedule => {
    if (!dto) {
      return {
        dayOfWeek: '',
        startTime: '',
        endTime: '',
        room: '',
      };
    }
    return {
      dayOfWeek: dto.dayOfWeek || '',
      startTime: dto.startTime || '',
      endTime: dto.endTime || '',
      room: dto.room || '',
    };
  },

  /**
   * Map UpcomingLectureDTO to UpcomingLecture
   * Handles optional teacher and schedule fields
   */
  upcomingLectureToDomain: (dto: UpcomingLectureDTO): UpcomingLecture => ({
    id: dto._id,
    title: dto.title || '',
    subject: dto.subject || '',
    teacher: DashboardMapper.teacherInfoToDomain(dto.teacher),
    schedule: DashboardMapper.scheduleToDomain(dto.schedule),
    duration: dto.duration || 0,
    type: dto.type || '',
  }),

  /**
   * Map LectureStatsDTO to LectureStats
   */
  lectureStatsToDomain: (dto: LectureStatsDTO): LectureStats => ({
    total: dto.total,
    byType: dto.byType.map(DashboardMapper.typeBreakdownToDomain),
    bySubject: dto.bySubject.map(DashboardMapper.subjectBreakdownToDomain),
    upcoming: dto.upcoming.map(DashboardMapper.upcomingLectureToDomain),
  }),

  /**
   * Map OverviewDTO to Overview
   */
  overviewToDomain: (dto: OverviewDTO): Overview => ({
    totalStudents: dto.totalStudents,
    totalTeachers: dto.totalTeachers,
    totalClasses: dto.totalClasses,
    totalLectures: dto.totalLectures,
  }),

  /**
   * Map DashboardStatsDTO to DashboardStats
   */
  dashboardStatsToDomain: (dto: DashboardStatsDTO): DashboardStats => ({
    overview: DashboardMapper.overviewToDomain(dto.overview),
    students: DashboardMapper.studentStatsToDomain(dto.students),
    teachers: DashboardMapper.teacherStatsToDomain(dto.teachers),
    classes: DashboardMapper.classStatsToDomain(dto.classes),
    lectures: DashboardMapper.lectureStatsToDomain(dto.lectures),
  }),
};

