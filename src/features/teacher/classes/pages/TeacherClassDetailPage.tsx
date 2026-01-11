/**
 * TeacherClassDetailPage Component
 * Class detail page for teachers with tabs for Overview, Students, Attendance, Statistics
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTeacherClassDetails } from '../hooks/useTeacherClassDetails';
import { useStudentDetails } from '../../../admin/students/hooks/useStudentDetails';
import { useLectureDetails } from '../../../admin/lectures/hooks/useLectureDetails';
import { TeacherAttendanceTab } from '../components/TeacherAttendanceTab';
import { formatDateForInput } from '../../../admin/classes/utils/classes.utils';

// Component to fetch and display a single student
const StudentDetailItem = ({ studentId }: { studentId: string }) => {
  const { data: student, isLoading, error } = useStudentDetails(studentId);

  if (isLoading) {
    return (
      <div className="p-3 border border-gray-200 rounded-lg animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="p-3 border border-gray-200 rounded-lg bg-red-50">
        <p className="text-sm text-red-600">Student not found (ID: {studentId})</p>
      </div>
    );
  }

  return (
    <div className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-900">
            {student.firstName} {student.lastName}
          </h4>
          <div className="mt-2 space-y-1 text-xs text-gray-600">
            <div className="flex items-center space-x-2">
              <i className="fas fa-id-card w-4"></i>
              <span>ID: {student.studentId}</span>
            </div>
            <div className="flex items-center space-x-2">
              <i className="fas fa-envelope w-4"></i>
              <span>{student.email}</span>
            </div>
            {student.age && (
              <div className="flex items-center space-x-2">
                <i className="fas fa-birthday-cake w-4"></i>
                <span>Age: {student.age}</span>
              </div>
            )}
            {student.grade && (
              <div className="flex items-center space-x-2">
                <i className="fas fa-graduation-cap w-4"></i>
                <span>Grade: {student.grade}</span>
              </div>
            )}
          </div>
        </div>
        <div className="ml-4">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              student.isActive
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {student.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
    </div>
  );
};

// Component to fetch and display a single lecture
const LectureDetailItem = ({ lectureId }: { lectureId: string }) => {
  const { data: lecture, isLoading, error } = useLectureDetails(lectureId);

  if (isLoading) {
    return (
      <div className="p-3 border border-gray-200 rounded-lg animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (error || !lecture) {
    return (
      <div className="p-3 border border-gray-200 rounded-lg bg-red-50">
        <p className="text-sm text-red-600">Lecture not found (ID: {lectureId})</p>
      </div>
    );
  }

  return (
    <div className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-900">{lecture.title}</h4>
          {lecture.description && (
            <p className="mt-1 text-xs text-gray-600">{lecture.description}</p>
          )}
          <div className="mt-3 space-y-1 text-xs text-gray-600">
            <div className="flex items-center space-x-2">
              <i className="fas fa-book w-4"></i>
              <span>Subject: {lecture.subject}</span>
            </div>
            <div className="flex items-center space-x-2">
              <i className="fas fa-calendar-day w-4"></i>
              <span>
                Schedule: {lecture.schedule.dayOfWeek} {lecture.schedule.startTime} - {lecture.schedule.endTime}
              </span>
            </div>
            {lecture.schedule.room && (
              <div className="flex items-center space-x-2">
                <i className="fas fa-door-open w-4"></i>
                <span>Room: {lecture.schedule.room}</span>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <i className="fas fa-clock w-4"></i>
              <span>Duration: {lecture.duration} minutes</span>
            </div>
          </div>
        </div>
        <div className="ml-4">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              lecture.isActive
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {lecture.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
    </div>
  );
};

export const TeacherClassDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'attendance' | 'statistics'>('overview');
  const { data: classData, isLoading, error } = useTeacherClassDetails(id || '');

  if (isLoading) {
    return (
      <div className="p-4 lg:p-6">
        <div className="space-y-6 animate-pulse">
          {/* Header skeleton */}
          <div className="h-10 bg-gray-200 rounded w-1/3 mb-4"></div>
          {/* Tabs skeleton */}
          <div className="h-12 bg-gray-200 rounded mb-6"></div>
          {/* Content skeleton */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !classData) {
    const errorStatus = (error as any)?.status;
    
    if (errorStatus === 403) {
      return (
        <div className="p-4 lg:p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center space-x-2 text-red-800 mb-3">
              <i className="fas fa-lock text-2xl"></i>
              <span className="font-medium text-lg">Access Denied</span>
            </div>
            <p className="text-sm text-red-700 mb-4">
              You are not assigned to this class. You can only view classes assigned to you.
            </p>
            <button
              onClick={() => navigate('/teacher/classes')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Back to My Classes
            </button>
          </div>
        </div>
      );
    }
    
    return (
      <div className="p-4 lg:p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-red-800">
            <i className="fas fa-exclamation-circle"></i>
            <span className="font-medium">Error loading class details</span>
          </div>
          <p className="mt-2 text-sm text-red-600">
            {error instanceof Error ? error.message : 'Class not found or failed to load'}
          </p>
          <button
            onClick={() => navigate('/teacher/classes')}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Back to My Classes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/teacher/classes')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Back to My Classes"
            >
              <i className="fas fa-arrow-left text-gray-600"></i>
            </button>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{classData.className}</h1>
              <p className="text-sm text-gray-600 mt-1">Class Details</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate(`/teacher/classes/${id}/attendance?action=mark`)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
        >
          <i className="fas fa-clipboard-check"></i>
          <span>Mark Attendance</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'overview'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <i className="fas fa-info-circle mr-2"></i>
            Overview
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'students'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <i className="fas fa-user-graduate mr-2"></i>
            Students ({classData.students.length})
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'attendance'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <i className="fas fa-clipboard-check mr-2"></i>
            Attendance
          </button>
          <button
            onClick={() => setActiveTab('statistics')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'statistics'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <i className="fas fa-chart-bar mr-2"></i>
            Statistics
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'attendance' ? (
        <TeacherAttendanceTab classId={id || ''} />
      ) : activeTab === 'statistics' ? (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Class Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-indigo-50 rounded-lg">
                <div className="text-sm text-indigo-600 font-medium mb-1">Total Students</div>
                <div className="text-2xl font-bold text-indigo-900">{classData.enrolled}</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-sm text-green-600 font-medium mb-1">Capacity</div>
                <div className="text-2xl font-bold text-green-900">{classData.capacity}</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-600 font-medium mb-1">Attendance Rate</div>
                <div className="text-2xl font-bold text-blue-900">
                  {classData.attendanceRate != null && !isNaN(classData.attendanceRate) 
                    ? `${classData.attendanceRate.toFixed(1)}%` 
                    : 'N/A'}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Statistics</h3>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                Detailed attendance statistics and charts will be displayed here.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Basic Information Card */}
          {(activeTab === 'overview' || activeTab === 'students') && (
            <>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <i className="fas fa-info-circle text-indigo-600"></i>
                  <span>Basic Information</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Class Name</label>
                    <p className="mt-1 text-sm text-gray-900">{classData.className}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Grade</label>
                    <p className="mt-1 text-sm text-gray-900">{classData.grade}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Room Number</label>
                    <p className="mt-1 text-sm text-gray-900">{classData.roomNo}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Capacity</label>
                    <p className="mt-1 text-sm text-gray-900">{classData.capacity} students</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Enrolled</label>
                    <p className="mt-1 text-sm text-gray-900">{classData.enrolled} students</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Status</label>
                    <p className="mt-1">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          classData.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {classData.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </p>
                  </div>
                  {classData.subjects && classData.subjects.length > 0 && (
                    <div className="md:col-span-2 lg:col-span-3">
                      <label className="text-xs font-medium text-gray-500 uppercase">Subjects</label>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {classData.subjects.map((subject, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                          >
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Schedule Information Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <i className="fas fa-calendar-alt text-indigo-600"></i>
                  <span>Schedule</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Academic Year</label>
                    <p className="mt-1 text-sm text-gray-900">{classData.schedule.academicYear}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Semester</label>
                    <p className="mt-1 text-sm text-gray-900">{classData.schedule.semester}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Start Date</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {formatDateForInput(classData.schedule.startDate)}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">End Date</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {formatDateForInput(classData.schedule.endDate)}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Students Section */}
          {activeTab === 'students' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <i className="fas fa-user-graduate text-indigo-600"></i>
                <span>Enrolled Students ({classData.students.length})</span>
              </h2>
              {classData.students.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <i className="fas fa-user-slash text-4xl mb-3 text-gray-400"></i>
                  <p>No students enrolled in this class.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {classData.students.map((studentId) => (
                    <StudentDetailItem key={studentId} studentId={studentId} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Lectures Section - Only in overview */}
          {activeTab === 'overview' && classData.lectures.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <i className="fas fa-chalkboard text-indigo-600"></i>
                <span>Assigned Lectures ({classData.lectures.length})</span>
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {classData.lectures.map((lectureId) => (
                  <LectureDetailItem key={lectureId} lectureId={lectureId} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

