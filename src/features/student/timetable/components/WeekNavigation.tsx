/**
 * Week Navigation Component
 * Controls for navigating between weeks
 */

interface WeekNavigationProps {
  weekStart: Date;
  weekEnd: Date;
  isCurrentWeek: boolean;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  onCurrentWeek: () => void;
}

const formatDateRange = (start: Date, end: Date): string => {
  const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return `${startStr} - ${endStr}`;
};

export const WeekNavigation = ({
  weekStart,
  weekEnd,
  isCurrentWeek,
  onPreviousWeek,
  onNextWeek,
  onCurrentWeek,
}: WeekNavigationProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 mb-4 sm:mb-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Week Info */}
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
            Week Schedule
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            {formatDateRange(weekStart, weekEnd)}
          </p>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onPreviousWeek}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
            aria-label="Previous week"
          >
            <i className="fas fa-chevron-left"></i>
          </button>

          <button
            onClick={onCurrentWeek}
            className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors ${
              isCurrentWeek
                ? 'bg-indigo-600 text-white cursor-not-allowed'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            disabled={isCurrentWeek}
            aria-label="Go to current week"
          >
            Today
          </button>

          <button
            onClick={onNextWeek}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
            aria-label="Next week"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

