/**
 * AttendancePage Component
 * Main tabbed interface for teacher attendance management
 */

import { useState } from 'react';
import { AttendanceDashboard } from '../components/AttendanceDashboard';
import { AttendanceMarkingForm } from '../components/AttendanceMarkingForm';
import { AttendanceRecordsList } from '../components/AttendanceRecordsList';
import { AttendanceStatistics } from '../components/AttendanceStatistics';
import type { AttendanceRecord } from '../types/attendance.types';

type TabType = 'dashboard' | 'mark' | 'records' | 'statistics';

export const AttendancePage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [selectedClassForMarking, setSelectedClassForMarking] = useState<string | undefined>();

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-tachometer-alt' },
    { id: 'mark', label: 'Mark Attendance', icon: 'fa-check-circle' },
    { id: 'records', label: 'Records', icon: 'fa-list' },
    { id: 'statistics', label: 'Statistics', icon: 'fa-chart-bar' },
  ];

  const handleMarkAttendance = (classId: string) => {
    setSelectedClassForMarking(classId);
    setActiveTab('mark');
  };

  const handleViewRecord = (record: AttendanceRecord) => {
    // Navigate to view/edit attendance
    console.log('View record:', record);
    // Could navigate to a detail page or open a modal
  };

  const handleEditRecord = (record: AttendanceRecord) => {
    setSelectedClassForMarking(record.classId);
    setActiveTab('mark');
    // The form should load existing attendance data
    // This could be handled by passing initial data to AttendanceMarkingForm
  };

  const handleSuccess = () => {
    // Reset form after successful submission
    setSelectedClassForMarking(undefined);
    // Optionally switch to records tab to see the new entry
    // setActiveTab('records');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Attendance Management</h1>
        <p className="text-gray-600">Manage and track student attendance for your classes</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id !== 'mark') {
                  setSelectedClassForMarking(undefined);
                }
              }}
              className={`
                ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center
              `}
            >
              <i className={`fas ${tab.icon} mr-2`}></i>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'dashboard' && (
          <AttendanceDashboard onMarkAttendance={handleMarkAttendance} />
        )}

        {activeTab === 'mark' && (
          <AttendanceMarkingForm
            initialClassId={selectedClassForMarking}
            onSuccess={handleSuccess}
            onCancel={() => {
              setSelectedClassForMarking(undefined);
              setActiveTab('dashboard');
            }}
          />
        )}

        {activeTab === 'records' && (
          <AttendanceRecordsList
            onView={handleViewRecord}
            onEdit={handleEditRecord}
          />
        )}

        {activeTab === 'statistics' && (
          <AttendanceStatistics />
        )}
      </div>
    </div>
  );
};

