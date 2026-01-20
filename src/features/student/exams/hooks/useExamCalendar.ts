/**
 * useExamCalendar Hook
 * Get exam calendar for a specific month
 */

import { useQuery } from '@tanstack/react-query';
import { studentExamService } from '../api/exams.service';
import { examQueryKeys } from './useExams';
import type { ExamCalendar } from '../types/exam.types';

export const useExamCalendar = (year: number, month: number) => {
  return useQuery<ExamCalendar>({
    queryKey: examQueryKeys.calendarWithParams(year, month),
    queryFn: () => studentExamService.getExamCalendar(year, month),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};


