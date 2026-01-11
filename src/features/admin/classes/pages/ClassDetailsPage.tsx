/**
 * ClassDetailsPage Component
 * Displays comprehensive class details including students and lectures
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useClassDetails } from '../hooks/useClassDetails';
import { useStudentDetails } from '../../students/hooks/useStudentDetails';
import { useLectureDetails } from '../../lectures/hooks/useLectureDetails';
import { AttendanceTab } from '../attendance/components/AttendanceTab';
import { formatDateForInput } from '../utils/classes.utils';

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
            {student.phone && (
              <div className="flex items-center space-x-2">
                <i className="fas fa-phone w-4"></i>
                <span>{student.phone}</span>
              </div>
            )}
            {student.enrolledAt && (
              <div className="flex items-center space-x-2">
                <i className="fas fa-calendar w-4"></i>
                <span>Enrolled: {new Date(student.enrolledAt).toLocaleDateString()}</span>
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
              <i className="fas fa-chalkboard-teacher w-4"></i>
              <span>
                Teacher: {lecture.teacher.firstName} {lecture.teacher.lastName}
              </span>
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
            <div className="flex items-center space-x-2">
              <i className="fas fa-tag w-4"></i>
              <span>Type: {lecture.type}</span>
            </div>
            {lecture.materials && lecture.materials.length > 0 && (
              <div className="flex items-start space-x-2 mt-2">
                <i className="fas fa-paperclip w-4 mt-0.5"></i>
                <div>
                  <span className="font-medium">Materials:</span>
                  <ul className="mt-1 space-y-1">
                    {lecture.materials.map((material, idx) => (
                      <li key={idx} className="text-xs">
                        • {material.name} ({material.type})
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
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

export const ClassDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'lectures' | 'attendance'>('overview');
  const { data: classData, isLoading, error } = useClassDetails(id || '');

  if (isLoading) {
    return (
      <div className="p-4 lg:p-6">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-gray-600">Loading class details...</p>
        </div>
      </div>
    );
  }

  if (error || !classData) {
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
            onClick={() => navigate('/admin/classes')}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Back to Classes
          </button>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    navigate(`/admin/classes`, { state: { editClassId: classData.id } });
  };

  return (
    <div className="p-4 lg:p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/admin/classes')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Back to Classes"
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
          onClick={handleEdit}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
        >
          <i className="fas fa-edit"></i>
          <span>Edit Class</span>
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
            onClick={() => setActiveTab('lectures')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'lectures'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <i className="fas fa-chalkboard mr-2"></i>
            Lectures ({classData.lectures.length})
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
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'attendance' ? (
        <AttendanceTab classId={id || ''} className={classData.className} />
      ) : (
        <div className="space-y-6">
          {/* Basic Information Card */}
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

        {/* Class Head Information Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <i className="fas fa-user-tie text-indigo-600"></i>
            <span>Class Head</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">Name</label>
              <p className="mt-1 text-sm text-gray-900">
                {classData.classHead.firstName} {classData.classHead.lastName}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">Email</label>
              <p className="mt-1 text-sm text-gray-900">{classData.classHead.email}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">Employee ID</label>
              <p className="mt-1 text-sm text-gray-900">{classData.classHead.employeeId}</p>
            </div>
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

        {/* Students Section - Only show in overview or students tab */}
        {(activeTab === 'overview' || activeTab === 'students') && (
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

        {/* Lectures Section - Only show in overview or lectures tab */}
        {(activeTab === 'overview' || activeTab === 'lectures') && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <i className="fas fa-chalkboard text-indigo-600"></i>
              <span>Assigned Lectures ({classData.lectures.length})</span>
            </h2>
            {classData.lectures.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <i className="fas fa-chalkboard-teacher text-4xl mb-3 text-gray-400"></i>
                <p>No lectures assigned to this class.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {classData.lectures.map((lectureId) => (
                  <LectureDetailItem key={lectureId} lectureId={lectureId} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Metadata */}
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600">
            <div>
              <span className="font-medium">Created:</span>{' '}
              {classData.createdAt ? new Date(classData.createdAt).toLocaleString() : 'N/A'}
            </div>
            <div>
              <span className="font-medium">Last Updated:</span>{' '}
              {classData.updatedAt ? new Date(classData.updatedAt).toLocaleString() : 'N/A'}
            </div>
          </div>
        </div>
        </div>
      )}
    </div>
  );
};

