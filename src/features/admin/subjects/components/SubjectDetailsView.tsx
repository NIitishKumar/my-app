/**
 * SubjectDetailsView Component - Read-only version
 */

import { useParams, useNavigate } from 'react-router-dom';
import { useSubjectView } from '../hooks/useSubjectView';
import { useClasses } from '../../classes/hooks/useClasses';
import { formatPrice, formatDate } from '../utils/subjects.utils';

// Component to display a single class
const ClassDetailItem = ({ classId }: { classId: string }) => {
  const { data: allClasses } = useClasses();
  const classes = allClasses || [];
  const classItem = classes.find((cls) => cls.id === classId);

  if (!classItem) {
    return (
      <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
        <p className="text-sm text-gray-600">Class not found (ID: {classId})</p>
      </div>
    );
  }

  return (
    <div className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-900">{classItem.className}</h4>
          <div className="mt-2 space-y-1 text-xs text-gray-600">
            <div className="flex items-center space-x-2">
              <i className="fas fa-graduation-cap w-4"></i>
              <span>Grade: {classItem.grade}</span>
            </div>
            {classItem.section && (
              <div className="flex items-center space-x-2">
                <i className="fas fa-layer-group w-4"></i>
                <span>Section: {classItem.section}</span>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <i className="fas fa-door-open w-4"></i>
              <span>Room: {classItem.roomNo}</span>
            </div>
            <div className="flex items-center space-x-2">
              <i className="fas fa-users w-4"></i>
              <span>
                Students: {classItem.enrolled} / {classItem.capacity}
              </span>
            </div>
          </div>
        </div>
        <div className="ml-4">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              classItem.isActive
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {classItem.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
    </div>
  );
};

interface SubjectDetailsViewProps {
  backPath: string;
  backLabel?: string;
}

export const SubjectDetailsView = ({ backPath, backLabel = 'Back to Subjects' }: SubjectDetailsViewProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: subject, isLoading, error } = useSubjectView(id || '');

  if (isLoading) {
    return (
      <div className="p-4 lg:p-6">
        <div className="text-center">Loading subject details...</div>
      </div>
    );
  }

  if (error || !subject) {
    return (
      <div className="p-4 lg:p-6">
        <div className="text-center text-red-600">
          {error instanceof Error ? error.message : 'Subject not found'}
        </div>
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate(backPath)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            {backLabel}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(backPath)}
          className="text-indigo-600 hover:text-indigo-800 flex items-center space-x-2 mb-4"
        >
          <i className="fas fa-arrow-left"></i>
          <span>{backLabel}</span>
        </button>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">{subject.name}</h1>
          <p className="text-sm text-gray-600">Subject Details</p>
        </div>
      </div>

      {/* Subject Details */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>

            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">Subject Name</label>
              <p className="mt-1 text-sm text-gray-900">{subject.name}</p>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">Author</label>
              <p className="mt-1 text-sm text-gray-900">{subject.author}</p>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">Price</label>
              <p className="mt-1 text-sm font-semibold text-gray-900">{formatPrice(subject.price)}</p>
            </div>

            {subject.description && (
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Description</label>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{subject.description}</p>
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">Status</label>
              <p className="mt-1">
                <span
                  className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    subject.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {subject.isActive ? 'Active' : 'Inactive'}
                </span>
              </p>
            </div>
          </div>

          {/* Metadata */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Metadata</h3>

            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">Created At</label>
              <p className="mt-1 text-sm text-gray-900">{formatDate(subject.createdAt)}</p>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">Last Updated</label>
              <p className="mt-1 text-sm text-gray-900">{formatDate(subject.updatedAt)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Associated Classes */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Associated Classes</h3>
        {subject.classes && subject.classes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subject.classes.map((classId) => (
              <ClassDetailItem key={classId} classId={classId} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <i className="fas fa-inbox text-gray-400 text-4xl mb-3"></i>
            <p className="text-sm font-medium text-gray-900">No classes associated</p>
            <p className="text-xs text-gray-500 mt-1">This subject is not linked to any classes</p>
          </div>
        )}
      </div>
    </div>
  );
};

