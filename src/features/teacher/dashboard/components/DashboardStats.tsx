/**
 * DashboardStats Component
 * Statistics cards for teacher dashboard
 */

import { useMemo } from 'react';
import { useTeacherClasses } from '../../classes/hooks/useTeacherClasses';
import { DashboardStatsSkeleton } from '../../../../shared/components/skeletons';

export const DashboardStats = () => {
  const { data: classes = [], isLoading: isLoadingClasses } = useTeacherClasses();

  // Calculate total students across all classes
  const totalStudents = useMemo(() => {
    return classes.reduce((sum, cls) => sum + cls.enrolled, 0);
  }, [classes]);

  // Calculate overall attendance rate
  const overallAttendanceRate = useMemo(() => {
    if (classes.length === 0) return 0;
    const totalRate = classes.reduce((sum, cls) => sum + (cls.attendanceRate ?? 0), 0);
    const average = totalRate / classes.length;
    return isNaN(average) ? 0 : average;
  }, [classes]);

  // Get today's date
  const today = new Date();
  const todayString = today.toISOString().split('T')[0];

  // Count classes that need attendance today
  const pendingAttendanceCount = useMemo(() => {
    return classes.filter((cls) => {
      const lastDate = cls.lastAttendanceDate;
      if (!lastDate) return true; // Never marked
      const lastDateString = lastDate.toISOString().split('T')[0];
      return lastDateString !== todayString;
    }).length;
  }, [classes, todayString]);

  if (isLoadingClasses) {
    return <DashboardStatsSkeleton />;
  }

  const statCards = [
    {
      label: 'Assigned Classes',
      value: classes.length,
      icon: 'fa-chalkboard-teacher',
      color: 'indigo',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      borderColor: 'border-indigo-200',
    },
    {
      label: 'Total Students',
      value: totalStudents,
      icon: 'fa-user-graduate',
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200',
    },
    {
      label: 'Overall Attendance',
      value: overallAttendanceRate != null && !isNaN(overallAttendanceRate) 
        ? `${overallAttendanceRate.toFixed(1)}%`
        : 'N/A',
      icon: 'fa-chart-line',
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      borderColor: 'border-green-200',
    },
    {
      label: 'Pending Attendance',
      value: pendingAttendanceCount,
      icon: 'fa-clock',
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      borderColor: 'border-yellow-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {statCards.map((card) => (
        <div
          key={card.label}
          className={`bg-white rounded-xl shadow-sm border ${card.borderColor} p-4 sm:p-6`}
        >
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{card.label}</p>
              <p className={`mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold ${card.textColor} break-words`}>
                {card.value}
              </p>
            </div>
            <div className={`${card.bgColor} p-2 sm:p-3 rounded-lg flex-shrink-0 ml-2`}>
              <i className={`fas ${card.icon} ${card.textColor} text-xl sm:text-2xl`}></i>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

