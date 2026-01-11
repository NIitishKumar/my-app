/**
 * useAttendanceByLecture Hook
 * Get attendance records for a specific lecture
 */

import { useQuery } from '@tanstack/react-query';
import { attendanceApi } from '../api/attendance.api';
import { attendanceQueryKeys } from '../constants/attendance.constants';

export const useAttendanceByLecture = (classId: string, lectureId: string) => {
  return useQuery({
    queryKey: attendanceQueryKeys.byLecture(classId, lectureId),
    queryFn: () => attendanceApi.getByLecture(classId, lectureId),
    enabled: !!classId && !!lectureId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

