import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../shared/components/ProtectedRoute';
import { AdminLayout } from '../shared/layouts/AdminLayout';
import { TeacherLayout } from '../shared/layouts/TeacherLayout';
import { StudentLayout } from '../shared/layouts/StudentLayout';
import { ParentLayout } from '../shared/layouts/ParentLayout';
import { Login } from '../features/auth/pages/Login';
import { AdminDashboard } from '../features/admin/dashboard/AdminDashboard';
import { ClassesPage, ClassDetailsPage } from '../features/admin/classes';
import { AttendancePage } from '../features/admin/classes/attendance/pages/AttendancePage';
import { TeachersPage } from '../features/admin/teachers';
import { StudentsPage } from '../features/admin/students';
import { LecturesPage, LectureDetailsPage } from '../features/admin/lectures';
import { SubjectsPage, SubjectDetailsPage } from '../features/admin/subjects';
import { TeacherDashboard } from '../features/teacher/dashboard/TeacherDashboard';
import { TeacherClassesPage } from '../features/teacher/classes/pages/TeacherClassesPage';
import { TeacherClassDetailPage } from '../features/teacher/classes/pages/TeacherClassDetailPage';
import { TeacherAttendancePage } from '../features/teacher/classes/pages/TeacherAttendancePage';
import { AttendancePage as TeacherAttendance } from '../features/teacher/attendance';
import { Queries as TeacherQueries } from '../features/teacher/queries/Queries';
import { TeacherSubjectsPage, TeacherSubjectDetailsPage } from '../features/teacher/subjects';
import { StudentDashboard } from '../features/student/dashboard/StudentDashboard';
import { Exams } from '../features/student/exams/Exams';
import { Notifications } from '../features/student/notifications/Notifications';
import { Records as StudentRecords } from '../features/student/records/Records';
import { StudentSubjectsPage, StudentSubjectDetailsPage } from '../features/student/subjects';
import { ParentDashboard } from '../features/parent/dashboard/ParentDashboard';
import { Attendance as ParentAttendance } from '../features/parent/attendance/Attendance';
import { Records as ParentRecords } from '../features/parent/records/Records';
import { ParentSubjectsPage, ParentSubjectDetailsPage } from '../features/parent/subjects';
import { ROUTES, USER_ROLES } from '../shared/constants';

export const AppRoutes = () => {
  return (
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
        <Route path="exams" element={<Exams />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="records" element={<StudentRecords />} />
        <Route path="subjects" element={<StudentSubjectsPage />} />
        <Route path="subjects/:id" element={<StudentSubjectDetailsPage />} />
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
        <Route index element={<Navigate to={ROUTES.PARENT_DASHBOARD} replace />} />
      </Route>

      {/* Default redirect */}
      <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />
      <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
    </Routes>
  );
};

