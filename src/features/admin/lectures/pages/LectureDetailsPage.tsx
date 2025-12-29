/**
 * LectureDetailsPage Component
 * Displays comprehensive lecture details including teacher and class information
 */

import { useParams, useNavigate } from 'react-router-dom';
import { useLectureDetails } from '../hooks/useLectureDetails';
import { useClassDetails } from '../../classes/hooks/useClassDetails';

export const LectureDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: lectureData, isLoading, error } = useLectureDetails(id || '');

  // Fetch class details if classId exists
  const { data: classData } = useClassDetails(lectureData?.classId || '');

  if (isLoading) {
    return (
      <div className="p-4 lg:p-6">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-gray-600">Loading lecture details...</p>
        </div>
      </div>
    );
  }

  if (error || !lectureData) {
    return (
      <div className="p-4 lg:p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-red-800">
            <i className="fas fa-exclamation-circle"></i>
            <span className="font-medium">Error loading lecture details</span>
          </div>
          <p className="mt-2 text-sm text-red-600">
            {error instanceof Error ? error.message : 'Lecture not found or failed to load'}
          </p>
          <button
            onClick={() => navigate('/admin/lectures')}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Back to Lectures
          </button>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    navigate(`/admin/lectures`, { state: { editLectureId: lectureData.id } });
  };

  return (
    <div className="p-4 lg:p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/admin/lectures')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Back to Lectures"
            >
              <i className="fas fa-arrow-left text-gray-600"></i>
            </button>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{lectureData.title}</h1>
              <p className="text-sm text-gray-600 mt-1">Lecture Details</p>
            </div>
          </div>
        </div>
        <button
          onClick={handleEdit}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
        >
          <i className="fas fa-edit"></i>
          <span>Edit Lecture</span>
        </button>
      </div>

      <div className="space-y-6">
        {/* Basic Information Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <i className="fas fa-info-circle text-indigo-600"></i>
            <span>Basic Information</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">Title</label>
              <p className="mt-1 text-sm text-gray-900">{lectureData.title}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">Subject</label>
              <p className="mt-1 text-sm text-gray-900">{lectureData.subject}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">Type</label>
              <p className="mt-1">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  {lectureData.type.charAt(0).toUpperCase() + lectureData.type.slice(1)}
                </span>
              </p>
            </div>
            {lectureData.description && (
              <div className="md:col-span-2 lg:col-span-3">
                <label className="text-xs font-medium text-gray-500 uppercase">Description</label>
                <p className="mt-1 text-sm text-gray-900">{lectureData.description}</p>
              </div>
            )}
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">Duration</label>
              <p className="mt-1 text-sm text-gray-900">{lectureData.duration} minutes</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">Status</label>
              <p className="mt-1">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    lectureData.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {lectureData.isActive ? 'Active' : 'Inactive'}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Teacher Information Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <i className="fas fa-chalkboard-teacher text-indigo-600"></i>
            <span>Teacher Information</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">Name</label>
              <p className="mt-1 text-sm text-gray-900">
                {lectureData.teacher.firstName} {lectureData.teacher.lastName}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">Email</label>
              <p className="mt-1 text-sm text-gray-900">{lectureData.teacher.email}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">Teacher ID</label>
              <p className="mt-1 text-sm text-gray-900">{lectureData.teacher.teacherId}</p>
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
              <label className="text-xs font-medium text-gray-500 uppercase">Day of Week</label>
              <p className="mt-1 text-sm text-gray-900">{lectureData.schedule.dayOfWeek}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">Start Time</label>
              <p className="mt-1 text-sm text-gray-900">{lectureData.schedule.startTime}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">End Time</label>
              <p className="mt-1 text-sm text-gray-900">{lectureData.schedule.endTime}</p>
            </div>
            {lectureData.schedule.room && (
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Room</label>
                <p className="mt-1 text-sm text-gray-900">{lectureData.schedule.room}</p>
              </div>
            )}
          </div>
        </div>

        {/* Class Information Card */}
        {lectureData.classId && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <i className="fas fa-chalkboard text-indigo-600"></i>
              <span>Assigned Class</span>
            </h2>
            {classData ? (
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
            ) : (
              <div className="text-sm text-gray-600">
                <p>Class ID: {lectureData.classId}</p>
                <p className="text-xs text-gray-500 mt-1">Class details loading...</p>
              </div>
            )}
          </div>
        )}

        {/* Materials Section */}
        {lectureData.materials && lectureData.materials.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <i className="fas fa-paperclip text-indigo-600"></i>
              <span>Lecture Materials ({lectureData.materials.length})</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lectureData.materials.map((material, idx) => (
                <div key={idx} className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-sm transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-900">{material.name}</h4>
                      <div className="mt-2 space-y-1 text-xs text-gray-600">
                        <div className="flex items-center space-x-2">
                          <i className="fas fa-tag w-4"></i>
                          <span>Type: {material.type}</span>
                        </div>
                        {material.url && (
                          <div className="flex items-center space-x-2">
                            <i className="fas fa-link w-4"></i>
                            <a
                              href={material.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:text-indigo-700 underline"
                            >
                              View Material
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600">
            <div>
              <span className="font-medium">Created:</span>{' '}
              {lectureData.createdAt ? new Date(lectureData.createdAt).toLocaleString() : 'N/A'}
            </div>
            <div>
              <span className="font-medium">Last Updated:</span>{' '}
              {lectureData.updatedAt ? new Date(lectureData.updatedAt).toLocaleString() : 'N/A'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

