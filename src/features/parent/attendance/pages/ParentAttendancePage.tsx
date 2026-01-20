/**
 * ParentAttendancePage Component
 */

import { useState } from 'react';
import { useChildren } from '../../hooks/useParent';
import { useChildrenAttendance } from '../hooks/useChildrenAttendance';
import { useChildAttendance as useChildAttendanceHistory } from '../hooks/useChildAttendance';
import { useAttendanceComparison } from '../hooks/useAttendanceComparison';
import { ChildrenSelector, type Child } from '../components/ChildrenSelector';
import { ChildAttendanceOverview } from '../components/ChildAttendanceOverview';
import { MultiChildComparison } from '../components/MultiChildComparison';
import { AttendanceHistory } from '../../../student/attendance/components/AttendanceHistory';
import { DashboardStatsSkeleton } from '../../../../shared/components/skeletons';
import type { ChildAttendanceRecord } from '../types/attendance.types';

type TabType = 'overview' | 'history' | 'calendar' | 'statistics' | 'compare';

export const ParentAttendancePage = () => {
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Fetch children
  const { data: children = [], isLoading: isLoadingChildren } = useChildren();

  // Fetch overview for all children
  const { data: overview, isLoading: isLoadingOverview } = useChildrenAttendance();

  // Fetch selected child's attendance
  const { data: childAttendance, isLoading: isLoadingChildAttendance } = useChildAttendanceHistory(
    selectedChildId || '',
    { page: 1, limit: 50 }
  );

  // Fetch comparison if multiple children
  const { data: comparison } = useAttendanceComparison(
    children.map((c) => c.id),
    {}
  );

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'overview' as TabType, label: 'Overview', icon: 'fa-home' },
    ...(children.length > 1 ? [{ id: 'compare' as TabType, label: 'Compare', icon: 'fa-balance-scale' }] : []),
    { id: 'history' as TabType, label: 'History', icon: 'fa-list' },
    { id: 'calendar' as TabType, label: 'Calendar', icon: 'fa-calendar' },
    { id: 'statistics' as TabType, label: 'Statistics', icon: 'fa-chart-bar' },
  ];

  const isLoading = isLoadingChildren || isLoadingOverview;

  // Map children to selector format
  const childrenForSelector: Child[] = children.map((c) => ({
    id: c.id,
    name: c.name,
    classId: c.id, // Use child id as classId fallback
    className: c.className,
    avatar: c.avatar,
  }));

  // Convert child attendance records to format expected by AttendanceHistory
  const attendanceRecords: ChildAttendanceRecord[] = childAttendance?.records || [];

  if (isLoading) {
    return (
      <div className="p-3 sm:p-4 lg:p-6">
        <DashboardStatsSkeleton />
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6 max-w-full overflow-x-hidden">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
          Children's Attendance
        </h1>
        <p className="text-xs sm:text-sm text-gray-600">
          View and track attendance for your children
        </p>
      </div>

      {/* Children Selector */}
      <div className="mb-4">
        <ChildrenSelector
          children={childrenForSelector}
          selectedChildId={selectedChildId}
          onSelectChild={(childId) => {
            setSelectedChildId(childId || null);
          }}
        />
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-4 sm:mb-6 overflow-x-auto -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6">
        <nav className="-mb-px flex space-x-4 sm:space-x-8 min-w-max" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
                whitespace-nowrap py-3 sm:py-4 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm flex items-center transition-colors
              `}
            >
              <i className={`fas ${tab.icon} mr-1.5 sm:mr-2`}></i>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && overview && (
          <div className="space-y-4">
            {overview.children.map((child) => (
              <ChildAttendanceOverview key={child.childId} childAttendance={child} />
            ))}
          </div>
        )}

        {activeTab === 'compare' && comparison && (
          <MultiChildComparison comparison={comparison} />
        )}

        {activeTab === 'history' && selectedChildId && (
          <AttendanceHistory
            records={attendanceRecords.map((r) => ({
              id: r.id,
              date: r.date,
              classId: r.classId,
              className: r.className,
              status: r.status,
              remarks: r.remarks,
              submittedBy: r.submittedBy,
              submittedAt: r.submittedAt,
            }))}
            isLoading={isLoadingChildAttendance}
          />
        )}

        {activeTab === 'calendar' && selectedChildId && (
          <div className="text-center text-gray-500 p-6">
            Calendar view for individual child will be implemented here
          </div>
        )}

        {activeTab === 'statistics' && selectedChildId && (
          <div className="text-center text-gray-500 p-6">
            Statistics view for individual child will be implemented here
          </div>
        )}
      </div>
    </div>
  );
};

