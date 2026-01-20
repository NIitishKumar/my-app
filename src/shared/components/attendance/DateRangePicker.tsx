/**
 * DateRangePicker Component
 * Date range selection component
 */

import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (start: Date | null, end: Date | null) => void;
  className?: string;
  maxDate?: Date;
  minDate?: Date;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onChange,
  className = '',
  maxDate,
  minDate,
}) => {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <div className="flex-1 min-w-[140px]">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Start Date
        </label>
        <DatePicker
          selected={startDate}
          onChange={(date) => onChange(date, endDate)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          maxDate={endDate || maxDate}
          minDate={minDate}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          dateFormat="MMM dd, yyyy"
          placeholderText="Select start date"
        />
      </div>
      <div className="flex-1 min-w-[140px]">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          End Date
        </label>
        <DatePicker
          selected={endDate}
          onChange={(date) => onChange(startDate, date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate || minDate}
          maxDate={maxDate}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          dateFormat="MMM dd, yyyy"
          placeholderText="Select end date"
        />
      </div>
    </div>
  );
};

