/**
 * TeacherAttendanceForm Component
 * Adapted attendance form for teachers (auto-fills teacher ID)
 */

import { useState, useMemo, useEffect, useRef } from 'react';
import { useTeacherClassDetails } from '../hooks/useTeacherClassDetails';
import { useStudents } from '../../../admin/students/hooks/useStudents';
import { useLectures } from '../../../admin/lectures/hooks/useLectures';
import { useAttendanceByDate } from '../../../admin/classes/attendance/hooks/useAttendanceByDate';
import { useMarkAttendance, useUpdateAttendance } from '../../../admin/classes/attendance/hooks/useMarkAttendance';
import { ATTENDANCE_STATUS_OPTIONS, BULK_ACTIONS, VALIDATION } from '../../../admin/classes/attendance/constants/attendance.constants';
import { getTodayDateString } from '../../../admin/classes/attendance/utils/attendance.utils';
import { 
  saveDraftToLocalStorage, 
  loadDraftFromLocalStorage, 
  clearDraft
} from '../../../teacher/attendance/utils/attendance.utils';
import { useUIStore } from '../../../../store/ui.store';
import type { MarkAttendanceData, AttendanceStatus } from '../../../admin/classes/attendance/types/attendance.types';

interface TeacherAttendanceFormProps {
  classId: string;
  initialDate?: string;
  initialLectureId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const TeacherAttendanceForm = ({
  classId,
  initialDate,
  initialLectureId,
  onSuccess,
  onCancel,
}: TeacherAttendanceFormProps) => {
  const [selectedDate, setSelectedDate] = useState(initialDate || getTodayDateString());
  const [selectedLectureId, setSelectedLectureId] = useState<string | undefined>(initialLectureId);
  const [attendanceType, setAttendanceType] = useState<'date' | 'lecture'>(
    initialLectureId ? 'lecture' : 'date'
  );
  const [studentStatuses, setStudentStatuses] = useState<Record<string, AttendanceStatus>>({});
  const [studentRemarks, setStudentRemarks] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const initialStatusesRef = useRef<Record<string, AttendanceStatus>>({});

  const { data: classData, isLoading: isLoadingClass } = useTeacherClassDetails(classId);
  const { data: allStudents = [], isLoading: isLoadingStudents } = useStudents();
  const { data: allLectures = [], isLoading: isLoadingLectures } = useLectures();
  const { data: existingAttendance } = useAttendanceByDate(classId, selectedDate);
  const markAttendance = useMarkAttendance();
  const updateAttendance = useUpdateAttendance();
  const addToast = useUIStore((state) => state.addToast);

  // Get students for this class
  const classStudents = useMemo(() => {
    if (!classData || !allStudents.length) return [];
    return allStudents.filter((student) => classData.students.includes(student.id));
  }, [classData, allStudents]);

  // Get lectures for this class
  const classLectures = useMemo(() => {
    if (!classData || !allLectures.length) return [];
    return allLectures.filter((lecture) => classData.lectures.includes(lecture.id));
  }, [classData, allLectures]);

  // Filter students by search term
  const filteredStudents = useMemo(() => {
    if (!searchTerm.trim()) return classStudents;
    const term = searchTerm.toLowerCase();
    return classStudents.filter(
      (student) =>
        `${student.firstName} ${student.lastName}`.toLowerCase().includes(term) ||
        student.studentId?.toLowerCase().includes(term) ||
        student.email?.toLowerCase().includes(term)
    );
  }, [classStudents, searchTerm]);

  // Calculate status summary
  const statusSummary = useMemo(() => {
    const summary = { present: 0, absent: 0, late: 0, excused: 0 };
    classStudents.forEach((student) => {
      const status = studentStatuses[student.id] || 'present';
      summary[status]++;
    });
    return summary;
  }, [classStudents, studentStatuses]);

  // Load draft from localStorage on mount and when class/date changes
  useEffect(() => {
    if (classId && selectedDate) {
      const draft = loadDraftFromLocalStorage(classId, selectedDate);
      if (draft?.students && !existingAttendance) {
        const statuses: Record<string, AttendanceStatus> = {};
        const remarks: Record<string, string> = {};
        (draft.students as Array<{ studentId: string; status: AttendanceStatus; remarks?: string }>).forEach((s) => {
          statuses[s.studentId] = s.status;
          if (s.remarks) remarks[s.studentId] = s.remarks;
        });
        setStudentStatuses(statuses);
        setStudentRemarks(remarks);
        initialStatusesRef.current = statuses;
        return;
      }
    }
  }, [classId, selectedDate, existingAttendance]);

  // Initialize student statuses from existing attendance or default to 'present'
  useEffect(() => {
    if (existingAttendance) {
      const statuses: Record<string, AttendanceStatus> = {};
      const remarks: Record<string, string> = {};
      existingAttendance.students?.forEach((student) => {
        statuses[student.studentId] = student.status;
        if (student.remarks) {
          remarks[student.studentId] = student.remarks;
        }
      });
      setStudentStatuses(statuses);
      setStudentRemarks(remarks);
      initialStatusesRef.current = statuses;
      clearDraft(classId, selectedDate);
      setHasUnsavedChanges(false);
    } else if (classStudents.length > 0 && Object.keys(studentStatuses).length === 0) {
      // Initialize all students as 'present' by default
      const defaultStatuses: Record<string, AttendanceStatus> = {};
      classStudents.forEach((student) => {
        defaultStatuses[student.id] = 'present';
      });
      setStudentStatuses(defaultStatuses);
      initialStatusesRef.current = defaultStatuses;
      setHasUnsavedChanges(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingAttendance, classStudents]);

  // Auto-save draft every 30 seconds
  useEffect(() => {
    if (!classId || !selectedDate || classStudents.length === 0 || existingAttendance) return;
    
    const interval = setInterval(() => {
      const draftData: Partial<MarkAttendanceData> = {
        classId,
        date: selectedDate,
        lectureId: selectedLectureId,
        students: classStudents.map((s) => ({
          studentId: s.id,
          status: studentStatuses[s.id] || 'present',
          remarks: studentRemarks[s.id],
        })),
      };
      saveDraftToLocalStorage(classId, selectedDate, draftData);
    }, 30000);

    return () => clearInterval(interval);
  }, [classId, selectedDate, selectedLectureId, studentStatuses, studentRemarks, classStudents, existingAttendance]);

  // Detect unsaved changes
  useEffect(() => {
    const hasChanges = JSON.stringify(studentStatuses) !== JSON.stringify(initialStatusesRef.current) ||
      Object.keys(studentRemarks).some(key => studentRemarks[key]?.trim());
    setHasUnsavedChanges(hasChanges);
  }, [studentStatuses, studentRemarks]);

  // Unsaved changes warning on beforeunload
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
      return e.returnValue;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Keyboard shortcuts (Ctrl+S / Cmd+S to save)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        // Submit will be handled by the form button click
        const submitButton = document.querySelector('[data-attendance-submit]') as HTMLButtonElement;
        if (submitButton && !submitButton.disabled) {
          submitButton.click();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setStudentStatuses((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleRemarksChange = (studentId: string, remarks: string) => {
    if (remarks.length <= VALIDATION.REMARKS_MAX_LENGTH) {
      setStudentRemarks((prev) => ({
        ...prev,
        [studentId]: remarks,
      }));
    }
  };

  const handleBulkAction = (action: string) => {
    // Confirmation for destructive actions
    if (action === BULK_ACTIONS.MARK_ALL_ABSENT || action === BULK_ACTIONS.CLEAR_ALL) {
      const actionName = action === BULK_ACTIONS.MARK_ALL_ABSENT ? 'mark all students as absent' : 'clear all attendance';
      if (!window.confirm(`Are you sure you want to ${actionName}? This action cannot be undone.`)) {
        return;
      }
    }

    const newStatuses = { ...studentStatuses };
    classStudents.forEach((student) => {
      switch (action) {
        case BULK_ACTIONS.MARK_ALL_PRESENT:
          newStatuses[student.id] = 'present';
          break;
        case BULK_ACTIONS.MARK_ALL_ABSENT:
          newStatuses[student.id] = 'absent';
          break;
        case BULK_ACTIONS.CLEAR_ALL:
          delete newStatuses[student.id];
          break;
      }
    });
    setStudentStatuses(newStatuses);
  };

  const handleSubmit = async () => {
    if (classStudents.length === 0) {
      addToast({
        type: 'error',
        message: 'No students found in this class',
        duration: 3000,
      });
      return;
    }

    // Ensure all students have a status
    const students = classStudents.map((student) => ({
      studentId: student.id,
      status: studentStatuses[student.id] || 'present',
      remarks: studentRemarks[student.id] || undefined,
    }));

    const data: MarkAttendanceData = {
      classId,
      date: selectedDate,
      lectureId: attendanceType === 'lecture' ? selectedLectureId : undefined,
      students,
    };

    try {
      if (existingAttendance?.id) {
        // Update existing attendance
        await updateAttendance.mutateAsync({
          recordId: existingAttendance.id,
          classId: data.classId,
          date: data.date,
          lectureId: data.lectureId,
          students: data.students,
        });
        addToast({
          type: 'success',
          message: 'Attendance updated successfully',
          duration: 3000,
        });
      } else {
        // Create new attendance
        await markAttendance.mutateAsync(data);
        addToast({
          type: 'success',
          message: 'Attendance marked successfully',
          duration: 3000,
        });
      }
      clearDraft(classId, selectedDate);
      setHasUnsavedChanges(false);
      initialStatusesRef.current = studentStatuses;
      onSuccess?.();
    } catch (error: unknown) {
      // Enhanced error handling
      let errorMessage = 'Failed to mark attendance';
      
      if (error && typeof error === 'object' && 'status' in error) {
        const apiError = error as { status?: number; message?: string };
        if (apiError.status === 403) {
          errorMessage = 'You are not assigned to this class. Cannot mark attendance.';
        } else if (apiError.status === 422) {
          errorMessage = apiError.message || 'Invalid data. Please check all fields.';
        } else if (apiError.status === 404) {
          errorMessage = 'Class not found. Please refresh and try again.';
        } else if (apiError.status === 409) {
          errorMessage = 'Attendance already marked for this date. Please update instead.';
        } else if (apiError.message) {
          errorMessage = apiError.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      addToast({
        type: 'error',
        message: errorMessage,
        duration: 5000,
      });
    }
  };

  const isLoading = isLoadingClass || isLoadingStudents || isLoadingLectures;
  const isSubmitting = markAttendance.isPending || updateAttendance.isPending;

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <p className="mt-2 text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-900">Mark Attendance</h3>
        <p className="text-sm text-gray-600 mt-1">Record attendance for students</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Attendance Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Attendance Type
          </label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                checked={attendanceType === 'date'}
                onChange={() => {
                  setAttendanceType('date');
                  setSelectedLectureId(undefined);
                }}
                className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">Date-based (Daily)</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                checked={attendanceType === 'lecture'}
                onChange={() => setAttendanceType('lecture')}
                className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">Lecture-based</span>
            </label>
          </div>
        </div>

        {/* Date Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            max={getTodayDateString()}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          />
        </div>

        {/* Lecture Selector (if lecture-based) */}
        {attendanceType === 'lecture' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lecture <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedLectureId || ''}
              onChange={(e) => setSelectedLectureId(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            >
              <option value="">Select a lecture</option>
              {classLectures.map((lecture) => (
                <option key={lecture.id} value={lecture.id}>
                  {lecture.title} ({lecture.subject})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Status Summary Bar */}
        {classStudents.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Summary:</span>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center space-x-1">
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                  <span className="text-sm text-gray-700">Present: {statusSummary.present}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  <span className="text-sm text-gray-700">Absent: {statusSummary.absent}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                  <span className="text-sm text-gray-700">Late: {statusSummary.late}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                  <span className="text-sm text-gray-700">Excused: {statusSummary.excused}</span>
                </div>
              </div>
              {hasUnsavedChanges && (
                <span className="ml-auto text-xs text-amber-600 font-medium flex items-center">
                  <i className="fas fa-circle text-xs mr-1"></i>
                  Unsaved changes
                </span>
              )}
            </div>
          </div>
        )}

        {/* Bulk Actions */}
        {classStudents.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-700">Bulk Actions:</span>
            <button
              type="button"
              onClick={() => handleBulkAction(BULK_ACTIONS.MARK_ALL_PRESENT)}
              className="px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
            >
              Mark All Present
            </button>
            <button
              type="button"
              onClick={() => handleBulkAction(BULK_ACTIONS.MARK_ALL_ABSENT)}
              className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
            >
              Mark All Absent
            </button>
            <button
              type="button"
              onClick={() => handleBulkAction(BULK_ACTIONS.CLEAR_ALL)}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Search */}
        {classStudents.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Students
            </label>
            <input
              type="text"
              placeholder="Search by name, ID, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            {searchTerm && (
              <p className="mt-1 text-xs text-gray-500">
                Showing {filteredStudents.length} of {classStudents.length} students
              </p>
            )}
          </div>
        )}

        {/* Students List */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Students ({classStudents.length})
          </label>
          {classStudents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <i className="fas fa-user-slash text-4xl mb-3 text-gray-400"></i>
              <p>No students enrolled in this class.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredStudents.length === 0 && searchTerm ? (
                <div className="text-center py-8 text-gray-500">
                  <i className="fas fa-search text-4xl mb-3 text-gray-400"></i>
                  <p>No students found matching "{searchTerm}"</p>
                </div>
              ) : (
                filteredStudents.map((student) => {
                  const hasExistingAttendance = existingAttendance !== null && existingAttendance !== undefined;
                  
                  return (
                    <div
                      key={student.id}
                      className={`p-4 border rounded-lg transition-colors ${
                        hasExistingAttendance
                          ? 'border-indigo-300 bg-indigo-50/30'
                          : 'border-gray-200 hover:border-indigo-300'
                      }`}
                    >
                      {hasExistingAttendance && (
                        <div className="mb-2 flex items-center text-xs text-indigo-600 font-medium">
                          <i className="fas fa-check-circle mr-1"></i>
                          <span>Attendance already marked</span>
                        </div>
                      )}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-gray-900">
                            {student.firstName} {student.lastName}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {student.studentId} • {student.email}
                          </p>
                        </div>
                        <div className="ml-4 flex items-center space-x-2 flex-wrap gap-2">
                          {ATTENDANCE_STATUS_OPTIONS.map((option) => {
                            const isSelected = studentStatuses[student.id] === option.value;
                            const colorClasses = {
                              green: isSelected ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-50 border border-gray-200 hover:bg-gray-100',
                              red: isSelected ? 'bg-red-100 border-2 border-red-500' : 'bg-gray-50 border border-gray-200 hover:bg-gray-100',
                              yellow: isSelected ? 'bg-yellow-100 border-2 border-yellow-500' : 'bg-gray-50 border border-gray-200 hover:bg-gray-100',
                              blue: isSelected ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-50 border border-gray-200 hover:bg-gray-100',
                            };
                            return (
                              <label
                                key={option.value}
                                className={`flex items-center space-x-1 px-2 py-1 rounded transition-colors ${
                                  hasExistingAttendance
                                    ? 'cursor-not-allowed opacity-60'
                                    : `cursor-pointer ${colorClasses[option.color as keyof typeof colorClasses]}`
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`status-${student.id}`}
                                  value={option.value}
                                  checked={isSelected}
                                  onChange={() => handleStatusChange(student.id, option.value as AttendanceStatus)}
                                  disabled={hasExistingAttendance}
                                  className="w-3 h-3 text-indigo-600 focus:ring-indigo-500 disabled:cursor-not-allowed"
                                />
                                <span className="text-xs font-medium">{option.label}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                      <div className="mt-3">
                        <input
                          type="text"
                          placeholder="Remarks (optional)"
                          value={studentRemarks[student.id] || ''}
                          onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                          maxLength={VALIDATION.REMARKS_MAX_LENGTH}
                          disabled={hasExistingAttendance}
                          className={`w-full px-3 py-1.5 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                            hasExistingAttendance
                              ? 'border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed'
                              : 'border-gray-300'
                          }`}
                        />
                        {studentRemarks[student.id] && (
                          <p className="text-xs text-gray-500 mt-1">
                            {studentRemarks[student.id].length}/{VALIDATION.REMARKS_MAX_LENGTH} characters
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4 border-t border-gray-200 sticky bottom-0 bg-white pb-2 -mb-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || classStudents.length === 0 || (attendanceType === 'lecture' && !selectedLectureId)}
            className={`px-6 py-2.5 text-white rounded-lg font-medium transition-colors flex items-center space-x-2 ${
              isSubmitting || classStudents.length === 0 || (attendanceType === 'lecture' && !selectedLectureId)
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <i className="fas fa-save"></i>
                <span>{existingAttendance ? 'Update Attendance' : 'Mark Attendance'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

