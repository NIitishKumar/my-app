/**
 * AttendanceChart Component
 * Visual charts showing attendance trends
 */

import { useMemo } from 'react';
import { useTeacherClasses } from '../../classes/hooks/useTeacherClasses';

export const AttendanceChart = () => {
  const { data: classes = [], isLoading } = useTeacherClasses();

  // Calculate attendance data for chart
  const chartData = useMemo(() => {
    return classes
      .filter((cls) => cls.attendanceRate != null && !isNaN(cls.attendanceRate))
      .map((cls) => ({
        name: cls.className,
        rate: cls.attendanceRate ?? 0,
      }))
      .sort((a, b) => b.rate - a.rate)
      .slice(0, 5); // Top 5 classes
  }, [classes]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <i className="fas fa-chart-bar text-indigo-600"></i>
          <span>Attendance Overview</span>
        </h2>
        <div className="text-center py-8 text-gray-500">
          <i className="fas fa-chart-line text-4xl mb-3 text-gray-400"></i>
          <p>No attendance data available</p>
        </div>
      </div>
    );
  }

  const maxRate = Math.max(...chartData.map((d) => d.rate), 100);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
      <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center space-x-2">
        <i className="fas fa-chart-bar text-indigo-600 flex-shrink-0"></i>
        <span className="truncate">Attendance Overview</span>
      </h2>

      <div className="space-y-4">
        {chartData.map((item) => {
          const percentage = (item.rate / maxRate) * 100;
          const colorClass =
            item.rate >= 90
              ? 'bg-green-600'
              : item.rate >= 75
              ? 'bg-yellow-600'
              : 'bg-red-600';

          return (
            <div key={item.name}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">{item.name}</span>
                <span className="text-sm font-semibold text-gray-900">
                  {item.rate != null && !isNaN(item.rate) ? item.rate.toFixed(1) + '%' : 'N/A'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`${colorClass} h-3 rounded-full transition-all duration-300`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {classes.length > 5 && (
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Showing top 5 classes by attendance rate
          </p>
        </div>
      )}
    </div>
  );
};

