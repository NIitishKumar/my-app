/**
 * ExamsPage Component
 * Main page for teacher exam schedule
 */

import { useState } from 'react';
import { useTeacherExams } from '../hooks/useTeacherExams';
import { useClassExams } from '../hooks/useClassExams';
import { useUpcomingExams } from '../hooks/useUpcomingExams';
import { useExamCalendar } from '../../../student/exams/hooks/useExamCalendar';
import { useAssignedClasses } from '../../hooks/useTeacher';
import { useCreateExam } from '../hooks/useCreateExam';
import { useUpdateExam } from '../hooks/useUpdateExam';
import { ExamsDashboard } from '../components/ExamsDashboard';
import { MyExamsList } from '../components/MyExamsList';
import { ClassExamsList } from '../components/ClassExamsList';
import { ExamScheduleCalendar } from '../../../student/exams/components/ExamScheduleCalendar';
import { ExamFilters } from '../../../student/exams/components/ExamFilters';
import { ExamDetails } from '../../../student/exams/components/ExamDetails';
import { ExamForm } from '../components/ExamForm';
import { useExam } from '../../../student/exams/hooks/useExam';
import { DashboardStatsSkeleton } from '../../../../shared/components/skeletons';
import type { Exam } from '../../../student/exams/types/exam.types';
import type { CreateExamData } from '../../../admin/exams/types/exam.types';

type TabType = 'all' | 'by-class' | 'calendar' | 'create';

export const ExamsPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth() + 1);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [showExamDetails, setShowExamDetails] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingExamId, setEditingExamId] = useState<string | null>(null);
  const [filters, setFilters] = useState<{
    status?: string;
    subject?: string;
    startDate?: string;
    endDate?: string;
  }>({});

  // Fetch assigned classes
  const { data: classes = [] } = useAssignedClasses();

  // Fetch all exams
  const { data: allExamsData, isLoading: isLoadingAllExams } = useTeacherExams(filters);

  // Fetch class-specific exams
  const { data: classExamsData, isLoading: isLoadingClassExams } = useClassExams(
    selectedClassId,
    filters
  );

  // Fetch upcoming exams
  const { data: upcomingExamsData } = useUpcomingExams();

  // Fetch calendar data
  const { data: calendarData } = useExamCalendar(calendarYear, calendarMonth);

  // Fetch selected exam details
  const { data: examDetails } = useExam(selectedExamId || '');

  // Fetch exam for editing
  const { data: editingExam } = useExam(editingExamId || '');

  // Mutations
  const createExam = useCreateExam();
  const updateExam = useUpdateExam();

  const handleFilterChange = (newFilters: {
    status?: string;
    subject?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    setFilters(newFilters);
  };

  const handleExamClick = (exam: Exam) => {
    setSelectedExamId(exam.id);
    setShowExamDetails(true);
  };

  const handleEditExam = (exam: Exam) => {
    setEditingExamId(exam.id);
    setShowForm(true);
    setActiveTab('create');
  };

  const handleCreateExam = (data: CreateExamData) => {
    createExam.mutate(data, {
      onSuccess: () => {
        setShowForm(false);
        setEditingExamId(null);
        setActiveTab('all');
      },
    });
  };

  const handleUpdateExam = (data: CreateExamData) => {
    if (!editingExamId) return;
    updateExam.mutate(
      { id: editingExamId, data },
      {
        onSuccess: () => {
          setShowForm(false);
          setEditingExamId(null);
          setActiveTab('all');
        },
      }
    );
  };

  const handleCalendarMonthChange = (year: number, month: number) => {
    setCalendarYear(year);
    setCalendarMonth(month);
  };

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'all', label: 'All Exams', icon: 'fa-list' },
    { id: 'by-class', label: 'By Class', icon: 'fa-layer-group' },
    { id: 'calendar', label: 'Calendar', icon: 'fa-calendar-alt' },
    { id: 'create', label: 'Create Exam', icon: 'fa-plus-circle' },
  ];

  const isLoading = isLoadingAllExams || isLoadingClassExams;

  return (
    <div className="p-3 sm:p-4 lg:p-6 max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
          Exam Schedule
        </h1>
        <p className="text-xs sm:text-sm text-gray-600">
          View exams for your assigned classes
        </p>
      </div>

      {/* Dashboard */}
      {activeTab === 'all' && (
        <div className="mb-6">
          <ExamsDashboard examsData={allExamsData} isLoading={isLoadingAllExams} />
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-4 sm:mb-6 overflow-x-auto -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6">
        <nav className="-mb-px flex space-x-4 sm:space-x-8 min-w-max" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === 'create') {
                  setShowForm(true);
                  setEditingExamId(null);
                } else {
                  setShowForm(false);
                }
              }}
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
        {isLoading ? (
          <DashboardStatsSkeleton />
        ) : (
          <>
            {/* All Exams Tab */}
            {activeTab === 'all' && allExamsData && (
              <div className="space-y-4">
                <ExamFilters onFilterChange={handleFilterChange} />
                <MyExamsList
                  exams={allExamsData.exams}
                  isLoading={isLoadingAllExams}
                  onExamClick={handleExamClick}
                  onEdit={handleEditExam}
                  groupByClass={true}
                />
              </div>
            )}

            {/* By Class Tab */}
            {activeTab === 'by-class' && (
              <div className="space-y-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Class
                  </label>
                  <select
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">All Classes</option>
                    {classes.map((cls) => {
                      const className = (cls as any).name || cls.className || 'Unnamed Class';
                      const subject = (cls as any).subject || (cls as any).subjects?.[0] || '';
                      return (
                        <option key={cls.id} value={cls.id}>
                          {className}{subject ? ` (${subject})` : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {selectedClassId && classExamsData && (
                  <ClassExamsList
                    exams={classExamsData.exams}
                    className={classExamsData.exams[0]?.className || 'Unknown Class'}
                    isLoading={isLoadingClassExams}
                    onExamClick={handleExamClick}
                  />
                )}

                {!selectedClassId && allExamsData && (
                  <MyExamsList
                    exams={allExamsData.exams}
                    isLoading={isLoadingAllExams}
                    onExamClick={handleExamClick}
                    groupByClass={true}
                  />
                )}
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

            {/* Create/Edit Exam Tab */}
            {activeTab === 'create' && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                {showForm ? (
                  <ExamForm
                    initialData={
                      editingExam
                        ? {
                            title: editingExam.title,
                            subject: editingExam.subject,
                            subjectCode: editingExam.subjectCode,
                            classIds: [editingExam.classId],
                            date: editingExam.date instanceof Date
                              ? editingExam.date.toISOString().split('T')[0]
                              : typeof editingExam.date === 'string'
                              ? editingExam.date.split('T')[0]
                              : '',
                            startTime: editingExam.startTime,
                            duration: editingExam.duration,
                            totalMarks: editingExam.totalMarks,
                            room: editingExam.room,
                            instructions: editingExam.instructions,
                            examType: editingExam.examType,
                          }
                        : undefined
                    }
                    onSubmit={editingExamId ? handleUpdateExam : handleCreateExam}
                    onCancel={() => {
                      setShowForm(false);
                      setEditingExamId(null);
                      setActiveTab('all');
                    }}
                    isLoading={createExam.isPending || updateExam.isPending}
                  />
                ) : (
                  <div className="text-center py-12">
                    <i className="fas fa-calendar-plus text-4xl text-gray-400 mb-4"></i>
                    <p className="text-gray-600">Click "Create Exam" to get started</p>
                  </div>
                )}
              </div>
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

