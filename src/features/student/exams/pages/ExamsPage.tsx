/**
 * ExamsPage Component
 * Main page for student exam schedule with tab navigation
 */

import { useState } from 'react';
import { ExamScheduleList } from '../components/ExamScheduleList';
import { ExamScheduleCalendar } from '../components/ExamScheduleCalendar';
import { UpcomingExamsList } from '../components/UpcomingExamsList';
import { ExamResultsList } from '../components/ExamResultsList';
import { ExamDetails } from '../components/ExamDetails';
import { ExamFilters } from '../components/ExamFilters';
import { ExportButton } from '../../../../shared/components/attendance/ExportButton';
import { useExams } from '../hooks/useExams';
import { useUpcomingExams } from '../hooks/useUpcomingExams';
import { useExamResults } from '../hooks/useExamResults';
import { useExamCalendar } from '../hooks/useExamCalendar';
import { useExam } from '../hooks/useExam';
import { studentExamService } from '../api/exams.service';
import { DashboardStatsSkeleton } from '../../../../shared/components/skeletons';
import { formatDateISO } from '../../../../shared/utils/exams/exam.formatters';
import type { ExamFilters as ExamFiltersType, Exam } from '../types/exam.types';

type TabType = 'schedule' | 'upcoming' | 'results' | 'calendar';

export const ExamsPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('schedule');
  const [filters, setFilters] = useState<ExamFiltersType>({});
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth() + 1);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [showExamDetails, setShowExamDetails] = useState(false);

  // Fetch exams
  const {
    data: examsData,
    isLoading: isLoadingExams,
    refetch: refetchExams,
  } = useExams(filters);

  // Fetch upcoming exams
  const { data: upcomingExamsData, isLoading: isLoadingUpcoming } = useUpcomingExams(10);

  // Fetch exam results
  const {
    data: resultsData,
    isLoading: isLoadingResults,
  } = useExamResults({
    subject: filters.subject,
    page: filters.page,
    limit: filters.limit,
  });

  // Fetch calendar data
  const {
    data: calendarData,
    isLoading: isLoadingCalendar,
  } = useExamCalendar(calendarYear, calendarMonth);

  // Fetch selected exam details
  const { data: examDetails } = useExam(
    selectedExamId || ''
  );

  const handleFilterChange = (newFilters: {
    status?: string;
    subject?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    setFilters(newFilters as ExamFiltersType);
  };

  const handleExport = async (format: 'excel' | 'csv' | 'pdf') => {
    const startDate = filters.startDate || formatDateISO(new Date(new Date().getFullYear(), 0, 1));
    const endDate = filters.endDate || formatDateISO(new Date());
    return studentExamService.exportExamSchedule(startDate, endDate, format);
  };

  const handleExamClick = (exam: Exam) => {
    setSelectedExamId(exam.id);
    setShowExamDetails(true);
  };

  const handleCalendarMonthChange = (year: number, month: number) => {
    setCalendarYear(year);
    setCalendarMonth(month);
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
    refetchExams();
  };

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'schedule', label: 'Schedule', icon: 'fa-list' },
    { id: 'upcoming', label: 'Upcoming', icon: 'fa-calendar-check' },
    { id: 'results', label: 'Results', icon: 'fa-clipboard-list' },
    { id: 'calendar', label: 'Calendar', icon: 'fa-calendar-alt' },
  ];

  const isLoading =
    isLoadingExams || isLoadingUpcoming || isLoadingResults || isLoadingCalendar;

  return (
    <div className="p-3 sm:p-4 lg:p-6 max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
              Exam Schedule
            </h1>
            <p className="text-xs sm:text-sm text-gray-600">
              View your exam schedule, upcoming exams, and results
            </p>
          </div>
          {activeTab === 'schedule' && (
            <ExportButton
              onExport={handleExport}
              fileName="exam-schedule"
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
        {isLoading && activeTab !== 'schedule' ? (
          <DashboardStatsSkeleton />
        ) : (
          <>
            {/* Schedule Tab */}
            {activeTab === 'schedule' && (
              <div className="space-y-4">
                <ExamFilters onFilterChange={handleFilterChange} />
                {examsData && (
                  <ExamScheduleList
                    exams={examsData.exams}
                    isLoading={isLoadingExams}
                    onExamClick={handleExamClick}
                    onPageChange={handlePageChange}
                    currentPage={filters.page || 1}
                    totalPages={examsData.pagination.totalPages}
                    groupByDate={true}
                  />
                )}
              </div>
            )}

            {/* Upcoming Tab */}
            {activeTab === 'upcoming' && upcomingExamsData && (
              <UpcomingExamsList
                exams={upcomingExamsData.exams}
                isLoading={isLoadingUpcoming}
                onExamClick={handleExamClick}
              />
            )}

            {/* Results Tab */}
            {activeTab === 'results' && resultsData && (
              <div className="space-y-4">
                <ExamFilters onFilterChange={handleFilterChange} />
                <ExamResultsList
                  results={resultsData.results}
                  isLoading={isLoadingResults}
                  onPageChange={handlePageChange}
                  currentPage={filters.page || 1}
                  totalPages={resultsData.pagination.totalPages}
                />
              </div>
            )}

            {/* Calendar Tab */}
            {activeTab === 'calendar' && calendarData && (
              <ExamScheduleCalendar
                year={calendarData.year}
                month={calendarData.month}
                exams={calendarData.days.flatMap((day) => day.exams)}
                onMonthChange={handleCalendarMonthChange}
                onExamClick={handleExamClick}
              />
            )}
          </>
        )}
      </div>

      {/* Exam Details Modal */}
      {showExamDetails && examDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <ExamDetails
              exam={examDetails}
              onClose={() => {
                setShowExamDetails(false);
                setSelectedExamId(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

