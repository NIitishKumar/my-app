/**
 * Timetable Slot Component
 * Individual class slot display
 */

import type { TimetableSlot as TimetableSlotType } from '../models/timetable.model';

interface TimetableSlotProps {
  slot: TimetableSlotType;
  isCurrent?: boolean;
  isPast?: boolean;
  onClick?: () => void;
}

const getTypeColor = (type?: string) => {
  switch (type) {
    case 'lab':
      return 'bg-purple-50 border-purple-200 text-purple-900';
    case 'tutorial':
      return 'bg-blue-50 border-blue-200 text-blue-900';
    default:
      return 'bg-indigo-50 border-indigo-200 text-indigo-900';
  }
};

const getStatusColor = (isCurrent: boolean, isPast: boolean) => {
  if (isCurrent) return 'ring-2 ring-indigo-400 bg-indigo-100 border-indigo-300';
  if (isPast) return 'opacity-60 bg-gray-50 border-gray-200';
  return '';
};

export const TimetableSlot = ({ slot, isCurrent = false, isPast = false, onClick }: TimetableSlotProps) => {
  const baseClasses = `p-3 sm:p-4 rounded-lg border transition-all ${getTypeColor(slot.type)} ${getStatusColor(isCurrent, isPast)}`;
  const hoverClasses = onClick ? 'cursor-pointer hover:shadow-md' : '';

  return (
    <div
      className={`${baseClasses} ${hoverClasses}`}
      onClick={onClick}
    >
      {isCurrent && (
        <div className="mb-2">
          <span className="px-2 py-0.5 bg-indigo-600 text-white text-xs font-semibold rounded">
            NOW
          </span>
        </div>
      )}

      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm sm:text-base mb-1 truncate">{slot.subject}</h3>
          {slot.subjectCode && (
            <p className="text-xs text-gray-600 mb-1">{slot.subjectCode}</p>
          )}
        </div>
        {slot.type && (
          <span className="px-2 py-0.5 bg-white bg-opacity-50 text-xs font-medium rounded capitalize flex-shrink-0">
            {slot.type}
          </span>
        )}
      </div>

      <div className="space-y-1.5 text-xs sm:text-sm">
        <div className="flex items-center gap-2 text-gray-700">
          <i className="fas fa-user text-gray-500 w-4 flex-shrink-0"></i>
          <span className="truncate">{slot.teacher.name}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <i className="fas fa-clock text-gray-500 w-4 flex-shrink-0"></i>
          <span>{slot.startTime} - {slot.endTime}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <i className="fas fa-door-open text-gray-500 w-4 flex-shrink-0"></i>
          <span>{slot.room}</span>
        </div>
      </div>
    </div>
  );
};

