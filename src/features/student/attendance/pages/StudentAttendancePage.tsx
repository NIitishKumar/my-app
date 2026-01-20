/**
 * StudentAttendancePage Component
 * Main page for student attendance with tab navigation
 */

import { useState } from 'react';
import { AttendanceFilters } from '../components/AttendanceFilters';
import { AttendanceHistory } from '../components/AttendanceHistory';
import { AttendanceStats } from '../components/AttendanceStats';
import { AttendanceChart } from '../components/AttendanceChart';
import { AttendanceCalendar } from '../components/AttendanceCalendar';
import { ExportButton } from '../../../../shared/components/attendance/ExportButton';
import { useStudentAttendance } from '../hooks/useStudentAttendance';
import { useAttendanceStats } from '../hooks/useAttendanceStats';
import { useAttendanceCalendar } from '../hooks/useAttendanceCalendar';
import { studentAttendanceService } from '../api/attendance.service';
import { DashboardStatsSkeleton } from '../../../../shared/components/skeletons';
import { formatDateISO } from '../../../../shared/utils/attendance/attendance.formatters';
import type { AttendanceFilters as AttendanceFiltersType } from '../types/attendance.types';

type TabType = 'overview' | 'history' | 'calendar' | 'statistics';

export const StudentAttendancePage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [filters, setFilters] = useState<AttendanceFiltersType>({});
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth() + 1);

  // Fetch attendance records
  const {
    data: attendanceData,
    isLoading: isLoadingRecords,
    refetch: refetchRecords,
  } = useStudentAttendance(filters);

  // Fetch statistics
  const {
    data: statsData,
    isLoading: isLoadingStats,
  } = useAttendanceStats({
    startDate: filters.startDate,
    endDate: filters.endDate,
    period: 'month',
  });

  // Fetch calendar data
  const {
    data: calendarData,
    isLoading: isLoadingCalendar,
  } = useAttendanceCalendar(calendarYear, calendarMonth, filters.classId);

  const handleFilterChange = (newFilters: {
    startDate?: string;
    endDate?: string;
    classId?: string;
    status?: string;
  }) => {
    setFilters(newFilters as AttendanceFiltersType);
  };

  const handleExport = async (format: 'excel' | 'csv' | 'pdf') => {
    const startDate = filters.startDate || formatDateISO(new Date(new Date().getFullYear(), 0, 1));
    const endDate = filters.endDate || formatDateISO(new Date());
    return studentAttendanceService.exportAttendance(
      startDate,
      endDate,
      format,
      filters.classId
    );
  };

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: 'fa-home' },
    { id: 'history', label: 'History', icon: 'fa-list' },
    { id: 'calendar', label: 'Calendar', icon: 'fa-calendar' },
    { id: 'statistics', label: 'Statistics', icon: 'fa-chart-bar' },
  ];

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
    refetchRecords();
  };

  const handleCalendarMonthChange = (year: number, month: number) => {
    setCalendarYear(year);
    setCalendarMonth(month);
  };

  const isLoading = isLoadingRecords || isLoadingStats || isLoadingCalendar;

  return (
    <div className="p-3 sm:p-4 lg:p-6 max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
              My Attendance
            </h1>
            <p className="text-xs sm:text-sm text-gray-600">
              View and track your attendance records
            </p>
          </div>
          {activeTab === 'history' && (
            <ExportButton
              onExport={handleExport}
              fileName="my-attendance"
              size="sm"
            />
          )}
        </div>
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
        {isLoading && activeTab !== 'overview' ? (
          <DashboardStatsSkeleton />
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {statsData && (
                  <>
                    <AttendanceStats stats={statsData} />
                    {statsData.monthlyBreakdown.length > 0 && (
                      <AttendanceChart monthlyBreakdown={statsData.monthlyBreakdown} />
                    )}
                  </>
                )}
                {attendanceData && attendanceData.records.length > 0 && (
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Records</h3>
                    <AttendanceHistory
                      records={attendanceData.records.slice(0, 10)}
                      isLoading={isLoadingRecords}
                    />
                  </div>
                )}
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div className="space-y-4">
                <AttendanceFilters onFilterChange={handleFilterChange} />
                {attendanceData && (
                  <AttendanceHistory
                    records={attendanceData.records}
                    isLoading={isLoadingRecords}
                    onPageChange={handlePageChange}
                    currentPage={filters.page || 1}
                    totalPages={attendanceData.pagination.totalPages}
                  />
                )}
              </div>
            )}

            {/* Calendar Tab */}
            {activeTab === 'calendar' && calendarData && (
              <AttendanceCalendar
                year={calendarData.year}
                month={calendarData.month}
                days={calendarData.days}
                onMonthChange={handleCalendarMonthChange}
              />
            )}

            {/* Statistics Tab */}
            {activeTab === 'statistics' && statsData && (
              <div className="space-y-6">
                <AttendanceFilters onFilterChange={handleFilterChange} />
                <AttendanceStats stats={statsData} />
                {statsData.monthlyBreakdown.length > 0 && (
                  <AttendanceChart monthlyBreakdown={statsData.monthlyBreakdown} />
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

