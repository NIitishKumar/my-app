/**
 * useAttendanceStats Hook - Calculate attendance statistics
 */

import { useMemo } from 'react';
import { useClassAttendance } from './useClassAttendance';
import {
  calculateAttendanceStats,
  calculateStudentAttendanceStats,
} from '../utils/attendance.utils';
import type { StudentAttendanceStats } from '../types/attendance.types';

export const useAttendanceStats = (classId: string) => {
  const { data: records = [], isLoading, error } = useClassAttendance(classId);

  const stats = useMemo(() => {
    if (!records || records.length === 0) {
      return {
        totalDays: 0,
        presentDays: 0,
        absentDays: 0,
        lateDays: 0,
        excusedDays: 0,
        percentage: 0,
      };
    }
    return calculateAttendanceStats(records);
  }, [records]);

  return {
    stats,
    isLoading,
    error,
  };
};

export const useStudentAttendanceStats = (
  classId: string,
  studentId: string,
  studentName: string
) => {
  const { data: records = [], isLoading, error } = useClassAttendance(classId);

  const stats = useMemo((): StudentAttendanceStats => {
    if (!records || records.length === 0) {
      return {
        studentId,
        studentName,
        totalDays: 0,
        presentDays: 0,
        absentDays: 0,
        lateDays: 0,
        excusedDays: 0,
        percentage: 0,
      };
    }
    return calculateStudentAttendanceStats(records, studentId, studentName);
  }, [records, studentId, studentName]);

  return {
    stats,
    isLoading,
    error,
  };
};

