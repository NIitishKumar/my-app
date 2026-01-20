/**
 * ExamFilters Component
 * Filter controls for exam schedule
 */

import React, { useState } from 'react';
import { DateRangePicker } from '../../../../shared/components/attendance/DateRangePicker';
import type { ExamStatus } from '../types/exam.types';

interface ExamFiltersProps {
  onFilterChange: (filters: {
    status?: ExamStatus;
    subject?: string;
    startDate?: string;
    endDate?: string;
  }) => void;
  className?: string;
}

export const ExamFilters: React.FC<ExamFiltersProps> = ({
  onFilterChange,
  className = '',
}) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [status, setStatus] = useState<ExamStatus | ''>('');
  const [subject, setSubject] = useState('');

  const handleDateRangeChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
    onFilterChange({
      status: status || undefined,
      subject: subject || undefined,
      startDate: start ? start.toISOString().split('T')[0] : undefined,
      endDate: end ? end.toISOString().split('T')[0] : undefined,
    });
  };

  const handleStatusChange = (newStatus: ExamStatus | '') => {
    setStatus(newStatus);
    onFilterChange({
      status: newStatus || undefined,
      subject: subject || undefined,
      startDate: startDate ? startDate.toISOString().split('T')[0] : undefined,
      endDate: endDate ? endDate.toISOString().split('T')[0] : undefined,
    });
  };

  const handleSubjectChange = (newSubject: string) => {
    setSubject(newSubject);
    onFilterChange({
      status: status || undefined,
      subject: newSubject || undefined,
      startDate: startDate ? startDate.toISOString().split('T')[0] : undefined,
      endDate: endDate ? endDate.toISOString().split('T')[0] : undefined,
    });
  };

  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
    setStatus('');
    setSubject('');
    onFilterChange({});
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex-1 min-w-[280px]">
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onChange={handleDateRangeChange}
          />
        </div>

        <div className="min-w-[140px]">
          <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value as ExamStatus | '')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          >
            <option value="">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="scheduled">Scheduled</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="graded">Graded</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="min-w-[140px]">
          <label className="block text-xs font-medium text-gray-700 mb-1">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => handleSubjectChange(e.target.value)}
            placeholder="Search subject..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          />
        </div>

        <button
          onClick={handleClear}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};


