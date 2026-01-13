/**
 * PendingAttendanceList Component
 * List of classes that need attendance marked today
 */

import { useAssignedClasses } from '../../hooks/useTeacher';
import { useAttendanceDashboard } from '../hooks/useAttendanceDashboard';
import { QuickMarkCard } from './QuickMarkCard';
import type { AssignedClass } from '../../models/teacher.model';
import type { UpcomingClassItem } from '../types/attendance.types';

interface PendingAttendanceListProps {
  onClassSelect?: (classId: string) => void;
}

export const PendingAttendanceList = ({ onClassSelect }: PendingAttendanceListProps) => {
  const { data: classes = [], isLoading: isLoadingClasses } = useAssignedClasses();
  const { data: dashboardData, isLoading: isLoadingDashboard } = useAttendanceDashboard();
  const isLoading = isLoadingClasses || isLoadingDashboard;

  // Get pending classes from dashboard data or show all classes as pending
  const pendingClasses: UpcomingClassItem[] = dashboardData?.upcomingClasses
    ?.filter((classItem) => !classItem.hasAttendance) || classes.map((cls: AssignedClass) => ({
      classId: cls.id,
      className: cls.name,
      scheduledTime: cls.schedule || 'Not scheduled',
      hasAttendance: false,
    }));

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (pendingClasses.length === 0) {
    return (
      <div className="text-center py-8">
        <i className="fas fa-check-circle text-green-500 text-4xl mb-4"></i>
        <p className="text-gray-600 font-medium">All attendance marked for today!</p>
        <p className="text-sm text-gray-500 mt-1">No pending classes requiring attendance.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
          Pending Attendance ({pendingClasses.length})
        </h3>
      </div>
      {pendingClasses.map((classItem) => (
        <QuickMarkCard
          key={classItem.classId}
          classItem={classItem}
          onQuickMark={(classId) => onClassSelect?.(classId)}
        />
      ))}
    </div>
  );
};

