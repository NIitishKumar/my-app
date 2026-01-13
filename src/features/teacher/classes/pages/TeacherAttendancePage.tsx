/**
 * TeacherAttendancePage Component
 * Full-page attendance management for teachers
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useTeacherClassDetails } from '../hooks/useTeacherClassDetails';
import { TeacherAttendanceForm } from '../components/TeacherAttendanceForm';
import { AttendanceList } from '../../../admin/classes/attendance/components/AttendanceList';
import { AttendanceStats } from '../../../admin/classes/attendance/components/AttendanceStats';
import type { AttendanceRecord } from '../../../admin/classes/attendance/types/attendance.types';

export const TeacherAttendancePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'mark' | 'records' | 'stats'>('mark');
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);

  const { data: classData, isLoading: isLoadingClass, error: classError } = useTeacherClassDetails(id || '');

  // Check URL params for action
  useEffect(() => {
    const action = searchParams.get('action');
    const recordId = searchParams.get('record');
    
    if (action === 'mark') {
      setActiveTab('mark');
    } else if (recordId) {
      // Load record for editing
      setActiveTab('mark');
      // The form will handle loading the record by date
    }
  }, [searchParams]);

  if (isLoadingClass) {
    return (
      <div className="p-4 lg:p-6">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-gray-600">Loading class details...</p>
        </div>
      </div>
    );
  }

  if (classError || !classData) {
    return (
      <div className="p-4 lg:p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-red-800">
            <i className="fas fa-exclamation-circle"></i>
            <span className="font-medium">Error loading class details</span>
          </div>
          <p className="mt-2 text-sm text-red-600">
            {classError instanceof Error ? classError.message : 'Class not found or failed to load'}
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

  const handleFormSuccess = () => {
    setActiveTab('records');
    // Clear URL params
    navigate(`/teacher/classes/${id}/attendance`, { replace: true });
  };

  const handleEditRecord = (record: AttendanceRecord) => {
    setEditingRecord(record);
    setActiveTab('mark');
    navigate(`/teacher/classes/${id}/attendance?record=${record.id}`, { replace: true });
  };

  return (
    <div className="p-3 sm:p-4 lg:p-6 max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="mb-4 sm:mb-6 flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={() => navigate(`/teacher/classes/${id}`)}
              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              title="Back to Class Details"
            >
              <i className="fas fa-arrow-left text-gray-600"></i>
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
                Attendance - {classData.className}
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Manage attendance records</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4 sm:mb-6 border-b border-gray-200 overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
        <nav className="flex space-x-4 sm:space-x-8 min-w-max">
          <button
            onClick={() => setActiveTab('mark')}
            className={`py-3 sm:py-4 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
              activeTab === 'mark'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <i className="fas fa-edit mr-1.5 sm:mr-2"></i>
            Mark Attendance
          </button>
          <button
            onClick={() => setActiveTab('records')}
            className={`py-3 sm:py-4 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
              activeTab === 'records'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <i className="fas fa-list mr-1.5 sm:mr-2"></i>
            View Records
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`py-3 sm:py-4 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
              activeTab === 'stats'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <i className="fas fa-chart-bar mr-1.5 sm:mr-2"></i>
            Statistics
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'mark' && (
          <TeacherAttendanceForm
            classId={id || ''}
            initialDate={editingRecord ? new Date(editingRecord.date).toISOString().split('T')[0] : undefined}
            initialLectureId={editingRecord?.lectureId}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setEditingRecord(null);
              setActiveTab('records');
              navigate(`/teacher/classes/${id}/attendance`, { replace: true });
            }}
          />
        )}

        {activeTab === 'records' && (
          <AttendanceList classId={id || ''} onEdit={handleEditRecord} />
        )}

        {activeTab === 'stats' && <AttendanceStats classId={id || ''} />}
      </div>
    </div>
  );
};

