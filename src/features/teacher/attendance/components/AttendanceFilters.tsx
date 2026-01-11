/**
 * AttendanceFilters Component
 * Reusable filter panel for attendance records
 */

import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useClasses } from '../../../admin/classes/hooks/useClasses';
import { ATTENDANCE_STATUS_OPTIONS } from '../constants/attendance.constants';
import type { AttendanceFilters as AttendanceFiltersType } from '../types/attendance.types';
import type { Class } from '../../../admin/classes/types/classes.types';

interface AttendanceFiltersProps {
  filters: AttendanceFiltersType;
  onFiltersChange: (filters: AttendanceFiltersType) => void;
  onReset: () => void;
  showStatusFilter?: boolean;
}

export const AttendanceFilters = ({
  filters,
  onFiltersChange,
  onReset,
  showStatusFilter = true,
}: AttendanceFiltersProps) => {
  const { data: classes = [] } = useClasses();
  const [localFilters, setLocalFilters] = useState<AttendanceFiltersType>(filters);

  const handleFilterChange = (key: keyof AttendanceFiltersType, value: any) => {
    const updatedFilters = { ...localFilters, [key]: value };
    setLocalFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const handleReset = () => {
    const resetFilters: AttendanceFiltersType = {};
    setLocalFilters(resetFilters);
    onReset();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={handleReset}
          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
        >
          Reset
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Class Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
          <select
            value={localFilters.classId || ''}
            onChange={(e) => handleFilterChange('classId', e.target.value || undefined)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">All Classes</option>
            {classes.map((cls: Class) => (
              <option key={cls.id} value={cls.id}>
                {cls.className}
              </option>
            ))}
          </select>
        </div>

        {/* Start Date Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <DatePicker
            selected={localFilters.startDate ? new Date(localFilters.startDate) : null}
            onChange={(date: Date | null) => 
              handleFilterChange('startDate', date ? date.toISOString().split('T')[0] : undefined)
            }
            dateFormat="yyyy-MM-dd"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholderText="Select start date"
          />
        </div>

        {/* End Date Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <DatePicker
            selected={localFilters.endDate ? new Date(localFilters.endDate) : null}
            onChange={(date: Date | null) => 
              handleFilterChange('endDate', date ? date.toISOString().split('T')[0] : undefined)
            }
            dateFormat="yyyy-MM-dd"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholderText="Select end date"
          />
        </div>

        {/* Status Filter */}
        {showStatusFilter && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={localFilters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">All Statuses</option>
              {ATTENDANCE_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

