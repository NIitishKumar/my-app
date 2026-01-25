/**
 * DateRangePicker Component
 * Date range selection component
 */

import React from 'react';
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
      <div className="flex-1 min-w-[140px] relative">
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
          dateFormat="yyyy-MM-dd"
          placeholderText="Select start date"
          isClearable
          showPopperArrow={false}
          popperPlacement="bottom-start"
          popperModifiers={[
            {
              name: 'offset',
              options: {
                offset: [0, 8],
              },
            },
            {
              name: 'preventOverflow',
              options: {
                rootBoundary: 'viewport',
                tether: false,
                altAxis: true,
              },
            },
          ]}
          calendarClassName="shadow-lg border border-gray-200 rounded-lg"
          wrapperClassName="w-full"
          popperClassName="z-50"
        />
      </div>
      <div className="flex-1 min-w-[140px] relative">
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
          dateFormat="yyyy-MM-dd"
          placeholderText="Select end date"
          isClearable
          showPopperArrow={false}
          popperPlacement="bottom-start"
          popperModifiers={[
            {
              name: 'offset',
              options: {
                offset: [0, 8],
              },
            },
            {
              name: 'preventOverflow',
              options: {
                rootBoundary: 'viewport',
                tether: false,
                altAxis: true,
              },
            },
          ]}
          calendarClassName="shadow-lg border border-gray-200 rounded-lg"
          wrapperClassName="w-full"
          popperClassName="z-50"
        />
      </div>
      <style>{`
        .react-datepicker-popper {
          z-index: 9999 !important;
        }
        .react-datepicker {
          font-family: inherit;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        .react-datepicker__header {
          background-color: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
        }
        .react-datepicker__current-month {
          font-weight: 600;
          color: #111827;
        }
        .react-datepicker__day--selected,
        .react-datepicker__day--in-range {
          background-color: #6366f1;
          color: white;
        }
        .react-datepicker__day--selected:hover,
        .react-datepicker__day--in-range:hover {
          background-color: #4f46e5;
        }
        .react-datepicker__day:hover {
          background-color: #e0e7ff;
        }
        .react-datepicker__day--keyboard-selected {
          background-color: #e0e7ff;
          color: #111827;
        }
        .react-datepicker__input-container input {
          width: 100%;
        }
      `}</style>
    </div>
  );
};

