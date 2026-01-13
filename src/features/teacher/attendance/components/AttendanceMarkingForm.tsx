/**
 * AttendanceMarkingForm Component
 * Form to mark attendance for a class with date/lecture-based options
 */

import { useState, useMemo, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useClasses } from '../../../admin/classes/hooks/useClasses';
import { useTeacherClassDetails } from '../../classes/hooks/useTeacherClassDetails';
import { useStudents } from '../../../admin/students/hooks/useStudents';
import { useLectures } from '../../../admin/lectures/hooks/useLectures';
import { useAttendanceByDate } from '../hooks/useAttendanceByDate';
import { useMarkAttendance } from '../hooks/useMarkAttendance';
import { useUpdateAttendance } from '../hooks/useUpdateAttendance';
import { 
  ATTENDANCE_STATUS_OPTIONS, 
  ATTENDANCE_TYPE_OPTIONS,
  BULK_ACTIONS,
  VALIDATION,
} from '../constants/attendance.constants';
import { 
  getTodayDateString, 
  formatDateForInput, 
  validateAttendanceData,
  saveDraftToLocalStorage,
  loadDraftFromLocalStorage,
  clearDraft,
  getAcademicYearStart,
} from '../utils/attendance.utils';
import { useUIStore } from '../../../../store/ui.store';
import type { MarkAttendanceData, AttendanceStatus, AttendanceType } from '../types/attendance.types';
import type { Class } from '../../../admin/classes/types/classes.types';

interface AttendanceMarkingFormProps {
  initialClassId?: string;
  initialDate?: string;
  initialLectureId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const AttendanceMarkingForm = ({
  initialClassId,
  initialDate,
  initialLectureId,
  onSuccess,
  onCancel,
}: AttendanceMarkingFormProps) => {
  const [selectedClassId, setSelectedClassId] = useState<string>(initialClassId || '');
  const [selectedDate, setSelectedDate] = useState<string>(initialDate || getTodayDateString());
  const [selectedLectureId, setSelectedLectureId] = useState<string | undefined>(initialLectureId);
  const [attendanceType, setAttendanceType] = useState<AttendanceType>(
    initialLectureId ? 'lecture' : 'date'
  );
  const [studentStatuses, setStudentStatuses] = useState<Record<string, AttendanceStatus>>({});
  const [studentRemarks, setStudentRemarks] = useState<Record<string, string>>({});
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [showRemarks, setShowRemarks] = useState<Record<string, boolean>>({});

  const { data: classes = [] } = useClasses();
  const { data: allStudents = [] } = useStudents();
  const { data: allLectures = [] } = useLectures();
  const { data: classData } = useTeacherClassDetails(selectedClassId);
  const { data: existingAttendance } = useAttendanceByDate(selectedClassId, selectedDate);
  const markAttendance = useMarkAttendance();
  const updateAttendance = useUpdateAttendance();
  const addToast = useUIStore((state) => state.addToast);

  // Get students for this class
  const classStudents = useMemo(() => {
    if (!classData || !allStudents.length) return [];
    return allStudents.filter((student) => classData.students?.includes(student.id));
  }, [classData, allStudents]);

  // Get lectures for this class
  const classLectures = useMemo(() => {
    if (!classData || !allLectures.length) return [];
    return allLectures.filter((lecture) => 
      lecture.classId === selectedClassId || classData.lectures?.includes(lecture.id)
    );
  }, [classData, allLectures, selectedClassId]);

  // Filter students by search term
  const filteredStudents = useMemo(() => {
    if (!searchTerm.trim()) return classStudents;
    const term = searchTerm.toLowerCase();
    return classStudents.filter(
      (student) =>
        `${student.firstName} ${student.lastName}`.toLowerCase().includes(term) ||
        student.studentId?.toLowerCase().includes(term)
    );
  }, [classStudents, searchTerm]);

  // Load draft from localStorage on mount and when class/date changes
  useEffect(() => {
    if (selectedClassId && selectedDate) {
      const draft = loadDraftFromLocalStorage(selectedClassId, selectedDate);
      if (draft?.students) {
        const statuses: Record<string, AttendanceStatus> = {};
        const remarks: Record<string, string> = {};
        draft.students.forEach((s: any) => {
          statuses[s.studentId] = s.status;
          if (s.remarks) remarks[s.studentId] = s.remarks;
        });
        setStudentStatuses(statuses);
        setStudentRemarks(remarks);
      }
    }
  }, [selectedClassId, selectedDate]);

  // Initialize student statuses from existing attendance or default to 'present'
  useEffect(() => {
    if (existingAttendance) {
      const statuses: Record<string, AttendanceStatus> = {};
      const remarks: Record<string, string> = {};
      existingAttendance.students.forEach((student) => {
        statuses[student.studentId] = student.status;
        if (student.remarks) remarks[student.studentId] = student.remarks;
      });
      setStudentStatuses(statuses);
      setStudentRemarks(remarks);
      clearDraft(selectedClassId, selectedDate); // Clear draft if existing attendance found
    } else if (classStudents.length > 0 && Object.keys(studentStatuses).length === 0) {
      // Initialize all students as 'present' by default
      const defaultStatuses: Record<string, AttendanceStatus> = {};
      classStudents.forEach((student) => {
        defaultStatuses[student.id] = 'present';
      });
      setStudentStatuses(defaultStatuses);
    }
  }, [existingAttendance, classStudents]);

  // Auto-save draft every 30 seconds
  useEffect(() => {
    if (!selectedClassId || !selectedDate || classStudents.length === 0) return;
    
    const interval = setInterval(() => {
      const draftData: Partial<MarkAttendanceData> = {
        classId: selectedClassId,
        date: selectedDate,
        lectureId: selectedLectureId,
        type: attendanceType,
        students: classStudents.map((s) => ({
          studentId: s.id,
          status: studentStatuses[s.id] || 'present',
          remarks: studentRemarks[s.id],
        })),
      };
      saveDraftToLocalStorage(selectedClassId, selectedDate, draftData);
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [selectedClassId, selectedDate, selectedLectureId, attendanceType, studentStatuses, studentRemarks, classStudents]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      if (selectedStudents.size > 0) {
        switch (e.key.toLowerCase()) {
          case 'p':
            handleBulkStatusChange('present');
            break;
          case 'a':
            handleBulkStatusChange('absent');
            break;
          case 'l':
            handleBulkStatusChange('late');
            break;
          case 'e':
            handleBulkStatusChange('excused');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedStudents]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setStudentStatuses((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleRemarksChange = (studentId: string, remarks: string) => {
    if (remarks.length <= VALIDATION.REMARKS_MAX_LENGTH) {
      setStudentRemarks((prev) => ({ ...prev, [studentId]: remarks }));
    }
  };

  const handleBulkStatusChange = (status: AttendanceStatus) => {
    const newStatuses = { ...studentStatuses };
    selectedStudents.forEach((studentId) => {
      newStatuses[studentId] = status;
    });
    setStudentStatuses(newStatuses);
    setSelectedStudents(new Set());
  };

  const handleBulkAction = (action: string) => {
    const newStatuses = { ...studentStatuses };
    const newSelected = new Set<string>();

    classStudents.forEach((student) => {
      switch (action) {
        case BULK_ACTIONS.MARK_ALL_PRESENT:
          newStatuses[student.id] = 'present';
          break;
        case BULK_ACTIONS.MARK_ALL_ABSENT:
          newStatuses[student.id] = 'absent';
          break;
        case BULK_ACTIONS.MARK_ALL_LATE:
          newStatuses[student.id] = 'late';
          break;
        case BULK_ACTIONS.MARK_ALL_EXCUSED:
          newStatuses[student.id] = 'excused';
          break;
        case BULK_ACTIONS.SELECT_ALL:
          newSelected.add(student.id);
          break;
        case BULK_ACTIONS.DESELECT_ALL:
          newSelected.clear();
          break;
      }
    });

    setStudentStatuses(newStatuses);
    setSelectedStudents(newSelected);
  };

  const handleSubmit = async () => {
    if (!selectedClassId) {
      addToast({ type: 'error', message: 'Please select a class', duration: 3000 });
      return;
    }

    if (classStudents.length === 0) {
      addToast({ type: 'error', message: 'No students found in this class', duration: 3000 });
      return;
    }

    // Ensure all students have a status and valid ID
    // Filter out students without IDs - let backend validate ObjectId format
    const validStudents = classStudents.filter((student) => {
      if (!student?.id || typeof student.id !== 'string' || student.id.trim() === '') {
        console.warn('Student missing ID:', student);
        return false;
      }
      return true;
    });

    if (validStudents.length === 0) {
      addToast({
        type: 'error',
        message: 'No students with valid IDs found. Please check the class configuration.',
        duration: 5000,
      });
      return;
    }

    // Map students to request format - ensure studentId is a non-empty string
    const students = validStudents
      .map((student) => {
        const studentId = String(student.id).trim();
        if (!studentId) {
          console.error('Student ID is empty after trimming:', student);
          return null;
        }
        
        // Validate MongoDB ObjectId format (24 hex characters)
        const objectIdRegex = /^[0-9a-fA-F]{24}$/;
        if (!objectIdRegex.test(studentId)) {
          console.error('Student ID is not a valid MongoDB ObjectId:', studentId, student);
          return null;
        }
        
        return {
          studentId, // Ensure camelCase (not student_id)
          status: studentStatuses[student.id] || 'present',
          remarks: studentRemarks[student.id] || undefined,
        };
      })
      .filter((student): student is NonNullable<typeof student> => student !== null);
    
    if (students.length === 0) {
      addToast({
        type: 'error',
        message: 'No valid students to mark attendance for. Please check that students have valid IDs.',
        duration: 5000,
      });
      return;
    }
    

    const data: MarkAttendanceData = {
      classId: selectedClassId,
      date: selectedDate,
      lectureId: attendanceType === 'lecture' ? selectedLectureId : undefined,
      type: attendanceType,
      students,
    };

    // Validate data
    const validation = validateAttendanceData(data);
    if (!validation.isValid) {
      addToast({
        type: 'error',
        message: validation.errors.join(', '),
        duration: 5000,
      });
      return;
    }

    try {
      if (existingAttendance) {
        // Update existing attendance
        await updateAttendance.mutateAsync({
          recordId: existingAttendance.id,
          classId: data.classId,
          date: data.date,
          lectureId: data.lectureId,
          students: data.students,
          version: existingAttendance.version,
        });
        addToast({ type: 'success', message: 'Attendance updated successfully', duration: 3000 });
      } else {
        // Create new attendance
        await markAttendance.mutateAsync(data);
        addToast({ type: 'success', message: 'Attendance marked successfully', duration: 3000 });
      }
      
      clearDraft(selectedClassId, selectedDate);
      onSuccess?.();
    } catch (error: unknown) {
      // Handle backend validation errors with details
      let errorMessage = 'Failed to mark attendance';
      if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = String(error.message);
        
        // Check if error has details array (backend validation errors)
        if ('details' in error && Array.isArray(error.details)) {
          const details = error.details as Array<{ field: string; message: string }>;
          if (details.length > 0) {
            const detailMessages = details.map((d) => `${d.field}: ${d.message}`).join(', ');
            errorMessage = `Validation error: ${detailMessages}`;
          }
        }
      }
      addToast({ type: 'error', message: errorMessage, duration: 5000 });
    }
  };

  const today = getTodayDateString();
  const maxDate = new Date(today);
  const minDate = getAcademicYearStart();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Mark Attendance</h2>

      {/* Form Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Class Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Class *</label>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select a class</option>
            {classes.map((cls: Class) => (
              <option key={cls.id} value={cls.id}>
                {cls.className}
              </option>
            ))}
          </select>
        </div>

        {/* Date Picker */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
          <DatePicker
            selected={selectedDate ? new Date(selectedDate) : null}
            onChange={(date: Date | null) => setSelectedDate(date ? formatDateForInput(date) : '')}
            maxDate={maxDate}
            minDate={minDate}
            dateFormat="yyyy-MM-dd"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholderText="Select date"
            disabled={!selectedClassId}
          />
        </div>

        {/* Attendance Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select
            value={attendanceType}
            onChange={(e) => setAttendanceType(e.target.value as AttendanceType)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            disabled={!selectedClassId}
          >
            {ATTENDANCE_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Lecture Selector (conditional) */}
        {attendanceType === 'lecture' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lecture</label>
            <select
              value={selectedLectureId || ''}
              onChange={(e) => setSelectedLectureId(e.target.value || undefined)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              disabled={!selectedClassId}
            >
              <option value="">Select a lecture</option>
              {classLectures.map((lecture) => (
                <option key={lecture.id} value={lecture.id}>
                  {lecture.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Existing Attendance Warning */}
      {existingAttendance && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <i className="fas fa-info-circle text-yellow-600 mr-2"></i>
            <p className="text-sm text-yellow-800">
              Attendance already marked for this date. You can update it below.
            </p>
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedClassId && classStudents.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
            <span className="text-sm font-medium text-gray-700 whitespace-nowrap shrink-0">Bulk Actions:</span>
            <div className="flex items-center gap-2 flex-nowrap">
              <button
                onClick={() => handleBulkAction(BULK_ACTIONS.MARK_ALL_PRESENT)}
                className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-md hover:bg-green-200 whitespace-nowrap shrink-0"
              >
                Mark All Present
              </button>
              <button
                onClick={() => handleBulkAction(BULK_ACTIONS.MARK_ALL_ABSENT)}
                className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded-md hover:bg-red-200 whitespace-nowrap shrink-0"
              >
                Mark All Absent
              </button>
              <button
                onClick={() => handleBulkAction(BULK_ACTIONS.MARK_ALL_LATE)}
                className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200 whitespace-nowrap shrink-0"
              >
                Mark All Late
              </button>
              <button
                onClick={() => handleBulkAction(BULK_ACTIONS.MARK_ALL_EXCUSED)}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 whitespace-nowrap shrink-0"
              >
                Mark All Excused
              </button>
              {selectedStudents.size > 0 && (
                <>
                  <span className="text-sm text-gray-500 whitespace-nowrap shrink-0">|</span>
                  <span className="text-sm text-gray-700 whitespace-nowrap shrink-0">{selectedStudents.size} selected</span>
                  <button
                    onClick={() => handleBulkStatusChange('present')}
                    className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200 whitespace-nowrap shrink-0"
                  >
                    P
                  </button>
                  <button
                    onClick={() => handleBulkStatusChange('absent')}
                    className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200 whitespace-nowrap shrink-0"
                  >
                    A
                  </button>
                  <button
                    onClick={() => handleBulkStatusChange('late')}
                    className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 whitespace-nowrap shrink-0"
                  >
                    L
                  </button>
                  <button
                    onClick={() => handleBulkStatusChange('excused')}
                    className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200 whitespace-nowrap shrink-0"
                  >
                    E
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      {selectedClassId && classStudents.length > 0 && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      )}

      {/* Student List */}
      {selectedClassId && classStudents.length > 0 ? (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredStudents.map((student) => {
            const status = studentStatuses[student.id] || 'present';
            const statusOption = ATTENDANCE_STATUS_OPTIONS.find((opt) => opt.value === status);
            const isSelected = selectedStudents.has(student.id);
            const hasExistingAttendance = existingAttendance !== null && existingAttendance !== undefined;

            return (
              <div
                key={student.id}
                className={`border rounded-lg p-4 ${
                  hasExistingAttendance
                    ? 'border-indigo-300 bg-indigo-50/30'
                    : isSelected ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                }`}
              >
                {hasExistingAttendance && (
                  <div className="mb-2 flex items-center text-xs text-indigo-600 font-medium">
                    <i className="fas fa-check-circle mr-1"></i>
                    <span>Attendance already marked</span>
                  </div>
                )}
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      const newSelected = new Set(selectedStudents);
                      if (e.target.checked) {
                        newSelected.add(student.id);
                      } else {
                        newSelected.delete(student.id);
                      }
                      setSelectedStudents(newSelected);
                    }}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{student.firstName} {student.lastName}</p>
                        {student.studentId && (
                          <p className="text-sm text-gray-500">ID: {student.studentId}</p>
                        )}
                      </div>
                      <select
                        value={status}
                        onChange={(e) => handleStatusChange(student.id, e.target.value as AttendanceStatus)}
                        disabled={hasExistingAttendance}
                        className={`rounded-md border-2 ${statusOption?.borderColor} focus:border-indigo-500 focus:ring-indigo-500 ${
                          hasExistingAttendance ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''
                        }`}
                      >
                        {ATTENDANCE_STATUS_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mt-2">
                      <button
                        onClick={() =>
                          setShowRemarks((prev) => ({
                            ...prev,
                            [student.id]: !prev[student.id],
                          }))
                        }
                        className="text-sm text-indigo-600 hover:text-indigo-700"
                      >
                        {showRemarks[student.id] ? 'Hide' : 'Add'} Remarks
                      </button>
                      {showRemarks[student.id] && (
                        <textarea
                          value={studentRemarks[student.id] || ''}
                          onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                          placeholder="Enter remarks (optional)"
                          maxLength={VALIDATION.REMARKS_MAX_LENGTH}
                          rows={2}
                          disabled={hasExistingAttendance}
                          className={`mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                            hasExistingAttendance ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''
                          }`}
                        />
                      )}
                      {studentRemarks[student.id] && (
                        <p className="text-xs text-gray-500 mt-1">
                          {studentRemarks[student.id].length}/{VALIDATION.REMARKS_MAX_LENGTH} characters
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : selectedClassId ? (
        <div className="text-center py-8 text-gray-500">
          <i className="fas fa-user-slash text-4xl mb-4"></i>
          <p>No students found in this class</p>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <i className="fas fa-chalkboard-teacher text-4xl mb-4"></i>
          <p>Please select a class to mark attendance</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-6 flex justify-end space-x-3">
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
        )}
        <button
          onClick={handleSubmit}
          disabled={markAttendance.isPending || updateAttendance.isPending || !selectedClassId}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {markAttendance.isPending || updateAttendance.isPending ? (
            <>
              <i className="fas fa-spinner fa-spin mr-2"></i>
              {existingAttendance ? 'Updating...' : 'Marking...'}
            </>
          ) : existingAttendance ? (
            'Update Attendance'
          ) : (
            'Mark Attendance'
          )}
        </button>
      </div>
    </div>
  );
};

