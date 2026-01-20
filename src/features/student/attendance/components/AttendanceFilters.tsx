/**
 * AttendanceFilters Component
 * Filter controls for attendance records
 */

import React, { useState } from 'react';
import { DateRangePicker } from '../../../../shared/components/attendance/DateRangePicker';
import type { AttendanceStatus } from '../types/attendance.types';

interface AttendanceFiltersProps {
  onFilterChange: (filters: {
    startDate?: string;
    endDate?: string;
    classId?: string;
    status?: AttendanceStatus;
  }) => void;
  className?: string;
}

export const AttendanceFilters: React.FC<AttendanceFiltersProps> = ({
  onFilterChange,
  className = '',
}) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [status, setStatus] = useState<AttendanceStatus | ''>('');

  const handleDateRangeChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
    onFilterChange({
      startDate: start ? start.toISOString().split('T')[0] : undefined,
      endDate: end ? end.toISOString().split('T')[0] : undefined,
      status: status || undefined,
    });
  };

  const handleStatusChange = (newStatus: AttendanceStatus | '') => {
    setStatus(newStatus);
    onFilterChange({
      startDate: startDate ? startDate.toISOString().split('T')[0] : undefined,
      endDate: endDate ? endDate.toISOString().split('T')[0] : undefined,
      status: newStatus || undefined,
    });
  };

  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
    setStatus('');
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
            maxDate={new Date()}
          />
        </div>

        <div className="min-w-[140px]">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value as AttendanceStatus | '')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          >
            <option value="">All Status</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="late">Late</option>
            <option value="excused">Excused</option>
          </select>
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

