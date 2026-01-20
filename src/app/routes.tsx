import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../shared/components/ProtectedRoute';
import { AdminLayout } from '../shared/layouts/AdminLayout';
import { TeacherLayout } from '../shared/layouts/TeacherLayout';
import { StudentLayout } from '../shared/layouts/StudentLayout';
import { ParentLayout } from '../shared/layouts/ParentLayout';
import { DashboardStatsSkeleton } from '../shared/components/skeletons';
import { ROUTES, USER_ROLES } from '../shared/constants';

// Lazy load all page components
const Login = lazy(() => import('../features/auth/pages/Login').then(m => ({ default: m.Login })));
const AdminDashboard = lazy(() => import('../features/admin/dashboard/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const ClassesPage = lazy(() => import('../features/admin/classes').then(m => ({ default: m.ClassesPage })));
const ClassDetailsPage = lazy(() => import('../features/admin/classes').then(m => ({ default: m.ClassDetailsPage })));
const AttendancePage = lazy(() => import('../features/admin/classes/attendance/pages/AttendancePage').then(m => ({ default: m.AttendancePage })));
const TeachersPage = lazy(() => import('../features/admin/teachers').then(m => ({ default: m.TeachersPage })));
const StudentsPage = lazy(() => import('../features/admin/students').then(m => ({ default: m.StudentsPage })));
const LecturesPage = lazy(() => import('../features/admin/lectures').then(m => ({ default: m.LecturesPage })));
const LectureDetailsPage = lazy(() => import('../features/admin/lectures').then(m => ({ default: m.LectureDetailsPage })));
const SubjectsPage = lazy(() => import('../features/admin/subjects').then(m => ({ default: m.SubjectsPage })));
const SubjectDetailsPage = lazy(() => import('../features/admin/subjects').then(m => ({ default: m.SubjectDetailsPage })));
const NoticesListPage = lazy(() => import('../features/notices').then(m => ({ default: m.NoticesListPage })));
const CreateNoticePage = lazy(() => import('../features/notices').then(m => ({ default: m.CreateNoticePage })));
const ExamsPage = lazy(() => import('../features/admin/exams/pages/ExamsPage').then(m => ({ default: m.ExamsPage })));
const ReportsPage = lazy(() => import('../features/admin/reports/pages/ReportsPage').then(m => ({ default: m.ReportsPage })));
const SettingsPage = lazy(() => import('../features/admin/settings/pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const AdminProfilePage = lazy(() => import('../features/admin/profile').then(m => ({ default: m.AdminProfilePage })));
const TeacherDashboard = lazy(() => import('../features/teacher/dashboard/TeacherDashboard').then(m => ({ default: m.TeacherDashboard })));
const TeacherClassesPage = lazy(() => import('../features/teacher/classes/pages/TeacherClassesPage').then(m => ({ default: m.TeacherClassesPage })));
const TeacherClassDetailPage = lazy(() => import('../features/teacher/classes/pages/TeacherClassDetailPage').then(m => ({ default: m.TeacherClassDetailPage })));
const TeacherAttendancePage = lazy(() => import('../features/teacher/classes/pages/TeacherAttendancePage').then(m => ({ default: m.TeacherAttendancePage })));
const TeacherAttendance = lazy(() => import('../features/teacher/attendance').then(m => ({ default: m.AttendancePage })));
const TeacherQueries = lazy(() => import('../features/teacher/queries/Queries').then(m => ({ default: m.Queries })));
const TeacherSubjectsPage = lazy(() => import('../features/teacher/subjects').then(m => ({ default: m.TeacherSubjectsPage })));
const TeacherSubjectDetailsPage = lazy(() => import('../features/teacher/subjects').then(m => ({ default: m.TeacherSubjectDetailsPage })));
const TeacherProfilePage = lazy(() => import('../features/teacher/profile').then(m => ({ default: m.TeacherProfilePage })));
const StudentDashboard = lazy(() => import('../features/student/dashboard/StudentDashboard').then(m => ({ default: m.StudentDashboard })));
const Exams = lazy(() => import('../features/student/exams/Exams').then(m => ({ default: m.Exams })));
const Notifications = lazy(() => import('../features/student/notifications/Notifications').then(m => ({ default: m.Notifications })));
const StudentRecords = lazy(() => import('../features/student/records/Records').then(m => ({ default: m.Records })));
const StudentSubjectsPage = lazy(() => import('../features/student/subjects').then(m => ({ default: m.StudentSubjectsPage })));
const StudentSubjectDetailsPage = lazy(() => import('../features/student/subjects').then(m => ({ default: m.StudentSubjectDetailsPage })));
const StudentProfilePage = lazy(() => import('../features/student/profile').then(m => ({ default: m.StudentProfilePage })));
const StudentAttendancePage = lazy(() => import('../features/student/attendance').then(m => ({ default: m.StudentAttendancePage })));
const TimetablePage = lazy(() => import('../features/student/timetable').then(m => ({ default: m.TimetablePage })));
const ParentDashboard = lazy(() => import('../features/parent/dashboard/ParentDashboard').then(m => ({ default: m.ParentDashboard })));
const ParentAttendance = lazy(() => import('../features/parent/attendance/Attendance').then(m => ({ default: m.Attendance })));
const ParentRecords = lazy(() => import('../features/parent/records/Records').then(m => ({ default: m.Records })));
const ParentSubjectsPage = lazy(() => import('../features/parent/subjects').then(m => ({ default: m.ParentSubjectsPage })));
const ParentSubjectDetailsPage = lazy(() => import('../features/parent/subjects').then(m => ({ default: m.ParentSubjectDetailsPage })));
const ParentProfilePage = lazy(() => import('../features/parent/profile').then(m => ({ default: m.ParentProfilePage })));
const HelpSupportPage = lazy(() => import('../features/help-support').then(m => ({ default: m.HelpSupportPage })));

// Fallback component for route loading
const RouteFallback = () => (
  <div className="p-6">
    <DashboardStatsSkeleton />
  </div>
);

export const AppRoutes = () => {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        {/* Public Routes */}
        <Route path={ROUTES.LOGIN} element={<Login />} />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="classes" element={<ClassesPage />} />
          <Route path="classes/:id" element={<ClassDetailsPage />} />
          <Route path="classes/:id/attendance" element={<AttendancePage />} />
          <Route path="teachers" element={<TeachersPage />} />
          <Route path="students" element={<StudentsPage />} />
          <Route path="lectures" element={<LecturesPage />} />
          <Route path="lectures/:id" element={<LectureDetailsPage />} />
          <Route path="subjects" element={<SubjectsPage />} />
          <Route path="subjects/:id" element={<SubjectDetailsPage />} />
          <Route path="notices" element={<NoticesListPage />} />
          <Route path="notices/create" element={<CreateNoticePage />} />
          <Route path="notices/:id/edit" element={<CreateNoticePage />} />
          <Route path="exams" element={<ExamsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="profile" element={<AdminProfilePage />} />
          <Route index element={<Navigate to={ROUTES.ADMIN_DASHBOARD} replace />} />
        </Route>

        {/* Teacher Routes */}
        <Route
          path="/teacher/*"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.TEACHER]}>
              <TeacherLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="classes" element={<TeacherClassesPage />} />
          <Route path="classes/:id" element={<TeacherClassDetailPage />} />
          <Route path="classes/:id/attendance" element={<TeacherAttendancePage />} />
          <Route path="attendance" element={<TeacherAttendance />} />
          <Route path="queries" element={<TeacherQueries />} />
          <Route path="subjects" element={<TeacherSubjectsPage />} />
          <Route path="subjects/:id" element={<TeacherSubjectDetailsPage />} />
          <Route path="profile" element={<TeacherProfilePage />} />
          <Route index element={<Navigate to={ROUTES.TEACHER_DASHBOARD} replace />} />
        </Route>

        {/* Student Routes */}
        <Route
          path="/student/*"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.STUDENT]}>
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="attendance" element={<StudentAttendancePage />} />
          <Route path="timetable" element={<TimetablePage />} />
          <Route path="exams" element={<Exams />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="records" element={<StudentRecords />} />
          <Route path="subjects" element={<StudentSubjectsPage />} />
          <Route path="subjects/:id" element={<StudentSubjectDetailsPage />} />
          <Route path="profile" element={<StudentProfilePage />} />
          <Route path="help-support" element={<HelpSupportPage />} />
          <Route index element={<Navigate to={ROUTES.STUDENT_DASHBOARD} replace />} />
        </Route>

        {/* Parent Routes */}
        <Route
          path="/parent/*"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.PARENT]}>
              <ParentLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<ParentDashboard />} />
          <Route path="attendance" element={<ParentAttendance />} />
          <Route path="records" element={<ParentRecords />} />
          <Route path="subjects" element={<ParentSubjectsPage />} />
          <Route path="subjects/:id" element={<ParentSubjectDetailsPage />} />
          <Route path="profile" element={<ParentProfilePage />} />
          <Route path="help-support" element={<HelpSupportPage />} />
          <Route index element={<Navigate to={ROUTES.PARENT_DASHBOARD} replace />} />
        </Route>

        {/* Default redirect */}
        <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />
        <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
      </Routes>
    </Suspense>
  );
};